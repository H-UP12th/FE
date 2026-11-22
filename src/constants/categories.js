// 식단 카테고리 (value는 API의 category), 탭 순서대로
export const CATEGORIES = [
  { value: 'SHARED', label: '공유', color: 'var(--tag-pink)' },
  { value: 'CALORIE', label: '저칼로리', color: 'var(--yellow-light)' },
  { value: 'PROTEIN', label: '단백질', color: 'var(--tag-green)' },
  { value: 'SLOW_CARB', label: '저속노화', color: 'var(--tag-pink)' },
  { value: 'LOW_SUGAR', label: '저당', color: 'var(--yellow-light)' },
]

export const findCategory = (value) => CATEGORIES.find((c) => c.value === value)
