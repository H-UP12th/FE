import styles from './Button.module.css'

// 초록 버튼 (가로 꽉 채움)
// 사용법: <Button onClick={...}>다음</Button>
//         <Button disabled>다음</Button>              → 흐리게, 클릭 안 됨
//         <Button type="submit">로그인</Button>         → form 안에서 제출
//         <Button variant="outline">취소</Button>       → 테두리만 있는 버튼
//         <Button className={styles.small}>...</Button> → 크기 등은 화면에서 덧붙여요
export default function Button({ children, variant = 'fill', className = '', ...props }) {
  return (
    <button type="button" className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
