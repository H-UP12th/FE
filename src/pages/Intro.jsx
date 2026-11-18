import { Link, Navigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import logo from '../assets/logo-intro.svg'
import styles from './pages.module.css'

// 01 초기 화면
export default function Intro() {
  if (isLoggedIn()) return <Navigate to="/" replace />

  return (
    <div className={styles.screen}>
      <main className={styles.intro}>
        <img src={logo} alt="핼팅" width="152" height="133" />
        <p className={styles.tagline}>내 취향의 건강한 한 끼를 모으다</p>
        <div className={styles.introActions}>
          <Link to="/login" className={styles.introLink}>
            로그인
          </Link>
          <Link to="/signup" className={styles.introLink}>
            회원가입
          </Link>
        </div>
      </main>
    </div>
  )
}
