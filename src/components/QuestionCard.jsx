import { findCategory } from '../constants/categories'
import divider from '../assets/question/divider.svg'
import avatar from '../assets/question/avatar.svg'
import styles from './QuestionCard.module.css'

// 질문 상세(15·16)와 답변 작성(17) 위쪽에 같이 쓰는 메뉴 카드 + 질문 카드
// 사용법: <QuestionCard question={질문 상세 API 응답} />
export default function QuestionCard({ question }) {
  const category = findCategory(question.menu.category)

  return (
    <>
      <img src={divider} alt="" className={styles.divider} />
      <div className={styles.menuCard}>
        <p className={styles.category}>{category?.label} 식단</p>
        <p>{question.menu.name}</p>
      </div>
      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <span className={styles.label}>
            <span className={styles.badge}>Q</span>질문
          </span>
          <span className={styles.author}>
            <img src={avatar} alt="" width="17" height="17" />
            {question.loginId}
          </span>
        </div>
        <p className={styles.content}>{question.content}</p>
      </div>
    </>
  )
}
