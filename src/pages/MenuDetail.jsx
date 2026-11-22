import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { getMenu, setBookmark } from '../api/menus'
import BackHeader from '../components/BackHeader'
import { findCategory } from '../constants/categories'
import styles from './MenuDetail.module.css'

// 막대 길이는 탄·단·지 칼로리 비율 (1g당 탄수화물 4, 단백질 4, 지방 9kcal)
const NUTRIENTS = [
  { key: 'carbs', label: '탄수화물', kcal: 4, color: 'var(--yellow)' },
  { key: 'protein', label: '단백질', kcal: 4, color: 'var(--green)' },
  { key: 'fat', label: '지방', kcal: 9, color: '#e88cac' },
]

// 피그마 Icon/Bookmark를 그대로 옮긴 것: 저장하면 안을 채워요
function BookmarkIcon({ filled }) {
  return (
    <svg width="29.7095" height="29.7095" viewBox="0 0 29.7095 29.7095" aria-hidden="true">
      <path
        d="M8.91286 5.9419H20.7967V23.7676L14.8548 19.3112L8.91286 23.7676V5.9419Z"
        fill={filled ? 'var(--green)' : 'none'}
        stroke="var(--green)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InfoTab({ menu }) {
  const grams = NUTRIENTS.map((n) => Number(menu.nutrients?.[n.key] ?? 0))
  const totalKcal = NUTRIENTS.reduce((sum, n, i) => sum + grams[i] * n.kcal, 0)

  return (
    <>
      <section className={styles.nutrition}>
        <div className={styles.kcalRow}>
          <p className={styles.kcal}>
            <strong>{menu.calories ?? '-'}</strong>kcal
          </p>
          <p className={styles.serving}>1인분 기준</p>
        </div>
        {NUTRIENTS.map((n, i) => (
          <div key={n.key} className={styles.bar}>
            <span className={styles.barLabel}>{n.label}</span>
            <span className={styles.track}>
              <span
                className={styles.fill}
                style={{
                  width: totalKcal ? `${((grams[i] * n.kcal) / totalKcal) * 100}%` : 0,
                  background: n.color,
                }}
              />
            </span>
            <span className={styles.barValue}>{grams[i]}g</span>
          </div>
        ))}
      </section>

      {menu.description && (
        <section className={styles.section}>
          <h2 className={styles.heading}>설명</h2>
          <p className={styles.description}>{menu.description}</p>
        </section>
      )}

      {menu.ingredients.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>재료 · 1인분</h2>
          <ul className={styles.chips}>
            {menu.ingredients.map((item) => (
              <li key={item.name} className={styles.chip}>
                {item.name} {item.amount}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

function RecipeTab({ menu }) {
  return (
    <>
      {menu.substitutes.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>대체 재료</h2>
          {menu.substitutes.map((s) => (
            <div key={s.originalName} className={styles.substitute}>
              <span>{s.originalName}</span>
              <strong>→</strong>
              <strong>{s.substituteName}</strong>
              <span className={styles.substituteAmount}>{s.amount}</span>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className={styles.heading}>만드는 법</h2>
        <ol className={styles.steps}>
          {menu.recipeSteps.map((step) => (
            <li key={step.stepNo} className={styles.step}>
              <span className={styles.stepNo}>{String(step.stepNo).padStart(2, '0')}</span>
              <p className={styles.stepContent}>{step.content}</p>
            </li>
          ))}
        </ol>
      </section>

      {menu.tip && (
        <section className={styles.section}>
          <h2 className={styles.heading}>추가 사항</h2>
          <p className={styles.tip}>{menu.tip}</p>
        </section>
      )}
    </>
  )
}

// 11 메뉴 상세 (정보 · 재료 탭), 12 메뉴 상세 - 레시피 탭
export default function MenuDetail() {
  const { menuId } = useParams()
  const [result, setResult] = useState({ menuId: null, menu: null, error: '' })
  const [tab, setTab] = useState('info')
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getMenu(menuId, { signal })
      .then((menu) => {
        if (signal.aborted) return
        setResult({ menuId, menu, error: '' })
        setBookmarked(menu.isBookmarked)
      })
      .catch((err) => !signal.aborted && setResult({ menuId, menu: null, error: err.message }))
    return () => controller.abort()
  }, [menuId])

  if (!isLoggedIn()) return <Navigate to="/start" replace />

  const menu = result.menuId === menuId ? result.menu : null
  const error = result.menuId === menuId ? result.error : ''

  // 화면을 먼저 바꾸고, 저장이 실패하면 되돌려요
  async function toggleBookmark() {
    const next = !bookmarked
    setBookmarked(next)
    try {
      await setBookmark(menuId, next)
    } catch {
      setBookmarked(!next)
    }
  }

  const category = menu && findCategory(menu.category)

  return (
    <div className={styles.screen}>
      <BackHeader title="메뉴 상세" />

      {error && <p className={styles.error}>{error}</p>}

      {menu && (
        <>
          <div className={styles.hero}>
            {menu.imageUrl && <img src={menu.imageUrl} alt="" width="160" height="160" />}
          </div>

          <div className={styles.title}>
            <h1 className={styles.name}>{menu.name}</h1>
            <div className={styles.meta}>
              {category && (
                <span className={styles.tag} style={{ background: category.color }}>
                  {category.label}식단
                </span>
              )}
              <span className={styles.rating}>★ {Number(menu.rating.average).toFixed(1)}</span>
              <span>평가 {menu.rating.count}</span>
            </div>
          </div>

          <div className={styles.tabs} role="tablist">
            {[
              ['info', '정보 · 재료'],
              ['recipe', '레시피'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                className={tab === value ? styles.activeTab : styles.tab}
                onClick={() => setTab(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.content}>
            {tab === 'info' ? <InfoTab menu={menu} /> : <RecipeTab menu={menu} />}
          </div>

          <div className={styles.actionBar}>
            <button
              type="button"
              className={styles.bookmark}
              aria-pressed={bookmarked}
              aria-label={bookmarked ? '북마크 해제' : '북마크 저장'}
              onClick={toggleBookmark}
            >
              <BookmarkIcon filled={bookmarked} />
            </button>
            {/* 13 별점 바텀시트는 다음 작업에서 연결해요 */}
            <button type="button" className={styles.rate}>
              별점 남기기
            </button>
          </div>
        </>
      )}
    </div>
  )
}
