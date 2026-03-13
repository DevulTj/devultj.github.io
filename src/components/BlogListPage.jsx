import React from 'react'
import Layout from './Layout.jsx'
import Tag from './Tag.jsx'
import PageHeader from './PageHeader.jsx'

export default function BlogListPage({ posts }) {
  return (
    <Layout title="Blog" currentPath="/blog/">
      <PageHeader title="Blog" subtitle="Writing on software, games, and systems." />
      <div className="post-list">
        {posts.map(post => (
          <a key={post.slug} href={`/blog/${post.slug}/`} className="post-item">
            <div className="post-item-content">
              <h3 className="post-item-title">{post.title}</h3>
              <p className="post-item-excerpt">{post.excerpt}</p>
            </div>
            <span className="post-item-date">{post.date}</span>
          </a>
        ))}
      </div>
    </Layout>
  )
}
