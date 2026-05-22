import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Process from './components/Process'
import ReportPreview from './components/ReportPreview'
import TargetAudience from './components/TargetAudience'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'
import GPAConverter from './components/GPAConverter'
import ProfileFormPage from './pages/ProfileFormPage'
import ReportPage from './pages/ReportPage'
import LoginPage from './pages/LoginPage'
import ReportsPage from './pages/ReportsPage'

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">GPA 制式换算</h2>
          <p className="section-subtitle">4.0 / 5.0 / 百分制 一键互转</p>
          <div className="max-w-lg mx-auto">
            <GPAConverter />
          </div>
        </div>
      </section>
      <Process />
      <ReportPreview />
      <TargetAudience />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/')

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/')
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === '#/login') {
    return <LoginPage />
  }

  if (route === '#/reports') {
    return <ReportsPage />
  }

  if (route === '#/profile' || route === '#/profile/edit') {
    return <ProfileFormPage />
  }

  if (route.startsWith('#/report')) {
    return <ReportPage />
  }

  return (
    <div className="min-h-screen bg-white">
      <HomePage />
    </div>
  )
}

export default App
