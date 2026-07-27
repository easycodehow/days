// js/main.js
// 엔트리 — 초기화 및 화면 렌더링

import { renderCalendarBar } from './ui/calendarBar.js';
import { renderMainView } from './views/mainView.js';
import { renderDetailView } from './views/detailView.js';
import { loadMemos, saveMemos } from './store.js';

// localStorage가 비어있을 때(최초 실행) 시드로 저장할 샘플 메모
const SEED_MEMOS = [
  {
    id: 'mock-1',
    title: '기획 회의',
    content: '3시에 카페에서 다음 분기 로드맵 논의',
    date: '2026-07-20',
    size: 2,
    xPct: 22,
    yPct: 22,
    realized: true,
  },
  {
    id: 'mock-2',
    title: '생일 파티',
    content: '친구 생일 파티 준비하기, 케이크 예약 확인',
    date: '2026-07-27',
    size: 4,
    xPct: 62,
    yPct: 38,
    realized: true,
  },
  {
    id: 'mock-3',
    title: '여행 계획',
    content: '가을 제주도 여행 일정 짜기',
    date: '2026-08-15',
    size: 5,
    xPct: 40,
    yPct: 66,
    realized: false,
  },
  {
    id: 'mock-4',
    title: '책 읽기',
    content: '이번 주 안에 다 읽기',
    date: '2026-07-30',
    size: 1,
    xPct: 80,
    yPct: 72,
    realized: false,
  },
];

// 저장된 메모를 불러온다. 저장된 게 없으면 샘플 메모로 시드한 뒤 저장한다.
function getInitialMemos() {
  const stored = loadMemos();
  if (stored.length > 0) return stored;

  saveMemos(SEED_MEMOS);
  return SEED_MEMOS;
}

function init() {
  const app = document.getElementById('app');

  const header = document.createElement('header');
  header.className = 'app-header';
  app.appendChild(header);

  const brand = document.createElement('div');
  brand.className = 'app-header__brand';
  brand.textContent = 'days';
  header.appendChild(brand);

  // renderCalendarBar가 컨테이너 innerHTML을 초기화하므로 header가 아닌 하위 컨테이너를 넘긴다
  const calendarBarContainer = document.createElement('div');
  header.appendChild(calendarBarContainer);
  renderCalendarBar(calendarBarContainer);

  const content = document.createElement('main');
  app.appendChild(content);

  const memos = getInitialMemos();

  function showMain() {
    renderMainView(content, memos, {
      onMemoMove: (id, xPct, yPct) => {
        const memo = memos.find((m) => m.id === id);
        if (!memo) return;
        memo.xPct = xPct;
        memo.yPct = yPct;
        saveMemos(memos);
      },
      onOpenDetail: (id) => showDetail(id),
    });
  }

  function showDetail(id) {
    const memo = memos.find((m) => m.id === id);
    if (!memo) return;

    renderDetailView(content, memo, {
      onClose: showMain,
      onSave: (updated) => {
        Object.assign(memo, updated);
        saveMemos(memos);
        showMain();
      },
      onDelete: (deleteId) => {
        const index = memos.findIndex((m) => m.id === deleteId);
        if (index !== -1) memos.splice(index, 1);
        saveMemos(memos);
        showMain();
      },
    });
  }

  showMain();
}

init();

// 오프라인 캐싱을 위한 서비스워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
