// js/main.js
// 엔트리 — 초기화 및 화면 렌더링

import { renderCalendarBar } from './ui/calendarBar.js';
import { renderMainView } from './views/mainView.js';

// TODO: store.js 연동 전 임시 목업 데이터 — "메모 저장/불러오기" 단계에서 localStorage로 교체 예정
const MOCK_MEMOS = [
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

function init() {
  const app = document.getElementById('app');

  const header = document.createElement('header');
  header.className = 'app-header';
  app.appendChild(header);
  renderCalendarBar(header);

  const main = document.createElement('main');
  main.className = 'app-main';
  app.appendChild(main);
  renderMainView(main, MOCK_MEMOS);
}

init();

// 오프라인 캐싱을 위한 서비스워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
