// js/store.js
// localStorage 저장/불러오기 (데이터 계층)

const STORAGE_KEY = 'days.memos';
const SCHEMA_VERSION = 1;

// 저장된 메모 배열을 불러온다. 저장된 게 없거나 손상됐으면 빈 배열을 반환한다.
export function loadMemos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.memos) ? parsed.memos : [];
  } catch {
    return [];
  }
}

// 메모 배열을 저장한다.
export function saveMemos(memos) {
  const payload = { version: SCHEMA_VERSION, memos };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
