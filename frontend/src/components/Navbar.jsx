import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Left side — logo */}
        <div className="navbar__left">
          <div className="navbar__brand">
            <svg
              className="navbar__logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="3" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 8l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="navbar__logo-text">Claro</span>
          </div>
        </div>

        {/* Right side — nav links + Sign In */}
        <div className="navbar__right">
          <a href="#features" className="navbar__link">Features</a>
          <a href="#about" className="navbar__link">About</a>
          <a href="/login" className="navbar__cta">
            Sign In
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
