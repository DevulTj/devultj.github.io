import React from 'react'
import Layout from './Layout.jsx'
import Tag from './Tag.jsx'
import Gallery from './Gallery.jsx'

const mdxComponents = { Gallery }

export default function BlogPostPage({ post, MDXContent }) {
  return (
    <Layout title={post.title} currentPath={`/blog/${post.slug}/`}>
      <article className="article">
        <header className="article-header">
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            <time dateTime={post.date} className="article-date">{post.date}</time>
            <div className="card-tags">
              {post.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
            </div>
          </div>
        </header>
        <div className="prose">
          <MDXContent components={mdxComponents} />
        </div>
      </article>
    </Layout>
  )
}
