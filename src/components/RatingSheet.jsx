import { useEffect, useRef, useState } from 'react'
import { rateMenu } from '../api/menus'
import SaladRating from './SaladRating'
import knob from '../assets/rating/knob.svg'
import styles from './RatingSheet.module.css'

const TRACK_WIDTH = 265

// 13 별점 바텀시트: 0.0~5.0을 0.1 단위로 골라 등록해요
// 사용법: <RatingSheet menuId={5} initialScore={3.3} onClose={...} onRated={(result) => ...} />
//         result는 API 응답 { menuId, myScore, average, count }
export default function RatingSheet({ menuId, initialScore, onClose, onRated }) {
  const dialogRef = useRef(null)
  const [score, setScore] = useState(Number(initialScore ?? 0))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // <dialog>의 showModal: 뒤 화면을 막고, Esc로 닫히고, 포커스를 시트 안에 가둬줘요
  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  async function submit() {
    setError('')
    setSubmitting(true)
    try {
      onRated(await rateMenu(menuId, Number(score.toFixed(1))))
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const x = (score / 5) * TRACK_WIDTH

  return (
    <dialog
      ref={dialogRef}
      className={styles.sheet}
      onClose={onClose}
      // 어두운 바깥(시트 밖)을 누르면 닫혀요
      onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
      aria-labelledby="rating-title"
    >
      <span className={styles.handle} />

      <div>
        <h2 id="rating-title" className={styles.title}>
          이 메뉴 어떠셨나요?
        </h2>
        <p className={styles.subtitle}>슬라이더를 움직이면 점수만큼 샐러드가 채워져요</p>
      </div>

      <div className={styles.preview}>
        <SaladRating score={score} />
        <p className={styles.myScore}>
          내 별점 <span>({score.toFixed(1)})</span>
        </p>
      </div>

      <div className={styles.slider}>
        <span className={styles.track} />
        <span className={styles.fill} style={{ width: x }} />
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={styles.tick} style={{ left: (n / 5) * TRACK_WIDTH - 0.75 }} />
        ))}
        <img src={knob} alt="" width="26" height="26" className={styles.knob} style={{ left: x - 13 }} />
        <span className={styles.value} style={{ left: x }}>
          {score.toFixed(1)}
        </span>
        <span className={styles.min}>0</span>
        <span className={styles.max}>5</span>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className={styles.range}
          aria-label="내 별점"
          aria-valuetext={`${score.toFixed(1)}점`}
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="button" className={styles.submit} onClick={submit} disabled={submitting}>
        별점 등록하기
      </button>
    </dialog>
  )
}
