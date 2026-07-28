// js/memo.js
// 메모 모델 · 상태 판정 헬퍼

// 중요도(size 1~5) → 원 지름(px) 매핑. 최대치(5)는 화면을 넘칠 만큼 크게 잡는다.
const CIRCLE_SIZE_PX = { 1: 80, 2: 160, 3: 260, 4: 380, 5: 520 };

// 중요도(size 1~5) → 원 안 제목 글자 크기(px) 매핑
const TITLE_FONT_PX = { 1: 13, 2: 15, 3: 18, 4: 21, 5: 26 };

// 중요도(size)에 대응하는 원 지름(px)을 반환한다
export function getCircleDiameter(size) {
  return CIRCLE_SIZE_PX[size] ?? CIRCLE_SIZE_PX[3];
}

// 중요도(size)에 대응하는 제목 글자 크기(px)를 반환한다
export function getTitleFontSize(size) {
  return TITLE_FONT_PX[size] ?? TITLE_FONT_PX[3];
}

// 메모의 확정 상태 3단계 — 원 스타일(채움/점선/실선)과 상세보기 선택 UI에서 함께 쓴다
export const MEMO_STATUS_OPTIONS = [
  { value: 'unlikely', label: '가능성 없는 메모' },
  { value: 'thinking', label: '생각중인 메모' },
  { value: 'confirmed', label: '확정된 메모' },
];

// 메모의 확정 상태(3단계)를 반환한다. 예전 데이터는 status 필드가 없고 realized(2단계)만
// 있을 수 있어, 그 경우 realized:true→confirmed, false→thinking으로 변환해 호환한다.
export function getMemoStatus(memo) {
  if (MEMO_STATUS_OPTIONS.some((option) => option.value === memo.status)) {
    return memo.status;
  }
  return memo.realized ? 'confirmed' : 'thinking';
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
