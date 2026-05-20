import { useState } from 'react'

export default function Router() {
  const [path, setPath] = useState(window.location.hash || '#/')

  // Simple hash router
  window.addEventListener('hashchange', () => {
    setPath(window.location.hash || '#/')
  })

  return { path, navigate: (p) => { window.location.hash = p } }
}
