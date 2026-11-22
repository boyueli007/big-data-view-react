import { useParams, Navigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import manifest from '../manifest.json'
import manifest2 from '../manifest2.json'
import './Screen.css'

const BASE = import.meta.env.BASE_URL || '/'

export default function Screen() {
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)

  const resolved = useMemo(() => {
    const a = manifest.find((m) => m.id === id)
    if (a) return { item: a, base: 'screens' }
    const b = manifest2.find((m) => m.id === id)
    if (b) return { item: b, base: 'screens2' }
    return null
  }, [id])

  if (!resolved) return <Navigate to="/" replace />

  const { item, base } = resolved
  // The iframe src is only requested when this route mounts — i.e. one dashboard
  // loads only when the user opens it (route-level lazy loading).
  const src = `${BASE}${base}/${item.id}/${item.entry}`

  return (
    <div className="screen">
      {!loaded && (
        <div className="screen-loader" aria-live="polite">
          <div className="screen-spinner" />
          <div className="screen-loader-txt">
            <strong>{item.name}</strong>
            <span>正在加载大屏…</span>
          </div>
        </div>
      )}
      <iframe
        className="screen-frame"
        src={src}
        title={item.name}
        allow="fullscreen"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
