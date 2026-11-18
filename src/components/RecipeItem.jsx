import { Link } from 'react-router-dom'
import styles from './RecipeItem.module.css'

// 레시피 한 줄 (저장한/내가 만든/최근 본 레시피 목록에서 사용)
// 사용법: <RecipeItem id={1} name="현미볶음밥" image="https://..." />
//         image 없으면 회색 네모로 보여요
// 누르면 /recipes/{id} 로 이동 → 메뉴 상세 주소가 정해지면 to 부분만 바꾸면 돼요
export default function RecipeItem({ id, name, image }) {
  return (
    <Link to={`/recipes/${id}`} className={styles.item}>
      {image ? (
        <img src={image} alt="" className={styles.thumb} />
      ) : (
        <div className={styles.thumb} />
      )}
      <span className={styles.name}>{name}</span>
    </Link>
  )
}
