import { useNavigate } from 'react-router-dom'
import back from '../assets/tobuy/back.svg'
import styles from './PageTitle.module.css'

// 헤더 아래 "< 제목 ······ 날짜" 줄 (To Buy, Memo)
// 사용법: <PageTitle title="To Buy" date="11.18 (수)" />
export default function PageTitle({ title, date }) {
  const navigate = useNavigate()

  return (
    <div className={styles.title}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="뒤로가기">
        <img src={back} alt="" width="24" height="24" />
      </button>
      <h1>{title}</h1>
      {date && <span className={styles.date}>{date}</span>}
    </div>
  )
}
