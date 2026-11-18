import { Navigate, Route, Routes } from 'react-router-dom'
import Intro from './pages/Intro'
import Login from './pages/Login'
import Main from './pages/Main'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/start" element={<Intro />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
