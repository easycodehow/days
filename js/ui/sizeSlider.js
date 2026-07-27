// js/ui/sizeSlider.js
// 중요도(크기) 조절 — 원을 두 손가락으로 꼬집으면(핀치) 손가락 사이 거리 변화에 따라 1~5단계로 스냅된다.
// 한 손가락 드래그는 스크롤 가능한 상세보기 안에서 브라우저의 스크롤 제스처와
// 충돌할 수 있어, 충돌 여지가 적은 두 손가락 제스처로 구현한다.

import { getCircleDiameter } from '../memo.js';

const MIN_SIZE = 1;
const MAX_SIZE = 5;
const PX_PER_STEP = 15; // 손가락 사이 거리가 이만큼 변해야 한 단계 변한다

// initialSize(1~5)로 시작하는 크기 조절 원을 만든다.
// onChange(size)는 크기가 바뀔 때마다 호출된다.
// 반환된 { element, getSize } 중 element를 DOM에 붙이고, getSize()로 현재 값을 읽는다.
export function createSizePicker(initialSize, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'size-picker';

  const circle = document.createElement('div');
  circle.className = 'size-picker__circle';
  circle.textContent = '두 손가락으로 꼬집어 조절';
  wrapper.appendChild(circle);

  let size = initialSize;
  const pointers = new Map(); // pointerId -> {x, y}
  let startPinchDist = null;
  let startSize = size;

  function applySize(nextSize) {
    size = Math.min(MAX_SIZE, Math.max(MIN_SIZE, nextSize));
    const diameter = getCircleDiameter(size);
    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    onChange?.(size);
  }

  applySize(initialSize);

  function pinchDistance() {
    const [a, b] = pointers.values();
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  circle.addEventListener('pointerdown', (event) => {
    circle.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2) {
      startPinchDist = pinchDistance();
      startSize = size;
      circle.classList.add('dragging');
    }
  });

  circle.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2 && startPinchDist != null) {
      const dist = pinchDistance();
      const stepDelta = Math.round((dist - startPinchDist) / PX_PER_STEP);
      applySize(startSize + stepDelta);
    }
  });

  function releasePointer(event) {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) {
      startPinchDist = null;
      circle.classList.remove('dragging');
    }
  }

  circle.addEventListener('pointerup', releasePointer);
  circle.addEventListener('pointercancel', releasePointer);

  return {
    element: wrapper,
    getSize: () => size,
  };
}
