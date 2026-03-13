import React from 'react'
import Tag from './Tag.jsx'

export default function ProjectCard({ project, href, compact }) {
  const link = href ?? `/projects/${project.slug}/`
  return (
    <a href={link} className={`card${compact ? ' card--compact' : ''}`}>
      {project.banner && (
        <div className="card-banner">
          <img src={`${link}banner.jpg`} alt={project.title} loading="lazy" />
          {project.icon && (
            <div className="card-icon">
              <img src={`${link}${project.icon}`} alt="" />
            </div>
          )}
        </div>
      )}
      <div className="card-body">
        <div className="card-header">
          {!project.banner && project.icon && (
            <div className="card-icon-inline">
              <img src={`${link}${project.icon}`} alt="" />
            </div>
          )}
          <div className="card-header-text">
            <h3 className="card-title">{project.title}</h3>
            <span className="card-year">{project.yearRange || project.year}</span>
          </div>
        </div>
        {project.studio && <p className="card-studio">{project.studio}</p>}
        <p className="card-description">{project.description}</p>
        <div className="card-tags">
          {project.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
        </div>
      </div>
    </a>
  )
}
