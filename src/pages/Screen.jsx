import { useParams, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import manifest from '../manifest.json'
import manifest2 from '../manifest2.json'
import './Screen.css'

const BASE = import.meta.env.BASE_URL || '/'

export default function Screen() {
  const { id } = useParams()

  const resolved = useMemo(() => {
    const a = manifest.find((m) => m.id === id)
    if (a) return { item: a, base: 'screens' }
    const b = manifest2.find((m) => m.id === id)
    if (b) return { item: b, base: 'screens2' }
    return null
  }, [id])

  if (!resolved) return <Navigate to="/" replace />

  const { item, base } = resolved
  const src = `${BASE}${base}/${item.id}/${item.entry}`

  return (
    <div className="screen">
      <iframe
        className="screen-frame"
        src={src}
        title={item.name}
        allow="fullscreen"
      />
    </div>
  )
}
