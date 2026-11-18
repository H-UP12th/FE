import styles from './Pagination.module.css'

// 목록 페이지 이동: < 현재 페이지 >
// 사용법: const [page, setPage] = useState(1)
//         <Pagination page={page} totalPages={5} onChange={setPage} />
// 첫 페이지에서는 <, 마지막 페이지에서는 > 가 흐려지고 안 눌려요
export default function Pagination({ page, totalPages, onChange }) {
  return (
    <nav className={styles.pagination} aria-label="페이지 이동">
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="이전 페이지"
      >
        &lt;
      </button>
      <span className={styles.current} aria-current="page">
        {page}
      </span>
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
      >
        &gt;
      </button>
    </nav>
  )
}
