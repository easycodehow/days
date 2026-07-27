// js/views/mainView.js
// 메인화면 — 떠다니는 메모 원(뭉게구름) 렌더링

import { getCircleDiameter, getTitleFontSize, isPastMemo } from '../memo.js';
import { makeDraggable } from '../ui/drag.js';

const PREVIEW_DIAMETER = 180;

// 메모 배열을 컨테이너에 떠다니는 원으로 렌더링한다
// onMemoMove(id, xPct, yPct): 드래그로 위치가 바뀌었을 때 호출
// onOpenDetail(id): 미리보기의 "+" 버튼을 눌렀을 때 호출
export function renderMainView(container, memos, { onMemoMove, onOpenDetail } = {}) {
  container.className = 'app-main main-view';
  container.innerHTML = '';

  let openId = null;

  memos.forEach((memo, index) => {
    const el = createMemoCircle(memo, index);
    container.appendChild(el);

    makeDraggable(el, container, {
      onDragEnd: (xPct, yPct) => onMemoMove?.(memo.id, xPct, yPct),
      onTap: () => {
        if (openId === memo.id) {
          closePreview(el);
          openId = null;
          return;
        }
        if (openId) {
          const openEl = container.querySelector(`[data-id="${openId}"]`);
          if (openEl) closePreview(openEl);
        }
        openPreview(el, memo, onOpenDetail);
        openId = memo.id;
      },
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

// 원을 확대해 본문 미리보기 + "+" 버튼을 보여준다
function openPreview(el, memo, onOpenDetail) {
  el.dataset.baseWidth = el.style.width;
  el.dataset.baseHeight = el.style.height;
  el.style.width = `${PREVIEW_DIAMETER}px`;
  el.style.height = `${PREVIEW_DIAMETER}px`;
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
