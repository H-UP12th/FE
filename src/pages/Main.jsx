import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import Header from '../components/Header'
import styles from './pages.module.css'

// 메인 화면 자리: 디자인이 확정되면 내용을 채워요
export default function Main() {
  if (!isLoggedIn()) return <Navigate to="/start" replace />

  return (
    <div className={styles.screen}>
      <Header />
      <main className={styles.mainPlaceholder}>메인 화면 준비 중이에요</main>
    </div>
  )
}
