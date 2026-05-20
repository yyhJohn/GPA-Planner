import { useState, useEffect } from 'react'
import { isLoggedIn, removeToken } from '../utils'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
    const handler = () => setLoggedIn(isLoggedIn())
    window.addEventListener('hashchange', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('hashchange', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const handleLogout = () => {
    removeToken()
    localStorage.removeItem('user')
    setLoggedIn(false)
    window.location.hash = '#/'
  }

  const navLinks = [
    { name: '功能', href: '#features' },
    { name: '流程', href: '#process' },
    { name: '价格', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-bold text-gray-900">
                Study<span className="text-blue-600">Path</span> AI
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {loggedIn ? (
              <>
                <a href="#/reports" className="text-gray-600 hover:text-blue-600 font-medium">
                  我的报告
                </a>
                <a href="#/profile" className="text-gray-600 hover:text-blue-600 font-medium">
                  填写档案
                </a>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 font-medium">
                  退出
                </button>
              </>
            ) : (
              <>
                <a href="#/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  登录
                </a>
                <a href="#/login" className="btn-primary text-sm">
                  免费注册
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                {loggedIn ? (
                  <>
                    <a href="#/reports" className="text-gray-600 hover:text-blue-600 font-medium px-2" onClick={() => setIsMenuOpen(false)}>我的报告</a>
                    <a href="#/profile" className="text-gray-600 hover:text-blue-600 font-medium px-2" onClick={() => setIsMenuOpen(false)}>填写档案</a>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false) }} className="text-left text-gray-600 hover:text-red-600 font-medium px-2">退出</button>
                  </>
                ) : (
                  <>
                    <a href="#/login" className="text-gray-600 hover:text-blue-600 font-medium px-2" onClick={() => setIsMenuOpen(false)}>登录</a>
                    <a href="#/login" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>免费注册</a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
