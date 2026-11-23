import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'
import { createRecipe } from '../api/menus'
import BackHeader from '../components/BackHeader'
import camera from '../assets/recipe/camera.svg'
import remove from '../assets/recipe/remove.svg'
import styles from './RecipeCreate.module.css'

const TIP_MAX = 500
const emptyIngredient = () => ({ id: crypto.randomUUID(), name: '', amount: '' })
const emptyStep = () => ({ id: crypto.randomUUID(), content: '' })

// 10-2 레시피 입력(1단계) → 10-3 추가 사항·신청(2단계) (/menus/new, 2단계는 ?step=2)
// 단계를 주소에 남겨서 휴대폰 뒤로가기로도 1단계로 돌아와요 (입력한 내용은 그대로)
export default function RecipeCreate() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const step = searchParams.get('step') === '2' ? 2 : 1

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState(() => [emptyIngredient(), emptyIngredient(), emptyIngredient()])
  const [steps, setSteps] = useState(() => [emptyStep(), emptyStep(), emptyStep()])
  const [tip, setTip] = useState('')
  const [touched, setTouched] = useState({ name: false, steps: false })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 미리보기 주소는 사진을 바꾸거나 화면을 나가면 정리해요
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  function choosePhoto(file) {
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const filledIngredients = ingredients.filter((i) => i.name.trim())
  const filledSteps = steps.filter((s) => s.content.trim())
  const canNext = name.trim() && filledIngredients.length > 0 && filledSteps.length > 0

  if (!isLoggedIn()) return <Navigate to="/start" replace />
  // 새로고침 등으로 2단계에 빈 내용으로 들어오면 1단계로
  if (step === 2 && !canNext) return <Navigate to="/menus/new" replace />

  const nameError = touched.name && !name.trim()
  const stepsError = touched.steps && filledSteps.length === 0

  function updateIngredient(id, field, value) {
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  function updateStep(id, value) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, content: value } : s)))
  }

  async function submit() {
    setError('')
    setSubmitting(true)
    try {
      // 빈 재료·단계 줄은 빼고, 단계 번호는 1부터 다시 매겨요
      await createRecipe(
        {
          name: name.trim(),
          ingredients: filledIngredients.map((i) => ({ name: i.name.trim(), amount: i.amount.trim() || null })),
          recipeSteps: filledSteps.map((s, index) => ({ stepNo: index + 1, content: s.content.trim() })),
          tip: tip.trim() || null,
        },
        image,
      )
      // 마이페이지(23 내가 만든 레시피)가 생기기 전까지는 공유 탭으로
      navigate('/menus?category=SHARED', { replace: true, state: { submitted: true } })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.screen}>
      <BackHeader title="식단 등록" />

      <div className={styles.progress}>
        <p>
          <span>{step === 1 ? '레시피 입력' : '추가 사항 · 신청'}</span>
          <span className={styles.stepCount}>{step} / 2</span>
        </p>
        <span className={styles.bar}>
          <span style={{ width: step === 1 ? '50%' : '100%' }} />
        </span>
      </div>

      {step === 1 ? (
        <div className={styles.body}>
          {/* 대표 사진 (선택) */}
          <label className={preview ? styles.photoSelected : styles.photo}>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={(e) => choosePhoto(e.target.files[0])}
            />
            {preview ? (
              <>
                <img src={preview} alt="대표 사진 미리보기" className={styles.previewImage} />
                <span className={styles.photoChange}>사진 바꾸기</span>
              </>
            ) : (
              <>
                <img src={camera} alt="" width="25.8" height="21.8" />
                <span className={styles.photoTitle}>대표 사진 올리기</span>
                <span className={styles.photoSub}>승인되면 냉장고에 어울리는 일러스트로 바뀌어요</span>
              </>
            )}
          </label>

          <section className={styles.section}>
            <label htmlFor="recipe-name" className={styles.heading}>
              레시피 제목
            </label>
            <input
              id="recipe-name"
              className={nameError ? styles.inputError : styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              maxLength={100}
              placeholder="예) 지중해식 토마토 파스타"
              aria-invalid={nameError}
            />
            {nameError && <p className={styles.errorText}>레시피 제목을 입력해 주세요</p>}
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>
              재료 <span className={styles.sub}>1인분 기준</span>
            </h2>
            {ingredients.map((item) => (
              <div key={item.id} className={styles.ingredient}>
                <input
                  className={styles.input}
                  value={item.name}
                  onChange={(e) => updateIngredient(item.id, 'name', e.target.value)}
                  maxLength={50}
                  placeholder="재료명"
                  aria-label="재료명"
                />
                <input
                  className={`${styles.input} ${styles.amount}`}
                  value={item.amount}
                  onChange={(e) => updateIngredient(item.id, 'amount', e.target.value)}
                  maxLength={30}
                  placeholder="분량"
                  aria-label="분량"
                />
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => setIngredients((prev) => prev.filter((i) => i.id !== item.id))}
                  aria-label="재료 줄 삭제"
                >
                  <img src={remove} alt="" width="24" height="24" />
                </button>
              </div>
            ))}
            <button type="button" className={styles.add} onClick={() => setIngredients((prev) => [...prev, emptyIngredient()])}>
              + 재료 추가
            </button>
          </section>

          <section className={styles.steps}>
            <h2 className={styles.heading}>만드는 법</h2>
            {steps.map((item, index) => (
              <div key={item.id}>
                <div className={styles.step}>
                  <span className={styles.stepNo}>{String(index + 1).padStart(2, '0')}</span>
                  <textarea
                    className={stepsError && index === 0 ? styles.textareaError : styles.textarea}
                    value={item.content}
                    onChange={(e) => updateStep(item.id, e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, steps: true }))}
                    placeholder={index === 0 ? '예) 팬에 올리브유를 두르고 닭가슴살을 구워요' : '조리 과정을 입력해주세요'}
                    aria-label={`조리 과정 ${index + 1}단계`}
                  />
                </div>
                {stepsError && index === 0 && <p className={styles.errorText}>조리 과정을 한 단계 이상 입력해 주세요</p>}
              </div>
            ))}
            <button type="button" className={styles.add} onClick={() => setSteps((prev) => [...prev, emptyStep()])}>
              + 단계 추가
            </button>
          </section>
        </div>
      ) : (
        <div className={styles.body}>
          <section className={styles.section}>
            <label htmlFor="recipe-tip" className={styles.heading}>
              추가 사항 <span className={styles.sub}>선택</span>
            </label>
            <textarea
              id="recipe-tip"
              className={styles.tip}
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              maxLength={TIP_MAX}
              placeholder={'조리 팁이나 주의할 점을 적어주세요\n예) 드레싱은 먹기 직전에 뿌려야 채소가 숨이 죽지 않아요'}
            />
            <p className={styles.length}>
              {tip.length} / {TIP_MAX}
            </p>
          </section>

          <section className={styles.guide}>
            <h2>신청하면 이렇게 진행돼요</h2>
            <ol>
              <li>관리자가 레시피를 확인해요</li>
              <li>대표 사진을 냉장고에 어울리는 일러스트로 바꾸고 영양 정보를 채워요</li>
              <li>승인되면 공유식단 냉장고에 올라가요</li>
            </ol>
            <p>진행 상황은 마이페이지 › 내가 만든 레시피에서 확인할 수 있어요</p>
          </section>

          {error && (
            <p className={styles.errorText} role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      <div className={styles.actionBar}>
        {step === 1 ? (
          <button type="button" className={styles.primary} disabled={!canNext} onClick={() => setSearchParams({ step: '2' })}>
            다음
          </button>
        ) : (
          <>
            <button type="button" className={styles.prev} onClick={() => navigate(-1)}>
              이전
            </button>
            <button type="button" className={styles.primary} disabled={submitting} onClick={submit}>
              공유식단 신청하기
            </button>
          </>
        )}
      </div>
    </div>
  )
}
