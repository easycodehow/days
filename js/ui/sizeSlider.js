// js/ui/sizeSlider.js
// 중요도(크기) 조절 — 원을 위/아래로 드래그하면 이동 거리에 따라 1~5단계로 스냅된다

import { getCircleDiameter } from '../memo.js';

const MIN_SIZE = 1;
const MAX_SIZE = 5;
const PX_PER_STEP = 15; // 이만큼 드래그해야 한 단계 변한다

// initialSize(1~5)로 시작하는 크기 조절 원을 만든다.
// onChange(size)는 크기가 바뀔 때마다 호출된다.
// 반환된 { element, getSize } 중 element를 DOM에 붙이고, getSize()로 현재 값을 읽는다.
export function createSizePicker(initialSize, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'size-picker';

  const circle = document.createElement('div');
  circle.className = 'size-picker__circle';
  circle.textContent = '드래그';
  wrapper.appendChild(circle);

  let size = initialSize;

  function applySize(nextSize) {
    size = Math.min(MAX_SIZE, Math.max(MIN_SIZE, nextSize));
    const diameter = getCircleDiameter(size);
    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    onChange?.(size);
  }

  applySize(initialSize);

  circle.addEventListener('pointerdown', (event) => {
    circle.setPointerCapture(event.pointerId);
    circle.classList.add('dragging');

    const startY = event.clientY;
    const startSize = size;

    function onMove(moveEvent) {
      const dy = startY - moveEvent.clientY; // 위로 끌면 커짐, 아래로 끌면 작아짐
      const stepDelta = Math.round(dy / PX_PER_STEP);
      applySize(startSize + stepDelta);
    }

    function onUp() {
      circle.classList.remove('dragging');
      circle.removeEventListener('pointermove', onMove);
      circle.removeEventListener('pointerup', onUp);
      circle.removeEventListener('pointercancel', onUp);
    }

    circle.addEventListener('pointermove', onMove);
    circle.addEventListener('pointerup', onUp, { once: true });
    circle.addEventListener('pointercancel', onUp, { once: true });
  });

  return {
    element: wrapper,
    getSize: () => size,
  };
}
