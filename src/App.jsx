import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [captures, setCaptures] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setCaptures([])
      setLoading(false)
      return
    }

    setLoading(true)
    supabase
      .from('captures')
      .select('id, text, url, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setCaptures(data ?? [])
        setLoading(false)
      })
  }, [session])

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function confirmDelete() {
    const id = pendingDeleteId
    setPendingDeleteId(null)
    const { error } = await supabase.from('captures').delete().eq('id', id)
    if (error) {
      console.error('Delete failed:', error)
    } else {
      setCaptures((prev) => prev.filter((c) => c.id !== id))
    }
  }

  if (!session) {
    return (
      <div className="centered">
        <h1>Capture Brick</h1>
        <p>Sign in to view your captured snippets.</p>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <h1>Capture Brick</h1>
        <div className="user-row">
          <span>{session.user.email}</span>
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>

      <main>
        {loading ? (
          <p>Loading…</p>
        ) : captures.length === 0 ? (
          <p>No captures yet. Use the extension to save snippets.</p>
        ) : (
          <ul className="capture-list">
            {captures.map((c) => (
              <li key={c.id} className="capture-item">
                <p className="capture-text">{c.text}</p>
                <a href={c.url} target="_blank" rel="noreferrer" className="capture-url">
                  {c.url}
                </a>
                <div className="capture-footer">
                  <time className="capture-time">
                    {new Date(c.created_at).toLocaleString()}
                  </time>
                  <button className="delete-btn" onClick={() => setPendingDeleteId(c.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {pendingDeleteId && (
        <div className="modal-overlay" onClick={() => setPendingDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>Delete this snippet?</p>
            <div className="modal-actions">
              <button onClick={() => setPendingDeleteId(null)}>Cancel</button>
              <button className="delete-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
