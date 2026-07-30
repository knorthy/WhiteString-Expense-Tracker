import claroLogo from '../assets/Claro.png'
import './Navbar.css'

// top navigation bar shown on LandingPage.jsx only
// logo links back to / and nav links scroll to section ids on the landing page
function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* logo routes to landing page */}
        <div className="navbar__left">
          <a href="/" className="navbar__brand">
            <img src={claroLogo} alt="Claro logo" className="navbar__logo-icon" />
            <span className="navbar__logo-text">Claro</span>
          </a>
        </div>

        {/* About scrolls to features section, Feedbacks scrolls to feedback form section */}
        <div className="navbar__right">
          <a href="#about" className="navbar__link">About</a>
          <a href="#feedback" className="navbar__link">Feedbacks</a>
          <a href="/login" className="navbar__cta">
            Sign In
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
