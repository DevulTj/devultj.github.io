import React from 'react'

export default function PageHeader({ title, subtitle, noBorder = false }) {
  return (
    <div className={`page-header${noBorder ? ' page-header--no-border' : ''}`}>
      <h1>{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  )
}
