import { request } from './client'

const base = (menuId) => `/api/menus/${menuId}/questions`

// 질문 목록(최신순): { totalCount, questions: [{ questionId, loginId, content, answerCount, createdAt }] }
export const getQuestions = (menuId, options) => request(base(menuId), options)

// 질문 등록(1,000자 이내) → { questionId, loginId, content, answerCount, createdAt }
export const createQuestion = (menuId, content) =>
  request(base(menuId), { method: 'POST', body: JSON.stringify({ content }) })

// 질문 상세 + 답변(오래된 순): { menu: { menuId, category, name }, questionId, loginId, content,
//   createdAt, answerCount, canAnswer, answers: [{ answerId, loginId, content, createdAt }] }
// canAnswer: 내가 이 식단의 작성자면 true
export const getQuestion = (menuId, questionId, options) =>
  request(`${base(menuId)}/${questionId}`, options)

// 답변 등록(식단 작성자만, 1,000자 이내)
export const createAnswer = (menuId, questionId, content) =>
  request(`${base(menuId)}/${questionId}/answers`, { method: 'POST', body: JSON.stringify({ content }) })
