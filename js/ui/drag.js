// js/ui/drag.js
// 메모 원 드래그 — Pointer Events 기반 (마우스·터치·펜 공용)

const TAP_THRESHOLD_PX = 6;

// el을 container 안에서 드래그로 옮길 수 있게 만든다.
// el.style.left/top은 container 대비 %로 지정돼 있어야 한다.
// onDragEnd(xPct, yPct): 드래그로 위치가 바뀌었을 때 호출
// onTap(): 이동 거리가 임계값 미만이면(탭) 호출
export function makeDraggable(el, container, { onDragEnd, onTap } = {}) {
  let startX = 0;
  let startY = 0;
  let baseLeftPct = 0;
  let baseTopPct = 0;
  let dragging = false;

  el.addEventListener('pointerdown', (event) => {
    el.setPointerCapture(event.pointerId);

    startX = event.clientX;
    startY = event.clientY;
    baseLeftPct = parseFloat(el.style.left);
    baseTopPct = parseFloat(el.style.top);
    dragging = false;

    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp, { once: true });
    el.addEventListener('pointercancel', onPointerUp, { once: true });
  });

  function onPointerMove(event) {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (!dragging && Math.hypot(dx, dy) >= TAP_THRESHOLD_PX) {
      dragging = true;
      el.classList.add('dragging');
    }

    if (dragging) {
      el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }
  }

  function onPointerUp(event) {
    el.removeEventListener('pointermove', onPointerMove);

    if (!dragging) {
      onTap?.();
      return;
    }

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const rect = container.getBoundingClientRect();

    const xPct = clamp(baseLeftPct + (dx / rect.width) * 100, 0, 100);
    const yPct = clamp(baseTopPct + (dy / rect.height) * 100, 0, 100);

    el.style.left = `${xPct}%`;
    el.style.top = `${yPct}%`;
    el.style.transform = '';
    el.classList.remove('dragging');

    onDragEnd?.(xPct, yPct);
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
