import React from 'react'
import Layout from './Layout.jsx'
import ProjectCard from './ProjectCard.jsx'
import Button from './Button.jsx'
import Tag from './Tag.jsx'

export default function HomePage({ data }) {
  return (
    <Layout title={null} currentPath="/" scripts={['/scripts/scrollspy.js']}>
      <section className="hero" id="home">
        <div className="hero-eyebrow">Hello, I'm</div>
        <h1 className="hero-name">{data.name}</h1>
        <p className="hero-tagline">{data.tagline}</p>
        <p className="hero-bio">{data.bio}</p>
        <div className="hero-links">
          {data.links?.map(link => (
            <Button key={link.url} href={link.url} external={link.external} icon={link.icon}>
              {link.label}
            </Button>
          ))}
        </div>
      </section>

      {data.featured?.length > 0 && (
        <section className="home-section" id="projects">
          <div className="home-section-header">
            <h2 className="project-category-heading">Featured Projects</h2>
            <Button href="/projects/" variant="ghost">All projects →</Button>
          </div>
          <div className="cards-grid">
            {data.featured.map(project => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {data.recentPosts?.length > 0 && (
        <section className="home-section" id="blog">
          <div className="home-section-header">
            <h2 className="project-category-heading">Recent Posts</h2>
            <Button href="/blog/" variant="ghost">All posts →</Button>
          </div>
          <div className="post-list">
            {data.recentPosts.map(post => (
              <a key={post.slug} href={`/blog/${post.slug}/`} className="post-item">
                <span className="post-title">{post.title}</span>
                <span className="post-date">{post.date}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="home-section" id="cv">
        <div className="home-section-header">
          <h2 className="project-category-heading">CV</h2>
          <Button href="/cv/resume.pdf" download variant="ghost">Download PDF</Button>
        </div>
        <iframe src="/cv/resume.pdf" className="cv-embed" title="CV" />
      </section>
    </Layout>
  )
}
