import { useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { getMenus } from '../api/menus'
import BackHeader from '../components/BackHeader'
import plate from '../assets/main/plate.png'
import shelf from '../assets/menu/shelf.png'
import styles from './MenuList.module.css'

const CATEGORIES = [
  { value: 'SHARED', label: '공유' },
  { value: 'CALORIE', label: '저칼로리' },
  { value: 'PROTEIN', label: '단백질' },
  { value: 'SLOW_CARB', label: '저속노화' },
  { value: 'LOW_SUGAR', label: '저당' },
]

// 메뉴 이름표 색은 분홍 → 노랑 → 초록 순서로 돌아가요
const TAG_COLORS = ['var(--tag-pink)', 'var(--yellow-light)', 'var(--tag-green)']

// 한 선반에 2개씩
function toShelves(menus) {
  const shelves = []
  for (let i = 0; i < menus.length; i += 2) shelves.push(menus.slice(i, i + 2))
  return shelves
}

// 10 식단 목록 (/menus?category=CALORIE)
export default function MenuList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = CATEGORIES.some((c) => c.value === searchParams.get('category'))
    ? searchParams.get('category')
    : CATEGORIES[0].value

  const [result, setResult] = useState({ category: null, menus: [], error: '' })

  useEffect(() => {
    // 탭을 빨리 바꾸면 이전 요청은 취소해서 늦게 온 응답이 덮어쓰지 않게 해요
    const controller = new AbortController()
    const { signal } = controller
    getMenus(category, { signal })
      .then((menus) => !signal.aborted && setResult({ category, menus, error: '' }))
      .catch((err) => !signal.aborted && setResult({ category, menus: [], error: err.message }))
    return () => controller.abort()
  }, [category])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  const loading = result.category !== category

  return (
    <div className={styles.screen}>
      <BackHeader title="식단 목록" />

      <nav className={styles.tabs}>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            className={c.value === category ? styles.activeTab : styles.tab}
            aria-pressed={c.value === category}
            onClick={() => setSearchParams({ category: c.value }, { replace: true })}
          >
            {c.label}
          </button>
        ))}
      </nav>

      {!loading && (result.error || result.menus.length === 0) && (
        <p className={styles.empty}>{result.error || '아직 등록된 식단이 없어요'}</p>
      )}

      {!loading && (
        <div className={styles.shelves}>
          {toShelves(result.menus).map((row, r) => (
            <div key={r} className={styles.shelf}>
              <img src={shelf} alt="" className={styles.shelfImage} />
              {row.map((menu, i) => {
                const index = r * 2 + i
                return (
                  <Link key={menu.menuId} to={`/menus/${menu.menuId}`} className={styles.menu}>
                    <span className={styles.dish}>
                      <img src={plate} alt="" className={styles.plate} />
                      {menu.imageUrl && <img src={menu.imageUrl} alt="" className={styles.food} />}
                    </span>
                    <span className={styles.label}>
                      <span
                        className={styles.tag}
                        style={{
                          background: TAG_COLORS[index % TAG_COLORS.length],
                          transform: `rotate(${index % 2 ? -2 : 2}deg)`,
                        }}
                      >
                        {menu.name}
                      </span>
                      <span className={styles.tape} />
                    </span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
