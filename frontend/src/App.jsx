import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './views/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* More routes go here later, e.g. /login, /dashboard */}
      </Routes>
    </BrowserRouter>
  )
}

export default App