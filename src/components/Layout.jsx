import React from 'react'
import Sidebar from './Sidebar.jsx'

const segmentLabels = { projects: 'Projects', blog: 'Blog', cv: 'CV' }

function buildBreadcrumbs(currentPath, title, overrides = {}) {
  if (!currentPath || currentPath === '/') return []
  const segments = currentPath.replace(/^\/|\/$/g, '').split('/')
  const crumbs = [{ href: '/', label: 'Home' }]
  let path = ''
  segments.forEach((seg, i) => {
    path += `/${seg}`
    const isLast = i === segments.length - 1
    const label = isLast && title
      ? title
      : overrides[seg] ?? segmentLabels[seg] ?? seg.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    crumbs.push({ href: `${path}/`, label, current: isLast })
  })
  return crumbs
}

export default function Layout({ title, children, currentPath, breadcrumbOverrides, scripts }) {
  const crumbs = buildBreadcrumbs(currentPath, title, breadcrumbOverrides)
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | devultj` : 'devultj'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" href="/styles/main.css" />
        {/* Restore sidebar state before first paint to avoid transition flash */}
        <script dangerouslySetInnerHTML={{ __html: `if(localStorage.getItem('sidebar-collapsed')==='true')document.documentElement.setAttribute('data-sidebar','collapsed');` }} />
      </head>
      <body>
        <div className="app-shell" id="app-shell">
          <main className="main-content">
            <div className="content-wrapper">
              {crumbs.length > 0 && (
                <nav className="breadcrumb" aria-label="Breadcrumb">
                  {crumbs.map((crumb, i) => (
                    <span key={crumb.href} className="breadcrumb-item">
                      {i > 0 && <span className="breadcrumb-sep">/</span>}
                      {crumb.current
                        ? <span className="breadcrumb-current">{crumb.label}</span>
                        : <a href={crumb.href} className="breadcrumb-link">{crumb.label}</a>}
                    </span>
                  ))}
                </nav>
              )}
              {children}
            </div>
          </main>
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  var btn = document.getElementById('sidebar-toggle');
  var icon = btn && btn.querySelector('.material-symbols-rounded');
  var html = document.documentElement;
  if (html.getAttribute('data-sidebar') === 'collapsed' && icon) icon.textContent = 'menu';
  if (btn) btn.addEventListener('click', function() {
    var collapsed = html.getAttribute('data-sidebar') === 'collapsed';
    if (collapsed) {
      html.removeAttribute('data-sidebar');
      localStorage.setItem('sidebar-collapsed', 'false');
      if (icon) icon.textContent = 'menu_open';
    } else {
      html.setAttribute('data-sidebar', 'collapsed');
      localStorage.setItem('sidebar-collapsed', 'true');
      if (icon) icon.textContent = 'menu';
    }
  });
})();
        `}} />
        <script src="/scripts/gallery.js" defer />
        {scripts?.map(src => <script key={src} src={src} defer />)}
      </body>
    </html>
  )
}
