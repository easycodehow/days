// js/main.js
// 엔트리 — 초기화 및 화면 렌더링

import { renderCalendarBar } from './ui/calendarBar.js';
import { renderMainView } from './views/mainView.js';
import { renderDetailView } from './views/detailView.js';
import { loadMemos, saveMemos } from './store.js';
import { formatDate } from './memo.js';

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

// "+" 버튼으로 새 메모를 작성할 때 쓸 빈 메모(초안)를 만든다
function createDraftMemo(date) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    date,
    size: 3,
    xPct: 30 + Math.random() * 40,
    yPct: 30 + Math.random() * 40,
    realized: false,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
}

function init() {
  const app = document.getElementById('app');

  const header = document.createElement('header');
  header.className = 'app-header';
  app.appendChild(header);

  const topRow = document.createElement('div');
  topRow.className = 'app-header__top';
  header.appendChild(topRow);

  const brand = document.createElement('div');
  brand.className = 'app-header__brand';
  brand.textContent = 'days';
  topRow.appendChild(brand);

  // renderCalendarBar가 컨테이너 innerHTML을 초기화하므로 header가 아닌 하위 컨테이너를 넘긴다
  const calendarBarContainer = document.createElement('div');
  header.appendChild(calendarBarContainer);

  let selectedDate = formatDate(new Date());

  function refreshCalendarBar() {
    renderCalendarBar(calendarBarContainer, {
      selectedDate,
      onSelectDate: (dateStr) => {
        selectedDate = dateStr;
        refreshCalendarBar();
      },
    });
  }

  refreshCalendarBar();

  const content = document.createElement('main');
  app.appendChild(content);

  // 새 메모 작성용 플로팅 버튼 — 상세보기 화면에서는 숨긴다
  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'fab-add';
  fab.textContent = '+';
  fab.setAttribute('aria-label', '메모 추가');
  fab.addEventListener('click', () => showCreate());
  app.appendChild(fab);

  const memos = getInitialMemos();

  function showMain() {
    fab.classList.remove('is-hidden');
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

    fab.classList.add('is-hidden');
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

  function showCreate() {
    const draft = createDraftMemo(selectedDate);

    fab.classList.add('is-hidden');
    renderDetailView(content, draft, {
      startEditing: true,
      onClose: showMain,
      onSave: (created) => {
        memos.push({ ...created, title: created.title || '제목 없음' });
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
  // controllerchange는 "최초 설치로 컨트롤러가 생기는 순간"에도 발생하므로,
  // 페이지 로드 시점에 이미 컨트롤러(이전 버전)가 있던 경우에만 새로고침한다.
  // 그래야 최초 방문 때 불필요하게 한 번 더 새로고침되는 걸 막을 수 있다.
  const hadController = !!navigator.serviceWorker.controller;
  let refreshed = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || refreshed) return;
    refreshed = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
