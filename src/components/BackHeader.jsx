import { useNavigate } from 'react-router-dom'
import { AiOutlineLeft } from 'react-icons/ai'
import styles from './BackHeader.module.css'

// 뒤로가기 헤더: < 버튼 + 가운데 제목
// 사용법: <BackHeader title="메뉴 상세" />   (제목 없이 <BackHeader /> 도 가능)
//         <BackHeader showBack={false} />  → 헤더 자리만 두고 버튼 숨김 (온보딩 첫 화면)
export default function BackHeader({ title, showBack = true }) {
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      {showBack && (
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <AiOutlineLeft size={26} />
        </button>
      )}
      {title && <h1 className={styles.title}>{title}</h1>}
    </header>
  )
}
