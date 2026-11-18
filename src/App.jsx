import { Navigate, Route, Routes } from 'react-router-dom'
import Intro from './pages/Intro'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Main from './pages/Main'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/start" element={<Intro />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
