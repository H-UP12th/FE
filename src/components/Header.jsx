import { Link } from 'react-router-dom'
import { BiSolidUserCircle } from 'react-icons/bi'
import styles from './Header.module.css'

// 상단 헤더: 왼쪽 로고(→ 메인), 오른쪽 프로필(→ 마이페이지)
// 사용법: <Header />                      → 로고 + 프로필
//         <Header showProfile={false} />  → 로고만 (저장한/내가 만든/최근 본 레시피, 프로필 수정)
//         <Header showLogo={false} />     → 프로필만 (레시피 작성)
export default function Header({ showLogo = true, showProfile = true }) {
  return (
    <header className={styles.header}>
      {showLogo && (
        <Link to="/" className={styles.logo}>
          핼팅
        </Link>
      )}
      {showProfile && (
        <Link to="/mypage" className={styles.profile} aria-label="마이페이지">
          <BiSolidUserCircle size={30} />
        </Link>
      )}
    </header>
  )
}
