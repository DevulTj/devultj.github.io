import { watch } from 'chokidar'
import browserSync from 'browser-sync'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { build } from './build.jsx'

const __dirname = dirname(fileURLToPath(import.meta.url))

const bs = browserSync.create()
let building = false
let pendingRebuild = false

async function rebuild(changedPath) {
  if (building) {
    pendingRebuild = true
    return
  }
  building = true
  const rel = changedPath?.replace(__dirname, '').replace(/\\/g, '/') ?? ''
  console.log(`\n🔄 Changed: ${rel}`)
  const start = Date.now()
  try {
    await build()
    console.log(`⚡ Rebuilt in ${Date.now() - start}ms\n`)
    bs.reload()
  } catch (err) {
    console.error('❌ Build error:', err.message)
  } finally {
    building = false
    if (pendingRebuild) {
      pendingRebuild = false
      await rebuild()
    }
  }
}

// Initial build then start dev server
console.log('🚀 Starting dev server...\n')
await build()

bs.init({
  server: join(__dirname, 'dist'),
  port: 3000,
  open: false,
  notify: false,
  logLevel: 'silent',
}, () => {
  console.log('\n✅ Dev server running at http://localhost:3000\n')
})

// Watch src/ and content files
const watcher = watch([
  join(__dirname, 'src'),
  join(__dirname, 'build.jsx'),
], {
  ignoreInitial: true,
  ignored: /(^|[/\\])\./, // ignore dotfiles
  awaitWriteFinish: { stabilityThreshold: 80, pollInterval: 50 },
})

watcher.on('all', (event, path) => rebuild(path))
console.log('👁  Watching src/ for changes...\n')
