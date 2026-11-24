import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { getPopularMenus } from '../api/menus'
import logo from '../assets/main/logo.svg'
import fridge from '../assets/main/fridge.svg'
import mypageCard from '../assets/main/mypage-card.svg'
import toBuyNote from '../assets/main/to-buy-note.png'
import memoNote from '../assets/main/memo-note.png'
import memoLabel from '../assets/main/memo-label.png'
import plate from '../assets/main/plate.png'
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

const POPULAR_COUNT = 5

// 가운데(0)를 기준으로 한 자리별 위치: 왼쪽 위 좌표, 지름, 투명도
const SLOTS = {
  0: { x: 123, y: 2, size: 84 },
  1: { x: 239, y: 16, size: 72 },
  2: { x: 332, y: 28, size: 56, hidden: true },
  '-2': { x: -58, y: 28, size: 56, hidden: true },
  '-1': { x: 19, y: 16, size: 72 },
}

const OPENED_KEY = 'fridgeOpened'
const DOOR_THICKNESS = 16 // 문 두께(px)

function hasOpened() {
  try {
    return sessionStorage.getItem(OPENED_KEY) === '1'
  } catch {
    return true
  }
}

function markOpened() {
  try {
    sessionStorage.setItem(OPENED_KEY, '1')
  } catch {
    // 저장소를 못 쓰면 로그인·온보딩 직후에만 열려요
  }
}

// 아래 칸 문이 열리면서 불이 켜지는 모션
// 로그인·온보딩 직후(state.openFridge)와 브라우저 탭에서 처음 들어올 때만 보여줘요
function FridgeDoor() {
  const location = useLocation()
  const navigate = useNavigate()
  const [opening, setOpening] = useState(() => Boolean(location.state?.openFridge) || !hasOpened())
  // 처음 들어오면 냉장고 그림을 받는 동안 문을 닫아두고, 다 받은 뒤에 열어요
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!opening) return
    const image = new Image()
    image.onload = image.onerror = () => setReady(true)
    image.src = fridge
  }, [opening])

  const fromLogin = Boolean(location.state?.openFridge)
  const { pathname } = location

  useEffect(() => {
    markOpened()
    // 새로고침했을 때 다시 열리지 않게 이동 기록에 남은 state를 지워요
    if (fromLogin) navigate(pathname, { replace: true })
  }, [fromLogin, pathname, navigate])

  if (!opening) return null

  return (
    <div className={`${styles.doorLayer} ${ready ? '' : styles.waiting}`} aria-hidden="true">
      <div className={styles.dim} />
      <div className={styles.glow} />
      {/* 앞면 뒤로 같은 모양 판을 1px씩 겹쳐 쌓아서, 둥근 모서리까지 이어진 두께를 만들어요 */}
      <div className={styles.door} onAnimationEnd={(e) => e.target === e.currentTarget && setOpening(false)}>
        <div className={styles.doorFront} />
        {Array.from({ length: DOOR_THICKNESS }, (_, i) => (
          <div key={i} className={styles.doorSlice} style={{ transform: `translateZ(${-(i + 1)}px)` }} />
        ))}
      </div>
    </div>
  )
}

function PopularCarousel() {
  const navigate = useNavigate()
  const [popular, setPopular] = useState([])
  const [active, setActive] = useState(0)
  const startX = useRef(null)
  const count = POPULAR_COUNT
  const move = (step) => setActive((i) => (i + step + count) % count)

  useEffect(() => {
    // 실패하면 빈 자리(회색 원)로 둬요
    getPopularMenus()
      .then(setPopular)
      .catch(() => {})
  }, [])

  // 메뉴가 5개보다 적으면 남는 자리는 회색 원
  const menus = Array.from({ length: count }, (_, i) => popular[i] ?? { rank: i + 1 })

  return (
    <div
      className={styles.carousel}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        const dx = e.clientX - startX.current
        if (Math.abs(dx) > 30) move(dx < 0 ? 1 : -1)
      }}
    >
      {menus.map((menu, i) => {
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
            aria-label={menu.name ? `인기 ${menu.rank}위 ${menu.name}` : `인기 ${menu.rank}위`}
            onClick={() => {
              if (offset !== 0) move(offset)
              else if (menu.menuId) navigate(`/menus/${menu.menuId}`)
            }}
          >
            {menu.imageUrl && <img src={menu.imageUrl} alt="" />}
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

        <FridgeDoor />
      </div>
    </div>
  )
}
