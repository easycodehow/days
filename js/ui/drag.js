// js/ui/drag.js
// 메모 원 드래그(이동) + 두 손가락 핀치(크기 조절) — Pointer Events 기반 (마우스·터치·펜 공용)

const TAP_THRESHOLD_PX = 6;
const PX_PER_STEP = 15; // 핀치: 손가락 사이 거리가 이만큼 변해야 한 단계 변한다

// el을 container 안에서 드래그로 옮기고, 두 손가락으로 꼬집어 크기를 조절할 수 있게 만든다.
// el.style.left/top은 container 대비 %로 지정돼 있어야 한다.
// onDragEnd(xPct, yPct): 드래그로 위치가 바뀌었을 때 호출
// onTap(): 이동 거리가 임계값 미만이면(탭) 호출
// getSize(): 핀치 시작 시 현재 크기(1~5)를 읽어온다
// onResize(size): 핀치 중 실시간으로 호출 — 화면에 즉시 반영
// onResizeEnd(size): 핀치가 끝났을 때 호출 — 저장 등 마무리 처리
export function makeDraggable(el, container, { onDragEnd, onTap, getSize, onResize, onResizeEnd } = {}) {
  const pointers = new Map(); // pointerId -> {x, y}

  let startX = 0;
  let startY = 0;
  let baseLeftPct = 0;
  let baseTopPct = 0;
  let dragging = false;

  let pinchStartDist = null;
  let pinchStartSize = null;
  let currentPinchSize = null;
  let didPinch = false; // 이번 제스처에서 핀치가 있었으면 마지막 손가락을 떼도 탭으로 처리하지 않는다

  function pinchDistance() {
    const [a, b] = pointers.values();
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  el.addEventListener('pointerdown', (event) => {
    el.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      startX = event.clientX;
      startY = event.clientY;
      baseLeftPct = parseFloat(el.style.left);
      baseTopPct = parseFloat(el.style.top);
      dragging = false;
    } else if (pointers.size === 2) {
      // 이동 중이었다면 취소하고 핀치로 전환
      if (dragging) {
        el.style.transform = '';
        el.classList.remove('dragging');
        dragging = false;
      }
      pinchStartDist = pinchDistance();
      pinchStartSize = getSize?.() ?? 3;
      currentPinchSize = pinchStartSize;
      didPinch = true;
    }
  });

  el.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size >= 2 && pinchStartDist != null) {
      const dist = pinchDistance();
      const stepDelta = Math.round((dist - pinchStartDist) / PX_PER_STEP);
      currentPinchSize = clamp(pinchStartSize + stepDelta, 1, 5);
      onResize?.(currentPinchSize);
      return;
    }

    if (pointers.size !== 1) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (!dragging && Math.hypot(dx, dy) >= TAP_THRESHOLD_PX) {
      dragging = true;
      el.classList.add('dragging');
    }

    if (dragging) {
      el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }
  });

  function onPointerUp(event) {
    const wasPinching = pointers.size >= 2;
    pointers.delete(event.pointerId);

    if (wasPinching && pointers.size < 2) {
      pinchStartDist = null;
      if (currentPinchSize != null) onResizeEnd?.(currentPinchSize);
      currentPinchSize = null;
    }

    if (pointers.size > 0) return;

    if (didPinch) {
      didPinch = false;
      return;
    }

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

  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
