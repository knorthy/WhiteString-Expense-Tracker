import FaultyTerminal from '../components/FaultyTerminal'

function LandingPage() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
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

      {/* Overlay content on top of the background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          pointerEvents: 'none'  // let mouse events pass through to the canvas
        }}
      >
        <h1>WhiteString Expense Tracker</h1>
        <p>Manage your income and expenses with ease</p>
        {/* Add a "Get Started" / "Login" button here later */}
      </div>
    </div>
  )
}

export default LandingPage