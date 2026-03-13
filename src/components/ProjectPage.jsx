import React from 'react'
import Layout from './Layout.jsx'
import Tag from './Tag.jsx'
import ProjectCard from './ProjectCard.jsx'
import Gallery from './Gallery.jsx'

const mdxComponents = { Gallery }

export default function ProjectPage({ project, MDXContent, subprojects, backHref, backLabel, breadcrumbOverrides }) {
  const back = backHref ?? '/projects/'
  const backText = backLabel ?? '← Projects'
  const fullPath = `/projects/${project.slug}/`
  return (
    <Layout title={project.title} currentPath={fullPath} breadcrumbOverrides={breadcrumbOverrides}>
      <article className="article">
        <header className="article-header">
          <div className={`article-header-body${project.banner ? ' article-header-body--has-banner' : ''}`}>
            <div className="article-header-content">
              <div className="article-title-row">
                {project.icon && !project.banner && (
                  <div className="article-icon">
                    <img src={`/projects/${project.slug}/${project.icon}`} alt={`${project.title} icon`} />
                  </div>
                )}
                <div className="article-title-content">
                  <h1 className="article-title">{project.title}</h1>
                  <div className="article-meta">
                    {project.studio && <span className="article-studio">{project.studio}</span>}
                    <span className="article-year">{project.yearRange || project.year}</span>
                    {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="article-link">Website ↗</a>}
                    {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="article-link">GitHub ↗</a>}
                  </div>
                </div>
              </div>
              <div className="card-tags">
                {project.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </div>
            {project.banner && (
              <div className="article-banner">
                <img src={`/projects/${project.slug}/banner.jpg`} alt={project.title} />
              </div>
            )}
          </div>
        </header>
        <div className="prose">
          <MDXContent components={mdxComponents} />
        </div>
        {subprojects?.length > 0 && (
          <section className="subprojects">
            <h2 className="subprojects-heading">Games</h2>
            <div className="subprojects-grid">
              {subprojects.map(sub => (
                <ProjectCard
                  key={sub.slug}
                  project={sub}
                  href={`/projects/${project.slug}/${sub.slug}/`}
                  compact
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  )
}
