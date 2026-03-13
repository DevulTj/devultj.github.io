import React from 'react'

const navItems = [
  { href: '/#home',     label: 'Home',     icon: 'home',         section: 'home',     fallbackPath: '/' },
  { href: '/#projects', label: 'Projects', icon: 'code_blocks',  section: 'projects', fallbackPath: '/projects/' },
  { href: '/#blog',     label: 'Blog',     icon: 'article',      section: 'blog',     fallbackPath: '/blog/' },
  { href: '/#cv',       label: 'CV',       icon: 'badge',        section: 'cv',       fallbackPath: '/cv/' },
]

export default function Sidebar({ currentPath }) {
  const isHome = currentPath === '/'
  return (
    <aside className="sidebar" id="sidebar">
      <button className="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
        <span className="material-symbols-rounded">menu_open</span>
      </button>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map(item => {
            const pathActive = item.fallbackPath === '/'
              ? currentPath === '/'
              : currentPath?.startsWith(item.fallbackPath)
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`nav-item${!isHome && pathActive ? ' active' : ''}`}
                  data-section={item.section}
                  data-tooltip={item.label}
                >
                  <span className="material-symbols-rounded nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
