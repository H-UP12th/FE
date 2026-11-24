import { Link } from 'react-router-dom'
import { findCategory } from '../constants/categories'
import styles from './RecipeItem.module.css'

// 레시피 한 줄 (저장한/내가 만든/최근 본 레시피 목록에서 사용)
// 사용법: <RecipeItem id={1} name="현미볶음밥" image="https://..." category="LOW_SUGAR" />
//         image 없으면 연노랑 네모, category 없으면 태그 없이 보여요. 누르면 메뉴 상세로 가요
export default function RecipeItem({ id, name, image, category }) {
  const tag = findCategory(category)

  return (
    <Link to={`/menus/${id}`} className={styles.item}>
      {image ? <img src={image} alt="" className={styles.thumb} /> : <span className={styles.thumb} />}
      <span className={styles.info}>
        <span className={styles.name}>{name}</span>
        {tag && <span className={styles.tag}>{tag.label}</span>}
      </span>
    </Link>
  )
}
