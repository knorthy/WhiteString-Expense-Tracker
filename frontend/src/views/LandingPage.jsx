import FaultyTerminal from '../components/FaultyTerminal'
import Navbar from '../components/Navbar'
import CardSwap, { Card } from '../components/CardSwap'
import dashboardImg from '../assets/overview/dashboard.png'
import transactionsImg from '../assets/overview/transactions.png'
import walletsImg from '../assets/overview/wallets.png'
import './LandingPage.css'

function LandingPage() {
  return (
    <>
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <Navbar />
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#A7EF9E"
          mouseReact
          mouseStrength={0.5}
          pageLoadAnimation
          brightness={0.6}
        />

        <div className="hero">
          <div className="hero__badge">
            Join the movement toward financial freedom.
          </div>

          <h1 className="hero__title">Claro Expense Tracker</h1>

          <p className="hero__subtext">
            <em className="hero__subtext-tagline">
              Master your money today to protect your tomorrow.
            </em>
            <span className="hero__subtext-body">
              Claro provides a structured approach to managing your daily expenses,
              ultimately leading to a more secure financial future.
            </span>
          </p>

          <div className="hero__actions">
            <a href="/register" className="hero__btn hero__btn--primary" style={{ pointerEvents: 'auto' }}>
              Get Started
            </a>
            <a
              href="https://github.com/knorthy/WhiteString-Expense-Tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__btn hero__btn--secondary"
              style={{ pointerEvents: 'auto' }}
            >
              {/* GitHub icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="hero__btn-icon">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Contribute
            </a>
          </div>
        </div>
      </div>

      <section id="about" className="features-section">
        <div className="features-section__text">
          <h2 className="features-section__title">
            Finance, made claro.
          </h2>
          <p className="features-section__subtitle">
            Built for people tired of guessing where their money went. Claro started as a simple idea: personal finance shouldn't require a spreadsheet degree.
          </p>
          <a href="https://app.supademo.com/demo/cms6531hp05a2100j3ck1kx07?utm_source=link" target="_blank" rel="noopener noreferrer" className="features-section__btn">
            How to use Claro
          </a>
        </div>

        <CardSwap
          width={780}
          height={600}
          cardDistance={55}
          verticalDistance={65}
          delay={1800}
          pauseOnHover={true}
          easing="linear"
        >
          <Card className="feature-card">
            <div className="feature-card__content">
              <div className="feature-card__header">
                <div className="feature-card__icon">●</div>
                <h3 className="feature-card__title">Smooth</h3>
              </div>
              <div className="feature-card__image-wrap">
                <img src={dashboardImg} alt="Dashboard overview" className="feature-card__image" />
              </div>
            </div>
          </Card>
          <Card className="feature-card">
            <div className="feature-card__content">
              <div className="feature-card__header">
                <div className="feature-card__icon">≋</div>
                <h3 className="feature-card__title">Customizable</h3>
              </div>
              <div className="feature-card__image-wrap">
                <img src={transactionsImg} alt="Transactions overview" className="feature-card__image" />
              </div>
            </div>
          </Card>
          <Card className="feature-card">
            <div className="feature-card__content">
              <div className="feature-card__header">
                <div className="feature-card__icon">&lt;/&gt;</div>
                <h3 className="feature-card__title">Reliable</h3>
              </div>
              <div className="feature-card__image-wrap">
                <img src={walletsImg} alt="Wallets overview" className="feature-card__image" />
              </div>
            </div>
          </Card>
        </CardSwap>
      </section>

      <section id="feedback" className="bottom-section">
        <div className="bottom-section__inner">

          {/* Left — brand + tagline + links */}
          <div className="bottom-section__brand">
            <div className="footer__brand">
              <img src="/favicon.png" alt="Claro logo" className="footer__logo" />
              <span className="footer__brand-name">Claro</span>
            </div>
            <p className="bottom-section__tagline">
              Personal finance shouldn't require a spreadsheet degree. Claro makes it simple.
            </p>
            <nav className="bottom-section__nav" aria-label="Footer navigation">
              <a href="/" className="bottom-section__nav-link">Home</a>
              <a href="#about" className="bottom-section__nav-link">About</a>
              <a
                href="https://app.supademo.com/demo/cms6531hp05a2100j3ck1kx07?utm_source=link"
                target="_blank"
                rel="noopener noreferrer"
                className="bottom-section__nav-link"
              >
                How to Use
              </a>
              <a
                href="https://github.com/knorthy/WhiteString-Expense-Tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="bottom-section__nav-link"
              >
                GitHub
              </a>
            </nav>
            <p className="bottom-section__copy">© {new Date().getFullYear()} Claro. Built with care.</p>
          </div>

          {/* Middle — About + Socials + App Download */}
          <div className="bottom-section__dev">
            <h3 className="bottom-section__dev-title">About Claro</h3>
            <p className="bottom-section__dev-text">
              Claro is a personal expense tracker built as a project for an internship requirement at <strong>Goodstring Inc.</strong> — designed to make financial clarity accessible to everyone.
            </p>

            <div className="bottom-section__socials">
              <p className="bottom-section__socials-label">Follow us</p>
              <div className="bottom-section__socials-links">
                <a href="https://github.com/knorthy/WhiteString-Expense-Tracker" target="_blank" rel="noopener noreferrer" className="bottom-section__social-link" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </a>
                <a href="#" className="bottom-section__social-link" aria-label="Twitter / X">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.918l4.243 5.634 5.833-5.634zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="bottom-section__social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.496.068-2.909.4-3.993 1.485C1.975 2.641 1.643 4.054 1.575 5.55 1.517 6.83 1.503 7.238 1.503 12s.014 5.17.072 6.45c.068 1.496.4 2.909 1.485 3.993 1.084 1.085 2.497 1.417 3.993 1.485 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.496-.068 2.909-.4 3.993-1.485 1.085-1.084 1.417-2.497 1.485-3.993.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.068-1.496-.4-2.909-1.485-3.993C19.856 1.975 18.443 1.643 16.947 1.575 15.667 1.517 15.259 1.503 12 1.503zM12 5.838a6.162 6.162 0 1 0 0 12.324A6.162 6.162 0 0 0 12 5.838zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
                <a href="#" className="bottom-section__social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

          </div>


          <div className="bottom-section__form-wrap">
            <h3 className="bottom-section__form-title">We'd love your feedback</h3>
            <form className="feedback__form" onSubmit={e => e.preventDefault()}>
              <input
                type="text"
                className="feedback__input"
                placeholder="Your name"
                aria-label="Your name"
              />
              <input
                type="email"
                className="feedback__input"
                placeholder="Your email"
                aria-label="Your email"
              />
              <textarea
                className="feedback__textarea"
                placeholder="Message"
                rows={5}
                aria-label="Feedback message"
              />
              <button type="submit" className="feedback__submit">
                Send Feedback
              </button>
            </form>
          </div>

        </div>

        {/* Giant watermark */}
        <div className="bottom-section__watermark" aria-hidden="true">Claro</div>
      </section>
    </>
  )
}

export default LandingPage
