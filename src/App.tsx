import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AcousticsProvider } from './context/AcousticsContext'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { Visualizer } from './pages/Visualizer'
import { Frequency } from './pages/Frequency'
import { Simulator } from './pages/Simulator'
import { About } from './pages/About'

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AcousticsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visualizer" element={<Visualizer />} />
            <Route path="/frequency" element={<Frequency />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </AcousticsProvider>
    </BrowserRouter>
  )
}

export default App
