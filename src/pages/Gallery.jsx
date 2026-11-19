import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import manifest from '../manifest.json'
import './Gallery.css'

const BASE = import.meta.env.BASE_URL || '/'

export default function Gallery() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const items = manifest

  const filtered = useMemo(() => {
    const kw = q.trim()
    if (!kw) return items
    return items.filter(
      (it) => it.name.includes(kw) || it.no.includes(kw)
    )
  }, [items, q])

  return (
    <div className="gal">
      <header className="gal-hero">
        <div className="gal-hero-inner">
          <div className="gal-brand">
            <span className="gal-dot" />
            <span className="gal-brand-txt">BIG&nbsp;DATA&nbsp;VIEW</span>
          </div>
          <h1 className="gal-title">
            大数据可视化<span className="grad">大屏合集</span>
          </h1>
          <p className="gal-sub">
            {items.length} 套精选数据可视化大屏 · 点击缩略图即可进入全屏预览
          </p>
          <div className="gal-search">
            <svg viewBox="0 0 24 24" className="gal-search-ico" aria-hidden="true">
              <path
                d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索名称或编号，如：政务 / 001"
              aria-label="搜索大屏"
            />
            {q && (
              <button className="gal-clear" onClick={() => setQ('')} aria-label="清除">
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="gal-grid" role="list">
        {filtered.map((it, i) => (
          <article
            key={it.id}
            className="card"
            role="listitem"
            style={{ animationDelay: `${Math.min(i * 28, 900)}ms` }}
            onClick={() => navigate(`/screen/${it.id}`)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate(`/screen/${it.id}`)
              }
            }}
          >
            <div className="card-thumb">
              <img
                src={`${BASE}${it.thumb}`}
                alt={it.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="card-veil" />
              <span className="card-no">{it.no}</span>
              <span className="card-play">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              </span>
            </div>
            <div className="card-meta">
              <h3 className="card-name">{it.name}</h3>
            </div>
          </article>
        ))}
      </main>

      {filtered.length === 0 && (
        <div className="gal-empty">没有找到匹配的大屏 · 换个关键词试试</div>
      )}

      <footer className="gal-foot">
        共 {items.length} 套模板 · React 大屏合集
      </footer>
    </div>
  )
}
