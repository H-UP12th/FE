import { useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import logo from '../assets/main/logo.svg'
import fridge from '../assets/main/fridge.svg'
import mypageCard from '../assets/main/mypage-card.svg'
import toBuyNote from '../assets/main/to-buy-note.png'
import memoNote from '../assets/main/memo-note.png'
import memoLabel from '../assets/main/memo-label.png'
import plate from '../assets/main/plate.png'
import popular1 from '../assets/main/popular-1.png'
import popular2 from '../assets/main/popular-2.png'
import popular3 from '../assets/main/popular-3.png'
import styles from './Main.module.css'

// 냉장고 선반의 카테고리 (값은 API의 category)
const CATEGORY_ROWS = [
  [
    { category: 'SHARED', label: '공유식단', color: 'var(--tag-pink)', tilt: 2, overlap: 18 },
    { category: 'CALORIE', label: '저칼로리식단', color: 'var(--yellow-light)', tilt: -2, overlap: 17 },
  ],
  [
    { category: 'PROTEIN', label: '단백질식단', color: 'var(--tag-green)', tilt: 2, overlap: 18 },
    { category: 'SLOW_CARB', label: '저속노화식단', color: 'var(--tag-pink)', tilt: -2, overlap: 16 },
    { category: 'LOW_SUGAR', label: '저당식단', color: 'var(--yellow-light)', tilt: 2, overlap: 17 },
  ],
]

// 인기 식단 API가 아직 없어서 피그마 샘플을 임시로 보여줘요
const POPULAR_MENUS = [
  { rank: 1, image: popular1 },
  { rank: 2, image: popular2 },
  { rank: 3, image: popular3 },
  { rank: 4 },
  { rank: 5 },
]

// 가운데(0)를 기준으로 한 자리별 위치: 왼쪽 위 좌표, 지름, 투명도
const SLOTS = {
  0: { x: 123, y: 2, size: 84 },
  1: { x: 239, y: 16, size: 72 },
  2: { x: 332, y: 28, size: 56, hidden: true },
  '-2': { x: -58, y: 28, size: 56, hidden: true },
  '-1': { x: 19, y: 16, size: 72 },
}

function PopularCarousel() {
  const [active, setActive] = useState(0)
  const startX = useRef(null)
  const count = POPULAR_MENUS.length
  const move = (step) => setActive((i) => (i + step + count) % count)

  return (
    <div
      className={styles.carousel}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        const dx = e.clientX - startX.current
        if (Math.abs(dx) > 30) move(dx < 0 ? 1 : -1)
      }}
    >
      {POPULAR_MENUS.map((menu, i) => {
        // -2 ~ 2 사이의 자리 번호
        const offset = ((i - active + count + 2) % count) - 2
        const slot = SLOTS[offset]
        return (
          <button
            key={menu.rank}
            type="button"
            className={styles.popularItem}
            style={{
              transform: `translate(${slot.x}px, ${slot.y}px) scale(${slot.size / 84})`,
              opacity: slot.hidden ? 0 : 1,
            }}
            tabIndex={slot.hidden ? -1 : 0}
            aria-label={`인기 ${menu.rank}위`}
            onClick={() => offset !== 0 && move(offset)}
          >
            {menu.image && <img src={menu.image} alt="" />}
            <span className={styles.rank}>{menu.rank}</span>
          </button>
        )
      })}
    </div>
  )
}

// 09 메인 (냉장고)
export default function Main() {
  if (!isLoggedIn()) return <Navigate to="/start" replace />

  return (
    <div className={styles.main}>
      <img src={logo} alt="핼팅" width="86" height="76" />

      <div className={styles.fridge}>
        <img src={fridge} alt="" className={styles.fridgeBg} width="373" height="676" />

        <Link to="/mypage" className={styles.mypage} aria-label="마이페이지">
          <img src={mypageCard} alt="" width="63" height="76" />
        </Link>

        <Link to="/to-buy" className={styles.toBuy} aria-label="장볼 거 메모">
          <img src={toBuyNote} alt="" className={styles.toBuyNote} />
          <span className={styles.toBuyLabel}>
            <img src={toBuyNote} alt="" />
          </span>
          <span className={styles.toBuyText}>TO-BUY</span>
          <span className={styles.toBuyTape} />
        </Link>

        <Link to="/memo" className={styles.memo} aria-label="자유 메모">
          <img src={memoNote} alt="" className={styles.memoNote} />
          <img src={memoLabel} alt="" className={styles.memoLabel} />
          <span className={styles.memoText}>MEMO</span>
          <span className={styles.memoTape} />
        </Link>

        <nav className={styles.categories}>
          {CATEGORY_ROWS.map((row, r) => (
            <div key={r} className={styles.categoryRow}>
              {row.map((item) => (
                <Link key={item.category} to={`/menus?category=${item.category}`} className={styles.category}>
                  <span
                    className={styles.tag}
                    style={{
                      background: item.color,
                      transform: `rotate(${item.tilt}deg)`,
                      marginBottom: -item.overlap,
                    }}
                  >
                    {item.label}
                  </span>
                  <img src={plate} alt="" width="100" height="35" />
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <section className={styles.popular}>
          <div className={styles.popularLabel}>
            <span className={styles.tag} style={{ background: 'var(--tag-green)', fontWeight: 500 }}>
              인기식단 TOP 5
            </span>
            <span className={styles.popularTape} />
          </div>
          <PopularCarousel />
        </section>
      </div>
    </div>
  )
}
