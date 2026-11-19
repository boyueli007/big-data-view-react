import { useParams, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import manifest from '../manifest.json'
import './Screen.css'

const BASE = import.meta.env.BASE_URL || '/'

export default function Screen() {
  const { id } = useParams()
  const item = useMemo(() => manifest.find((m) => m.id === id), [id])

  if (!item) return <Navigate to="/" replace />

  // Full project is served statically under /screens/<no>/ ; entry may be a sub path
  const src = `${BASE}screens/${item.no}/${item.entry}`

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
