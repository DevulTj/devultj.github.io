import React from 'react'
import Layout from './Layout.jsx'
import ProjectCard from './ProjectCard.jsx'
import PageHeader from './PageHeader.jsx'

export default function ProjectListPage({ projects }) {
  // Group by category, defaulting to 'Featured'
  const groups = {}
  for (const project of projects) {
    const cat = project.category ?? 'Featured'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(project)
  }

  // 'Featured' always first, rest alphabetical
  const categoryOrder = [
    'Featured',
    ...Object.keys(groups).filter(c => c !== 'Featured').sort(),
  ].filter(c => groups[c])

  return (
    <Layout title="Projects" currentPath="/projects/">
      <PageHeader title="Projects" subtitle="Things I've built." noBorder />
      {categoryOrder.map(category => (
        <section key={category} className="project-category">
          <h2 className="project-category-heading">{category}</h2>
          <div className="cards-grid">
            {groups[category].map(project => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      ))}
    </Layout>
  )
}
