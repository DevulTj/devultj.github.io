import React from 'react'
import Icon from './Icon.jsx'

export default function Button({ href, children, external, download, variant, icon }) {
  return (
    <a
      href={href}
      className={`btn${variant ? ` btn--${variant}` : ''}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      download={download || undefined}
    >
      {icon && <Icon name={icon} className="btn-icon" />}
      {children}
    </a>
  )
}
