import { useEffect, useState, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import Header from './components/Header'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import Privacy from './components/Privacy'
import './App.css'

function AppRoutes() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      if (!session && window.location.pathname === '/dashboard') navigate('/', { replace: true })
      initialized.current = true
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (!initialized.current) return
      if (event === 'SIGNED_IN') navigate('/dashboard')
      else if (event === 'SIGNED_OUT') navigate('/')
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (loading) return null

  return (
    <>
      <Header session={session} onSignIn={signIn} onSignOut={signOut} />
      <Routes>
        <Route path="/" element={
          session ? <Navigate to="/dashboard" replace /> : <Landing onSignIn={signIn} />
        } />
        <Route path="/dashboard" element={
          session ? <Dashboard session={session} /> : <Navigate to="/" replace />
        } />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
