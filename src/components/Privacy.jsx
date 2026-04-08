export default function Privacy() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1>Privacy Policy</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Last updated: April 8, 2026</p>

      <h2>What Memento collects</h2>
      <p>When you use the Memento Chrome extension and web dashboard, we collect:</p>
      <ul>
        <li><strong>Account information</strong> — your name and email address from Google sign-in, used solely for authentication.</li>
        <li><strong>Captured text</strong> — text snippets you explicitly select and save from web pages using the extension.</li>
        <li><strong>Page URLs</strong> — the URL of the page where you made a capture, so you can navigate back to the source.</li>
        <li><strong>Authentication tokens</strong> — stored locally in your browser to keep you signed in. These are never sent to third parties.</li>
      </ul>

      <h2>How we use your data</h2>
      <p>Your data is used exclusively to provide the Memento service — saving, organizing, and displaying your captured text snippets. We do not:</p>
      <ul>
        <li>Sell or transfer your data to third parties</li>
        <li>Use your data for advertising or marketing</li>
        <li>Use your data for purposes unrelated to the extension's functionality</li>
        <li>Use your data to determine creditworthiness or for lending purposes</li>
      </ul>

      <h2>Where your data is stored</h2>
      <p>Your data is stored securely in Supabase (hosted on AWS). Authentication tokens are stored locally in your browser via <code>chrome.storage.local</code>.</p>

      <h2>Data deletion</h2>
      <p>You can delete individual captures from the Memento dashboard at any time. To delete your account and all associated data, contact us at the email below.</p>

      <h2>Contact</h2>
      <p>If you have questions about this privacy policy, contact us at <strong>maxwellrayman@gmail.com</strong>.</p>
    </div>
  )
}
