import claroLogo from '../assets/Claro.png'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Left side — logo */}
        <div className="navbar__left">
          <div className="navbar__brand">
            <img src={claroLogo} alt="Claro logo" className="navbar__logo-icon" />
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
