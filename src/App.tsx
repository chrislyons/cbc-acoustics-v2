import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AcousticsProvider } from './context/AcousticsContext'
import { Header } from './components/layout/Header'

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })))
const Visualizer = lazy(() => import('./pages/Visualizer').then(module => ({ default: module.Visualizer })))
const Frequency = lazy(() => import('./pages/Frequency').then(module => ({ default: module.Frequency })))
const Simulator = lazy(() => import('./pages/Simulator').then(module => ({ default: module.Simulator })))
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })))

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Suspense fallback={<div className="p-4">Loading page...</div>}>
          <Outlet />
        </Suspense>
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
