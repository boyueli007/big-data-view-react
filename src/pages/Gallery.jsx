import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import manifest from '../manifest.json'
import manifest2 from '../manifest2.json'
import './Gallery.css'

const BASE = import.meta.env.BASE_URL || '/'

const COLLECTIONS = {
  a: {
    key: 'a',
    label: '大屏合集 ①',
    sub: '117 套精选数据可视化大屏',
    items: manifest,
    base: 'screens',
  },
  b: {
    key: 'b',
    label: '大屏合集 ②',
    sub: '25 套 · 按行业分类',
    items: manifest2,
    base: 'screens2',
    grouped: true,
  },
}

export default function Gallery() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'b' ? 'b' : 'a'
  const [tab, setTab] = useState(initialTab)
  const [q, setQ] = useState('')

  const selectTab = (key) => {
    setTab(key)
    setQ('')
    setSearchParams(key === 'b' ? { tab: 'b' } : {}, { replace: true })
  }

  const coll = COLLECTIONS[tab]
  const items = coll.items

  const filtered = useMemo(() => {
    const kw = q.trim()
    if (!kw) return items
    return items.filter((it) => it.name.includes(kw) || it.id.includes(kw))
  }, [items, q])

  const groups = useMemo(() => {
    if (!coll.grouped) return null
    const map = new Map()
    for (const it of filtered) {
      if (!map.has(it.cat)) map.set(it.cat, [])
      map.get(it.cat).push(it)
    }
    return Array.from(map.entries())
  }, [filtered, coll.grouped])

  const renderCard = (it, i) => (
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
        {it.thumb ? (
          <img
            src={`${BASE}${it.thumb}`}
            alt={it.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : null}
        <div className="card-veil" />
        <span className="card-no">{it.id.toUpperCase()}</span>
        <span className="card-play">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </span>
      </div>
      <div className="card-meta">
        <h3 className="card-name">{it.name}</h3>
        {it.cat ? <span className="card-cat">{it.cat}</span> : null}
      </div>
    </article>
  )

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
            共 {COLLECTIONS.a.items.length + COLLECTIONS.b.items.length} 套精选大屏 · 点击缩略图即可全屏预览
          </p>

          <div className="gal-tabs" role="tablist">
            {Object.values(COLLECTIONS).map((c) => (
              <button
                key={c.key}
                role="tab"
                aria-selected={tab === c.key}
                className={`gal-tab ${tab === c.key ? 'active' : ''}`}
                onClick={() => selectTab(c.key)}
              >
                <span className="gal-tab-label">{c.label}</span>
                <span className="gal-tab-sub">{c.sub}</span>
              </button>
            ))}
          </div>

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
              placeholder="搜索名称或编号…"
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

      {coll.grouped ? (
        <main className="gal-grouped">
          {(groups || []).map(([cat, list]) => (
            <section key={cat} className="gal-section">
              <div className="gal-section-head">
                <span className="gal-section-bar" />
                <h2 className="gal-section-title">{cat}</h2>
                <span className="gal-section-count">{list.length}</span>
              </div>
              <div className="gal-grid" role="list">
                {list.map((it, i) => renderCard(it, i))}
              </div>
            </section>
          ))}
        </main>
      ) : (
        <main className="gal-grid" role="list">
          {filtered.map((it, i) => renderCard(it, i))}
        </main>
      )}

      {filtered.length === 0 && (
        <div className="gal-empty">没有找到匹配的大屏 · 换个关键词试试</div>
      )}

      <footer className="gal-foot">
        共 {items.length} 套模板 · {coll.label}
      </footer>
    </div>
  )
}
