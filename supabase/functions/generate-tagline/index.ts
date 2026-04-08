import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ALLOWED_ORIGINS = [
  "https://memento-web-jet.vercel.app",
  "http://localhost:5173",
]

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? ""
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  }
}

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const DAILY_LIMIT = 100

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) })
  }

  // Handle both webhook (has record) and on-demand (has capture_id) payloads
  const body = await req.json()
  const capture = body.record ?? null
  const captureId = capture?.id ?? body.capture_id

  if (!captureId) {
    return new Response(JSON.stringify({ error: "No capture ID" }), { status: 400, headers: getCorsHeaders(req) })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Rate limit: 100 requests per user per day
  const authHeader = req.headers.get("authorization")?.replace("Bearer ", "") ?? ""
  const userClient = createClient(SUPABASE_URL, authHeader ? Deno.env.get("SUPABASE_ANON_KEY")! : SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: `Bearer ${authHeader}` } },
  })
  const { data: { user } } = await userClient.auth.getUser(authHeader)
  const userId = user?.id ?? capture?.user_id

  if (userId) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from("tagline_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", since)

    if ((count ?? 0) >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ error: "Daily tagline limit reached. Try again tomorrow." }),
        { status: 429, headers: getCorsHeaders(req) }
      )
    }
  }

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
      return new Response(JSON.stringify({ error: "Capture not found" }), { status: 404, headers: getCorsHeaders(req) })
    }
    if (data.tagline) {
      return new Response(JSON.stringify({ tagline: data.tagline }), { headers: getCorsHeaders(req) })
    }
    text = extractText(data)
  }

  if (!text.trim()) {
    return new Response(JSON.stringify({ error: "No text to summarize" }), { status: 400, headers: getCorsHeaders(req) })
  }

  // Track this request for rate limiting
  if (userId) {
    await supabase.from("tagline_rate_limits").insert({ user_id: userId })
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
      max_tokens: 60,
      messages: [
        {
          role: "user",
          content: `Summarize this captured AI conversation snippet in one single line under 57 characters. Be specific — mention the actual topic. No quotes, no punctuation at the end. No line breaks.\n\n${text.slice(0, 2000)}`,        },
      ],
    }),
  })

  if (!response.ok) {
    console.error("Anthropic API error:", response.status, await response.text())
    return new Response(JSON.stringify({ error: "Tagline generation failed" }), {
      status: 502,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    })
  }

  const result = await response.json()
  const tagline = result.content?.[0]?.text?.trim() ?? ""

  if (!tagline) {
    return new Response(JSON.stringify({ error: "Tagline generation failed" }), {
      status: 502,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    })
  }

  if (tagline) {
    await supabase.from("captures").update({ tagline }).eq("id", captureId)
  }

  return new Response(JSON.stringify({ tagline }), {
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  })
})

function extractText(capture: { text?: string; blocks?: { text: string; role?: string }[] }): string {
  if (capture.blocks?.length) {
    return capture.blocks.map((b) => `${b.role ?? "unknown"}: ${b.text}`).join("\n")
  }
  return capture.text ?? ""
}
