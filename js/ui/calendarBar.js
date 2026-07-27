// js/ui/calendarBar.js
// "한줄 캘린더" 헤더 — 날짜의 흐름을 한 줄로 보여줌

import { formatDate } from '../memo.js';

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

// 오늘을 중심으로 한 줄 캘린더 헤더를 렌더링한다
// selectedDate: 현재 선택된 날짜(YYYY-MM-DD), onSelectDate(dateStr): 날짜를 탭했을 때 호출
export function renderCalendarBar(container, { centerDate = new Date(), rangeDays = 7, selectedDate, onSelectDate } = {}) {
  container.innerHTML = '';
  container.className = 'calendar-bar';

  const todayStr = formatDate(new Date());

  for (let offset = -rangeDays; offset <= rangeDays; offset++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + offset);
    const dateStr = formatDate(date);

    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'calendar-bar__item';
    item.classList.toggle('calendar-bar__item--today', dateStr === todayStr);
    item.classList.toggle('calendar-bar__item--selected', dateStr === selectedDate);
    item.dataset.date = dateStr;
    item.addEventListener('click', () => onSelectDate?.(dateStr));

    const weekday = document.createElement('span');
    weekday.className = 'calendar-bar__weekday';
    weekday.textContent = WEEKDAY_KO[date.getDay()];

    const day = document.createElement('span');
    day.className = 'calendar-bar__day';
    day.textContent = date.getDate();

    item.append(weekday, day);
    container.appendChild(item);
  }
}
