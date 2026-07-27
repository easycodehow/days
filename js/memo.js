// js/memo.js
// 메모 모델 · 상태 판정 헬퍼

// 중요도(size 1~5) → 원 지름(px) 매핑
const CIRCLE_SIZE_PX = { 1: 72, 2: 90, 3: 108, 4: 126, 5: 144 };

// 중요도(size 1~5) → 원 안 제목 글자 크기(px) 매핑
const TITLE_FONT_PX = { 1: 13, 2: 14, 3: 15, 4: 16.5, 5: 18 };

// 중요도(size)에 대응하는 원 지름(px)을 반환한다
export function getCircleDiameter(size) {
  return CIRCLE_SIZE_PX[size] ?? CIRCLE_SIZE_PX[3];
}

// 중요도(size)에 대응하는 제목 글자 크기(px)를 반환한다
export function getTitleFontSize(size) {
  return TITLE_FONT_PX[size] ?? TITLE_FONT_PX[3];
}

// 메모 날짜가 오늘보다 이전(지난 날짜)인지 판정한다 — 저장 필드가 아니라 렌더링 시점에 계산
export function isPastMemo(dateStr, today = new Date()) {
  return dateStr < formatDate(today);
}

// Date 객체를 YYYY-MM-DD 문자열로 변환한다
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// YYYY-MM-DD 문자열을 "2026년 7월 27일" 형태로 표시용 변환한다
export function formatDateKo(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일`;
}
