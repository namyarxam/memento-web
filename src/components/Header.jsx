import { Link, useLocation } from 'react-router-dom'

const Logo = () => (
  <div className="header-logo-icon">
    <svg width="14" height="18" viewBox="0 0 12 15" fill="none">
      <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h9A1.5 1.5 0 0 1 12 1.5V14l-3.5-7.5L6 14l-3.5-7.5L0 14V1.5z" fill="#4aba6a"/>
    </svg>
  </div>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2.5 16c0-3.5 2.9-5.5 6.5-5.5s6.5 2 6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export default function Header({ session, onSignIn, onSignOut }) {
  const location = useLocation()

  return (
    <header className="header">
      <div className="header-inner">
        <Link to={session ? '/dashboard' : '/'} className="header-logo">
          <Logo />
          <span>Memento</span>
        </Link>

        <nav className="header-nav">
          {session && (
            <Link
              to="/dashboard"
              className={`header-nav-link${location.pathname === '/dashboard' ? ' active' : ''}`}
            >
              Dashboard
            </Link>
          )}

          {session ? (
            <div className="header-user">
              <button className="header-avatar-btn">
                <UserIcon />
              </button>
              <div className="header-dropdown">
                <div className="header-dropdown-inner">
                  <div className="header-dropdown-email">{session.user.email}</div>
                  <button className="header-dropdown-item" onClick={onSignOut}>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button className="btn btn-sm btn-primary" onClick={onSignIn}>Sign in</button>
          )}
        </nav>
      </div>
    </header>
  )
}
