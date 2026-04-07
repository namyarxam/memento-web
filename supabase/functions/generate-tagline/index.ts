import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  // Handle both webhook (has record) and on-demand (has capture_id) payloads
  const body = await req.json()
  const capture = body.record ?? null
  const captureId = capture?.id ?? body.capture_id

  if (!captureId) {
    return new Response(JSON.stringify({ error: "No capture ID" }), { status: 400, headers: corsHeaders })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // If called on-demand, fetch the capture
  let text = ""
  if (capture) {
    text = extractText(capture)
  } else {
    const { data } = await supabase
      .from("captures")
      .select("text, blocks, tagline")
      .eq("id", captureId)
      .single()

    if (!data) {
      return new Response(JSON.stringify({ error: "Capture not found" }), { status: 404, headers: corsHeaders })
    }
    if (data.tagline) {
      return new Response(JSON.stringify({ tagline: data.tagline }), { headers: corsHeaders })
    }
    text = extractText(data)
  }

  if (!text.trim()) {
    return new Response(JSON.stringify({ error: "No text to summarize" }), { status: 400, headers: corsHeaders })
  }

  // Call Claude Haiku
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 30,
      messages: [
        {
          role: "user",
          content: `Summarize this captured AI conversation snippet in one single line under 57 characters. Be specific — mention the actual topic. No quotes, no punctuation at the end. No line breaks.\n\n${text.slice(0, 2000)}`,        },
      ],
    }),
  })

  const result = await response.json()
  const tagline = result.content?.[0]?.text?.trim() ?? ""

  if (tagline) {
    await supabase.from("captures").update({ tagline }).eq("id", captureId)
  }

  return new Response(JSON.stringify({ tagline }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})

function extractText(capture: { text?: string; blocks?: { text: string; role?: string }[] }): string {
  if (capture.blocks?.length) {
    return capture.blocks.map((b) => `${b.role ?? "unknown"}: ${b.text}`).join("\n")
  }
  return capture.text ?? ""
}
