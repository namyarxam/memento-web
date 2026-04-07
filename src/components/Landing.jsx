import { Link } from 'react-router-dom'

export default function Landing({ session, onSignIn }) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-icon">
          <svg width="28" height="36" viewBox="0 0 12 15" fill="none">
            <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h9A1.5 1.5 0 0 1 12 1.5V14l-3.5-7.5L6 14l-3.5-7.5L0 14V1.5z" fill="#4aba6a"/>
          </svg>
        </div>

        <h1>Remember the best things AI tells you</h1>

        <div className="hero-logos">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M16.98 11.39l-5.505-8.672a1.4 1.4 0 0 0-1.088-.568 1.376 1.376 0 0 0-1.332.9l-5.677 14.66a1.376 1.376 0 0 0 .108 1.2c.25.387.672.63 1.132.642l6.44.168a.68.68 0 0 0 .528-.24.72.72 0 0 0-.012-.96.68.68 0 0 0-.468-.228l-6.1-.156 5.4-13.944 5.232 8.232a.69.69 0 0 0 .576.312.69.69 0 0 0 .588-.324.72.72 0 0 0 .012-.744l-.144-.228-.096-.048zm2.1 5.16l-5.1-8.028a.69.69 0 0 0-.576-.312.69.69 0 0 0-.588.324.72.72 0 0 0-.012.744l4.86 7.656-12.54-.324 3.06-7.884a.72.72 0 0 0-.06-.636.69.69 0 0 0-.528-.324.68.68 0 0 0-.576.192.72.72 0 0 0-.18.384l-3.36 8.664a1.38 1.38 0 0 0-.108 1.2c.25.384.672.624 1.128.636l13.14.348a1.38 1.38 0 0 0 1.2-.564 1.38 1.38 0 0 0 .24-1.08z" fill="#D97757"/></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.05 6.05 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.05 6.05 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#10a37f"/></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" fill="url(#g-grad)"/><defs><linearGradient id="g-grad" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#1C7EF2"/><stop offset="1" stopColor="#A855F7"/></linearGradient></defs></svg>
        </div>

        <p className="hero-sub">
          Your AI tools have memory, and your chat history keeps growing — but when you need
          to find <em>that one thing</em> from three weeks ago, it's buried. Memento lets you
          capture the moments worth keeping in one gesture, so you never lose an insight to
          infinite scroll again.
        </p>

        <div className="hero-cta">
          {session ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <button className="btn btn-primary" onClick={onSignIn}>
              Get Started
            </button>
          )}
          <a className="btn" href="https://chromewebstore.google.com" target="_blank" rel="noreferrer">
            Chrome Extension
          </a>
        </div>
      </section>

      <section className="how-section">
        <h2>How it works</h2>
        <div className="how-grid">
          <div className="how-step">
            <div className="how-step-num">1</div>
            <h3>Capture</h3>
            <p>
              Works with Claude, ChatGPT, and Gemini. Select individual text blocks with a
              click, or hold and drag to sweep a whole section.
            </p>
          </div>
          <div className="how-step">
            <div className="how-step-num">2</div>
            <h3>Organize</h3>
            <p>
              Your mementos sync to a personal dashboard. Create color-coded boxes to sort
              them by project, topic, or however your brain works.
            </p>
          </div>
          <div className="how-step">
            <div className="how-step-num">3</div>
            <h3>Revisit</h3>
            <p>
              Browse your collected insights at a glance. Every memento links back to the
              original conversation so you can pick up where you left off.
            </p>
          </div>
        </div>
      </section>

      <section className="crossover">
        <h2>The extension captures. The dashboard organizes.</h2>
        <p>
          Memento lives in your browser as a lightweight Chrome extension. When something
          clicks in a conversation — an insight, a solution, a creative direction — capture it
          in one gesture. Your dashboard is where those fragments become organized knowledge.
        </p>

        <div className="crossover-cards">
          <div className="crossover-card">
            <h3>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect width="16" height="16" rx="3" fill="#44403c"/>
                <path d="M4.5 3a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v9.5l-2-3.5L7.5 12.5l-2-3.5L4.5 12.5V3z" fill="#4aba6a"/>
              </svg>
              Chrome Extension
            </h3>
            <p>
              Works on any page. Click or drag to select text. One click saves it to your
              account. No API keys, no setup friction.
            </p>
          </div>
          <div className="crossover-card">
            <h3>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3" stroke="#e7e5e4" fill="white"/>
                <rect x="3" y="3" width="4" height="4" rx="1" fill="#4aba6a" opacity="0.7"/>
                <rect x="9" y="3" width="4" height="4" rx="1" fill="#3b82f6" opacity="0.7"/>
                <rect x="3" y="9" width="4" height="4" rx="1" fill="#f59e0b" opacity="0.7"/>
                <rect x="9" y="9" width="4" height="4" rx="1" fill="#ec4899" opacity="0.7"/>
              </svg>
              Web Dashboard
            </h3>
            <p>
              View all your mementos in one place. Organize with color-coded boxes. Compact
              taglines let you scan months of insights in seconds.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
