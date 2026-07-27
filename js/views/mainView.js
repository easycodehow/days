// js/views/mainView.js
// 메인화면 — 떠다니는 메모 원(뭉게구름) 렌더링

import { getCircleDiameter, getTitleFontSize, isPastMemo } from '../memo.js';
import { makeDraggable } from '../ui/drag.js';

// 메모 배열을 컨테이너에 떠다니는 원으로 렌더링한다
// onMemoMove(id, xPct, yPct)는 드래그로 위치가 바뀌었을 때 호출된다
export function renderMainView(container, memos, { onMemoMove } = {}) {
  container.innerHTML = '';
  container.classList.add('main-view');

  memos.forEach((memo, index) => {
    const el = createMemoCircle(memo, index);
    container.appendChild(el);

    makeDraggable(el, container, {
      onDragEnd: (xPct, yPct) => onMemoMove?.(memo.id, xPct, yPct),
    });
  });
}

function createMemoCircle(memo, index) {
  const el = document.createElement('div');
  const diameter = getCircleDiameter(memo.size);
  const past = isPastMemo(memo.date);

  el.className = 'memo-circle';
  el.classList.toggle('memo-circle--realized', memo.realized);
  el.classList.toggle('memo-circle--planned', !memo.realized);
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
