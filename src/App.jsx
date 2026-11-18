import { Navigate, Route, Routes } from 'react-router-dom'
import Main from './pages/Main'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
