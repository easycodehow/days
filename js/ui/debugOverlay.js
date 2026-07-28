// js/ui/debugOverlay.js
// 임시 디버그용 — 실기기에서 핀치 제스처 시 실제로 어떤 포인터 이벤트가 발생하는지
// 화면에 직접 표시한다. 원인 진단이 끝나면 제거할 예정.

const MAX_LINES = 40;
let logEl = null;
const lines = [];

export function initDebugOverlay() {
  logEl = document.createElement('pre');
  logEl.id = 'debug-overlay';
  logEl.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    max-height: 42vh;
    overflow-y: auto;
    margin: 0;
    padding: 6px;
    background: rgba(0, 0, 0, 0.82);
    color: #4dff4d;
    font-family: monospace;
    font-size: 10px;
    line-height: 1.3;
    z-index: 99999;
    white-space: pre-wrap;
    word-break: break-all;
    pointer-events: none;
  `;
  document.body.appendChild(logEl);
  logDebug('디버그 오버레이 시작');
}

export function logDebug(message) {
  const time = new Date().toISOString().slice(11, 23);
  lines.push(`${time} ${message}`);
  if (lines.length > MAX_LINES) lines.shift();
  if (logEl) {
    logEl.textContent = lines.join('\n');
    logEl.scrollTop = logEl.scrollHeight;
  }
}
