// js/views/mainView.js
// 메인화면 — 떠다니는 메모 원(뭉게구름) 렌더링

import { getCircleDiameter, getTitleFontSize, isPastMemo, getMemoStatus } from '../memo.js';
import { makeDraggable } from '../ui/drag.js';

// 미리보기로 커질 때 원래 크기보다 얼마나 더 커질지 — 고정값이 아니라 원래 크기에 더하는
// 방식이라야, 이미 큰 원(예: 최대 중요도)을 탭했을 때 오히려 작아지는 문제가 생기지 않는다.
const PREVIEW_EXTRA_PX = 60;

// "홈 화면"(원래 xPct 0~100% 범위) 기준으로 좌우 얼마나 더 넓게 원을 두고 화면을 밀 수 있는지.
// 실제 DOM 크기를 키우는 게 아니라 좌표 한계값이라 성능에는 영향 없음 — "최대한 넓게" 요청에
// 따라 넉넉하게(화면 폭의 약 50배) 잡는다.
const PAN_RANGE_PCT = 5000;

// 메모 배열을 컨테이너에 떠다니는 원으로 렌더링한다
// onMemoMove(id, xPct, yPct): 드래그로 위치가 바뀌었을 때 호출
// onOpenDetail(id): 미리보기의 "+" 버튼을 눌렀을 때 호출
// onMemoResize(id, size): 두 손가락 핀치로 크기를 바꾸고 손을 뗐을 때 호출
export function renderMainView(container, memos, { onMemoMove, onOpenDetail, onMemoResize } = {}) {
  container.className = 'app-main main-view';
  container.innerHTML = '';

  // 원들은 이 캔버스 레이어의 자식으로 배치된다. 캔버스 자체는 화면과 같은 폭이지만
  // overflow:visible이라 xPct가 0~100%를 벗어난 자식도 잘리지 않고 그 자리에 그려지고,
  // 바깥 .app-main(overflow:hidden)이 화면에 보이는 부분만 잘라서 보여준다.
  const canvas = document.createElement('div');
  canvas.className = 'main-view-canvas';
  container.appendChild(canvas);

  let openId = null;
  // 원을 터치할 때마다 값을 올려서 그 원의 z-index로 지정 — 마지막으로 건드린 원이 항상 맨 위로 온다
  let topZIndex = 10;
  // 원을 만지는 중(드래그/핀치)에는 배경 패닝이 함께 발생하지 않도록 막는 카운터
  let activeCircleCount = 0;

  memos.forEach((memo, index) => {
    const el = createMemoCircle(memo, index);
    canvas.appendChild(el);

    makeDraggable(el, canvas, {
      onActivate: () => {
        activeCircleCount += 1;
        topZIndex += 1;
        el.style.zIndex = topZIndex;
      },
      onDeactivate: () => {
        activeCircleCount = Math.max(0, activeCircleCount - 1);
      },
      onDragEnd: (xPct, yPct) => onMemoMove?.(memo.id, xPct, yPct),
      onTap: () => {
        if (openId === memo.id) {
          closePreview(el);
          openId = null;
          return;
        }
        if (openId) {
          const openEl = canvas.querySelector(`[data-id="${openId}"]`);
          if (openEl) closePreview(openEl);
        }
        openPreview(el, memo, onOpenDetail);
        openId = memo.id;
      },
      getSize: () => memo.size,
      onResize: (newSize) => {
        el.style.width = `${getCircleDiameter(newSize)}px`;
        el.style.height = `${getCircleDiameter(newSize)}px`;
        el.style.fontSize = `${getTitleFontSize(newSize)}px`;
      },
      onResizeEnd: (finalSize) => onMemoResize?.(memo.id, finalSize),
      xPctRange: [-PAN_RANGE_PCT, 100 + PAN_RANGE_PCT],
      yPctRange: [-PAN_RANGE_PCT, 100 + PAN_RANGE_PCT],
    });
  });

  makePannable(container, canvas, PAN_RANGE_PCT, () => activeCircleCount);
}

