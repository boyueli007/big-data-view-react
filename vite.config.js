import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// REPO_NAME injected at build time via env (e.g. GH_REPO / GITHUB_REPOSITORY).
// For GitHub Pages project sites, base must be "/<repo>/".
const repo = process.env.GH_REPO || ''
const base = process.env.GH_BASE || (repo ? `/${repo}/` : '/')

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    watch: {
      // 大屏静态资源与编辑器临时文件不参与热更新监听，避免 EBUSY 崩溃
      ignored: [
        '**/public/screens/**',
        '**/public/screens2/**',
        '**/docs/**',
        '**/*.tmpdir/**',
        '**/*.tmp',
      ],
    },
  },
})
