import React from 'react'
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import remarkGfm from 'remark-gfm'
import { compileString } from 'sass'
import { globSync } from 'glob'
import fse from 'fs-extra'

import Layout from './src/components/Layout.jsx'
import HomePage from './src/components/HomePage.jsx'
import ProjectListPage from './src/components/ProjectListPage.jsx'
import ProjectPage from './src/components/ProjectPage.jsx'
import BlogListPage from './src/components/BlogListPage.jsx'
import BlogPostPage from './src/components/BlogPostPage.jsx'
import CVPage from './src/components/CVPage.jsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, 'src')
const DIST = join(__dirname, 'dist')

async function compileMDX(source) {
  const compiled = await compile(source, {
    outputFormat: 'function-body',
    remarkPlugins: [remarkGfm],
  })
  const result = await run(String(compiled), { ...runtime, baseUrl: import.meta.url })
  return result.default
}

function renderPage(Component, props = {}) {
  return '<!DOCTYPE html>' + renderToStaticMarkup(createElement(Component, props))
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

function writeHTML(outPath, html) {
  ensureDir(dirname(outPath))
  writeFileSync(outPath, html, 'utf-8')
  console.log(`  ✓ ${outPath.replace(DIST, 'dist')}`)
}

async function build() {
  console.log('🔨 Building portfolio...\n')

  // 1. Clean dist
  if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true })
  ensureDir(DIST)

  // 2. Compile SCSS
  console.log('📦 Compiling SCSS...')
  const scssResult = compileString(
    readFileSync(join(SRC, 'styles', 'main.scss'), 'utf-8'),
    { loadPaths: [join(SRC, 'styles')], style: 'compressed' }
  )
  ensureDir(join(DIST, 'styles'))
  writeFileSync(join(DIST, 'styles', 'main.css'), scssResult.css, 'utf-8')
  console.log('  ✓ dist/styles/main.css\n')

  // 3. Copy CV assets
  const cvSrc = join(SRC, 'content', 'cv')
  const cvDist = join(DIST, 'cv')
  ensureDir(cvDist)
  if (existsSync(cvSrc)) {
    fse.copySync(cvSrc, cvDist, { overwrite: true, filter: (src) => !src.endsWith('.html') })
  }

  // 3b. Copy global assets (avatar, etc.)
  const assetsSrc = join(SRC, 'content', 'assets')
  if (existsSync(assetsSrc)) {
    fse.copySync(assetsSrc, join(DIST, 'assets'), { overwrite: true })
  }

  // 3c. Copy scripts
  const scriptsSrc = join(SRC, 'scripts')
  if (existsSync(scriptsSrc)) {
    fse.copySync(scriptsSrc, join(DIST, 'scripts'), { overwrite: true })
  }

  // 3d. Copy static files (CNAME, robots.txt, etc.)
  const staticSrc = join(SRC, 'static')
  if (existsSync(staticSrc)) {
    fse.copySync(staticSrc, DIST, { overwrite: true })
  }

  // 4. Projects
  console.log('📁 Building projects...')
  const projectDirs = globSync('src/content/projects/*/', { cwd: __dirname })
  const projects = []
  for (const dir of projectDirs) {
    const slug = dir.replace(/\\/g, '/').split('/').filter(Boolean).pop()
    const meta = JSON.parse(readFileSync(join(__dirname, dir, 'project.json'), 'utf-8'))
    meta.slug = slug
    const mdxSource = readFileSync(join(__dirname, dir, 'content.mdx'), 'utf-8')
    const MDXContent = await compileMDX(mdxSource)
    const outDir = join(DIST, 'projects', slug)

    // Build subprojects
    const subprojects = []
    const subDirs = globSync(`src/content/projects/${slug}/subprojects/*/`, { cwd: __dirname })
    for (const subDir of subDirs) {
      const subSlug = subDir.replace(/\\/g, '/').split('/').filter(Boolean).pop()
      const subMeta = JSON.parse(readFileSync(join(__dirname, subDir, 'project.json'), 'utf-8'))
      subMeta.slug = subSlug
      subMeta.parentSlug = slug
      const subOutDir = join(outDir, subSlug)
      const subMdxPath = join(__dirname, subDir, 'content.mdx')
      const subMDXContent = existsSync(subMdxPath)
        ? await compileMDX(readFileSync(subMdxPath, 'utf-8'))
        : await compileMDX(`# ${subMeta.title}\n\n${subMeta.description}`)
      const subHtml = renderPage(ProjectPage, {
        project: { ...subMeta, slug: `${slug}/${subSlug}` },
        MDXContent: subMDXContent,
        backHref: `/projects/${slug}/`,
        backLabel: `← ${meta.title}`,
        breadcrumbOverrides: { [slug]: meta.title },
      })
      writeHTML(join(subOutDir, 'index.html'), subHtml)
      // Copy subproject images
      const subSrcDir = join(__dirname, subDir)
      const imgExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'])
      fse.copySync(subSrcDir, subOutDir, {
        overwrite: true,
        filter: (src) => {
          if (src === subSrcDir) return true
          const ext = src.slice(src.lastIndexOf('.')).toLowerCase()
          return imgExts.has(ext)
        }
      })
      subprojects.push(subMeta)
    }
    subprojects.sort((a, b) => (b.year || 0) - (a.year || 0))

    const html = renderPage(ProjectPage, { project: meta, MDXContent, subprojects })
    writeHTML(join(outDir, 'index.html'), html)
    // Copy static assets (banner.jpg, screenshots, etc.)
    const srcDir = join(__dirname, dir)
    const imgExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'])
    fse.copySync(srcDir, outDir, {
      overwrite: true,
      filter: (src) => {
        if (src === srcDir) return true
        const ext = src.slice(src.lastIndexOf('.')).toLowerCase()
        return imgExts.has(ext)
      }
    })
    projects.push(meta)
  }
  projects.sort((a, b) => (b.year || 0) - (a.year || 0))
  writeHTML(join(DIST, 'projects', 'index.html'), renderPage(ProjectListPage, { projects }))
  console.log()

  // 5. Blog
  console.log('📝 Building blog...')
  const blogDirs = globSync('src/content/blog/*/', { cwd: __dirname })
  const posts = []
  for (const dir of blogDirs) {
    const slug = dir.replace(/\\/g, '/').split('/').filter(Boolean).pop()
    const meta = JSON.parse(readFileSync(join(__dirname, dir, 'post.json'), 'utf-8'))
    meta.slug = slug
    const mdxSource = readFileSync(join(__dirname, dir, 'content.mdx'), 'utf-8')
    const MDXContent = await compileMDX(mdxSource)
    const html = renderPage(BlogPostPage, { post: meta, MDXContent })
    writeHTML(join(DIST, 'blog', slug, 'index.html'), html)
    posts.push(meta)
  }
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  writeHTML(join(DIST, 'blog', 'index.html'), renderPage(BlogListPage, { posts }))
  console.log()

  // 6. CV
  console.log('📄 Building CV...')
  writeHTML(join(DIST, 'cv', 'index.html'), renderPage(CVPage, {}))
  console.log()

  // 7. Homepage
  console.log('🏠 Building homepage...')
  const homeData = JSON.parse(readFileSync(join(SRC, 'content', 'home.json'), 'utf-8'))
  if (homeData.featuredSlugs) {
    homeData.featured = projects.filter(p => homeData.featuredSlugs.includes(p.slug)).slice(0, 3)
  }
  if (!homeData.featured?.length) {
    homeData.featured = projects.slice(0, 3)
  }
  homeData.recentPosts = posts.slice(0, 3)
  writeHTML(join(DIST, 'index.html'), renderPage(HomePage, { data: homeData }))
  console.log()

  console.log('✅ Build complete! Output in dist/')
}

export { build }

if (process.argv[1]?.replace(/\\/g, '/').endsWith('/build.jsx')) {
  build().catch(err => { console.error('Build failed:', err); process.exit(1) })
}