// 배경을 한 손가락으로 상하좌우로 끌면 캔버스 전체가 이동(패닝)한다.
// viewportEl: 화면에 보이는 고정 영역(.app-main, overflow:hidden)
// canvasEl: 실제로 이동시킬 원 레이어
// getActiveCircleCount(): 지금 어떤 원이든 드래그/핀치 중이면 0보다 큰 값 — 그동안은 패닝 무시
function makePannable(viewportEl, canvasEl, panRangePct, getActiveCircleCount) {
  const PAN_TAP_THRESHOLD_PX = 6;
  const pointers = new Map();
  let panX = 0;
  let panY = 0;
  let startClientX = 0;
  let startClientY = 0;
  let startPanX = 0;
  let startPanY = 0;
  let dragging = false;

  function handlePointerDown(event) {
    if (getActiveCircleCount() > 0) return; // 원을 만지는 중이면 배경 패닝 시작 안 함
    if (event.target.closest('.memo-circle')) return; // 원 위에서 시작한 터치는 원 쪽에서 처리
    if (pointers.size > 0) return; // 패닝은 한 손가락만 처리
    pointers.set(event.pointerId, true);
    startClientX = event.clientX;
    startClientY = event.clientY;
    startPanX = panX;
    startPanY = panY;
    dragging = false;
  }

  function handlePointerMove(event) {
    if (!pointers.has(event.pointerId)) return;
    if (getActiveCircleCount() > 0) return; // 패닝 도중 원 조작이 시작되면 더 이상 움직이지 않음

    const dx = event.clientX - startClientX;
    const dy = event.clientY - startClientY;
    if (!dragging && Math.hypot(dx, dy) < PAN_TAP_THRESHOLD_PX) return;
    dragging = true;

    const rect = viewportEl.getBoundingClientRect();
    const maxAbsPanX = (panRangePct / 100) * rect.width;
    const maxAbsPanY = (panRangePct / 100) * rect.height;
    panX = clampPan(startPanX + dx, -maxAbsPanX, maxAbsPanX);
    panY = clampPan(startPanY + dy, -maxAbsPanY, maxAbsPanY);
    canvasEl.style.transform = `translate(${panX}px, ${panY}px)`;
  }

  function handlePointerUp(event) {
    pointers.delete(event.pointerId);
  }

  viewportEl.addEventListener('pointerdown', handlePointerDown);
  document.addEventListener('pointermove', handlePointerMove);
  document.addEventListener('pointerup', handlePointerUp);
  document.addEventListener('pointercancel', handlePointerUp);
}

function clampPan(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createMemoCircle(memo, index) {
  const el = document.createElement('div');
  const diameter = getCircleDiameter(memo.size);
  const past = isPastMemo(memo.date);

  const status = getMemoStatus(memo);

  el.className = 'memo-circle';
  el.classList.toggle('memo-circle--confirmed', status === 'confirmed');
  el.classList.toggle('memo-circle--thinking', status === 'thinking');
  el.classList.toggle('memo-circle--unlikely', status === 'unlikely');
  el.classList.toggle('memo-circle--past', past);
  el.dataset.id = memo.id;

  el.style.width = `${diameter}px`;
  el.style.height = `${diameter}px`;
  el.style.left = `${memo.xPct}%`;
  el.style.top = `${memo.yPct}%`;
  el.style.fontSize = `${getTitleFontSize(memo.size)}px`;
  // 원마다 부유 리듬을 다르게 줘서 자연스럽게 흩어지도록 함
  el.style.animationDelay = `${(index % 5) * -1.3}s`;
  el.style.animationDuration = `${6 + (index % 4)}s`;

  const title = document.createElement('span');
  title.className = 'memo-circle__title';
  title.textContent = memo.title;
  el.appendChild(title);

  return el;
}

// 원을 확대해 본문 미리보기 + "+" 버튼을 보여준다
function openPreview(el, memo, onOpenDetail) {
  el.dataset.baseWidth = el.style.width;
  el.dataset.baseHeight = el.style.height;
  const previewDiameter = getCircleDiameter(memo.size) + PREVIEW_EXTRA_PX;
  el.style.width = `${previewDiameter}px`;
  el.style.height = `${previewDiameter}px`;
  el.classList.add('memo-circle--open');

  const preview = document.createElement('div');
  preview.className = 'memo-circle__preview';

  const excerpt = document.createElement('p');
  excerpt.className = 'memo-circle__excerpt';
  excerpt.textContent = memo.content;
  preview.appendChild(excerpt);

  const moreBtn = document.createElement('button');
  moreBtn.type = 'button';
  moreBtn.className = 'memo-circle__more';
  moreBtn.textContent = '+';
  // 버튼 조작이 원의 드래그 로직으로 번지지 않도록 막는다
  moreBtn.addEventListener('pointerdown', (event) => event.stopPropagation());
  moreBtn.addEventListener('click', () => onOpenDetail?.(memo.id));
  preview.appendChild(moreBtn);

  el.appendChild(preview);
}

// 미리보기를 닫고 원래 크기로 되돌린다
function closePreview(el) {
  el.style.width = el.dataset.baseWidth ?? el.style.width;
  el.style.height = el.dataset.baseHeight ?? el.style.height;
  el.classList.remove('memo-circle--open');
  el.querySelector('.memo-circle__preview')?.remove();
}
