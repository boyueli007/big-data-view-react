// 构建脚本：docs/ 为唯一提交源 + 部署产物；public/ 为可再生的构建工作区（已 gitignore）。
// 流程：docs 静态内容 -> public（缺失时补齐） -> vite build -> dist 的 index/assets -> docs
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const pub = path.join(root, 'public')
const docs = path.join(root, 'docs')
const STATIC_DIRS = ['screens', 'screens2', 'thumbs_opt', 'thumbs2_opt', 'enhance']

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true })
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name)
    if (e.isDirectory()) copyDir(s, d)
    else if (e.isFile()) fs.copyFileSync(s, d)
  }
}

// 1) 保证 public 具备静态内容（从 docs 同步），使全新 clone 也能构建
fs.mkdirSync(pub, { recursive: true })
for (const dir of STATIC_DIRS) {
  const src = path.join(docs, dir)
  const dst = path.join(pub, dir)
  if (!fs.existsSync(src)) { console.warn('  skip (docs missing):', dir); continue }
  if (!fs.existsSync(dst) || fs.readdirSync(dst).length === 0) {
    console.log('  sync docs/' + dir + ' -> public/' + dir)
    copyDir(src, dst)
  }
}
// .nojekyll
const nj = path.join(docs, '.nojekyll')
if (fs.existsSync(nj) && !fs.existsSync(path.join(pub, '.nojekyll'))) fs.writeFileSync(path.join(pub, '.nojekyll'), '')

// 2) vite build（输出 dist/）
const base = process.env.GH_BASE || '/big-data-view-react/'
console.log('  vite build (base=' + base + ')')
execSync('npx vite build', { stdio: 'inherit', env: { ...process.env, GH_BASE: base } })

// 3) dist 的 index.html + assets -> docs（静态内容已在 docs，无需重复复制）
const dist = path.join(root, 'dist')
fs.copyFileSync(path.join(dist, 'index.html'), path.join(docs, 'index.html'))
const distAssets = path.join(dist, 'assets')
const docsAssets = path.join(docs, 'assets')
if (fs.existsSync(docsAssets)) fs.rmSync(docsAssets, { recursive: true, force: true })
copyDir(distAssets, docsAssets)
if (fs.existsSync(path.join(dist, '.nojekyll'))) fs.copyFileSync(path.join(dist, '.nojekyll'), path.join(docs, '.nojekyll'))
console.log('  synced dist -> docs (index.html + assets)')
console.log('BUILD DONE')
