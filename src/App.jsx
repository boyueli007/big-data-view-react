import { Routes, Route, Navigate } from 'react-router-dom'
import Gallery from './pages/Gallery.jsx'
import Screen from './pages/Screen.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Gallery />} />
      <Route path="/screen/:id" element={<Screen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
