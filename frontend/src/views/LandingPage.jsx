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

      <section className="features-section">
        <div className="features-section__text">
          <h2 className="features-section__title">
            Finance, made claro.
          </h2>
          <p className="features-section__subtitle">
            Built for people tired of guessing where their money went. Claro started as a simple idea: personal finance shouldn't require a spreadsheet degree.
          </p>
          <a href="#how-to-use" className="features-section__btn">
            How to use Claro
          </a>
        </div>

        <CardSwap
          width={1000}
          height={720}
          cardDistance={55}
          verticalDistance={65}
          delay={3500}
          pauseOnHover={true}
          easing="elastic"
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

      <section className="bottom-section">
        <div className="bottom-section__inner">

          {/* Feedback Form */}
          <div className="feedback">
            <div className="feedback__text">
              <h2 className="feedback__title">We'd love your feedback</h2>
              <p className="feedback__subtitle">
                Help us improve Claro — tell us what's working, what's missing, or what you'd love to see next.
              </p>
            </div>
            <form className="feedback__form" onSubmit={e => e.preventDefault()}>
              <div className="feedback__row">
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
              </div>
              <textarea
                className="feedback__textarea"
                placeholder="What's on your mind?"
                rows={5}
                aria-label="Feedback message"
              />
              <button type="submit" className="feedback__submit">
                Send Feedback
              </button>
            </form>
          </div>

          {/* Footer */}
          <footer className="footer">
            <div className="footer__top">
              <div className="footer__brand">
                <img src="/favicon.png" alt="Claro logo" className="footer__logo" />
                <span className="footer__brand-name">Claro</span>
              </div>
              <nav className="footer__links" aria-label="Footer navigation">
                <a href="/register" className="footer__link">Get Started</a>
                <a href="#how-to-use" className="footer__link">How to Use</a>
                <a
                  href="https://github.com/knorthy/WhiteString-Expense-Tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                >
                  GitHub
                </a>
              </nav>
            </div>
            <div className="footer__bottom">
              <p className="footer__copy">© {new Date().getFullYear()} Claro. Built with care.</p>
            </div>
          </footer>

        </div>
      </section>
    </>
  )
}

export default LandingPage
