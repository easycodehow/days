// js/ui/calendarBar.js
// "한줄 캘린더" 헤더 — 날짜의 흐름을 한 줄로 보여줌

import { formatDate } from '../memo.js';

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

// 오늘을 중심으로 한 줄 캘린더 헤더를 렌더링한다
// selectedDate: 현재 선택된 날짜(YYYY-MM-DD), onSelectDate(dateStr): 날짜를 탭했을 때 호출
// rangeDays=182 → 오늘 기준 앞뒤로 약 6개월씩, 총 1년치 날짜를 보여줌(가로 스크롤)
export function renderCalendarBar(container, { centerDate = new Date(), rangeDays = 182, selectedDate, onSelectDate } = {}) {
  container.innerHTML = '';
  container.className = 'calendar-bar-wrap';

  // 고정 월 헤더 — 날짜 줄을 가로로 스크롤하면 지금 화면 맨 왼쪽에 보이는 날짜의
  // 연월로 자동 갱신된다. 1년치 날짜가 이어지다 보니 이게 없으면 지금 몇 월을
  // 보고 있는지 구분하기 어렵다.
  const monthLabel = document.createElement('div');
  monthLabel.className = 'calendar-bar__month-label';
  container.appendChild(monthLabel);

  const list = document.createElement('div');
  list.className = 'calendar-bar';
  container.appendChild(list);

  const todayStr = formatDate(new Date());
  let selectedEl = null;
  let todayEl = null;

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
    list.appendChild(item);

    if (dateStr === todayStr) todayEl = item;
    if (dateStr === selectedDate) selectedEl = item;
  }

  // 날짜가 1년치라 매번 맨 앞(1년 전)부터 스크롤해야 하면 불편하므로,
  // 선택된 날짜(없으면 오늘)가 바로 보이도록 자동으로 스크롤한다.
  (selectedEl ?? todayEl)?.scrollIntoView({ inline: 'center', block: 'nearest' });

  // 지금 목록 맨 왼쪽(스크롤 시작 지점)에 보이는 날짜를 찾아 그 연월을 월 헤더에 표시한다
  function updateMonthLabel() {
    const listLeft = list.getBoundingClientRect().left;
    const items = list.querySelectorAll('.calendar-bar__item');
    let leadingItem = items[0];
    for (const item of items) {
      if (item.getBoundingClientRect().right > listLeft) {
        leadingItem = item;
        break;
      }
    }
    if (!leadingItem) return;
    const [y, m] = leadingItem.dataset.date.split('-');
    monthLabel.textContent = `${y}년 ${Number(m)}월`;
  }

  let scrollRafId = null;
  list.addEventListener('scroll', () => {
    if (scrollRafId != null) return;
    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = null;
      updateMonthLabel();
    });
  });

  updateMonthLabel();
}
