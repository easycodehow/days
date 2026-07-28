// js/views/detailView.js
// 상세보기 화면 — 전체 본문 + 수정/삭제/저장하기

import { isPastMemo, formatDateKo, getMemoStatus, MEMO_STATUS_OPTIONS } from '../memo.js';

// onSave(updatedMemo), onDelete(id)는 기존 메모에만 전달 — 없으면 삭제 버튼을 안 보여준다.
// onClose(), startEditing: true면 처음부터 편집 상태로 연다(새 메모 작성용)
export function renderDetailView(container, memo, { onSave, onDelete, onClose, startEditing = false } = {}) {
  container.className = 'detail-view';
  container.innerHTML = '';

  // 기존 메모(onDelete가 있음)이면서 지난 날짜면 수정 불가 — 삭제만 가능
  const isReadOnly = !!onDelete && isPastMemo(memo.date);

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'detail-view__back';
  backBtn.textContent = '← 목록으로';
  backBtn.addEventListener('click', () => onClose?.());

  const dateLabel = document.createElement('p');
  dateLabel.className = 'detail-view__date';
  dateLabel.textContent = formatDateKo(memo.date);

  const titleText = document.createElement('h2');
  titleText.className = 'detail-view__title';
  titleText.textContent = memo.title;

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'detail-view__title-input is-hidden';
  titleInput.placeholder = '제목';
  titleInput.value = memo.title;

  const contentText = document.createElement('div');
  contentText.className = 'detail-view__content';
  contentText.textContent = memo.content;

  const contentInput = document.createElement('textarea');
  contentInput.className = 'detail-view__content-input is-hidden';
  contentInput.placeholder = '내용을 입력하세요';
  contentInput.value = memo.content;

  // 확정 상태(3단계) 선택 — 범례를 그대로 선택 버튼으로 사용
  let selectedStatus = getMemoStatus(memo);

  const statusPicker = document.createElement('div');
  statusPicker.className = 'status-picker is-hidden';

  const statusButtons = MEMO_STATUS_OPTIONS.map(({ value, label }) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'status-picker__option';
    option.classList.toggle('status-picker__option--selected', value === selectedStatus);

    const circle = document.createElement('span');
    circle.className = `status-picker__circle status-picker__circle--${value}`;

    const labelEl = document.createElement('span');
    labelEl.className = 'status-picker__label';
    labelEl.textContent = label;

    option.append(circle, labelEl);
    option.addEventListener('click', () => {
      selectedStatus = value;
      statusButtons.forEach((btn) => {
        btn.classList.toggle('status-picker__option--selected', btn.dataset.value === value);
      });
    });
    option.dataset.value = value;

    statusPicker.appendChild(option);
    return option;
  });

  const actions = document.createElement('div');
  actions.className = 'detail-view__actions';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn btn--blue';
  editBtn.textContent = '수정';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn--danger';
  deleteBtn.textContent = '삭제';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn btn--candy';
  saveBtn.textContent = '저장하기';

  let editing = false;

  function enterEditMode() {
    editing = true;
    titleText.classList.add('is-hidden');
    contentText.classList.add('is-hidden');
    titleInput.classList.remove('is-hidden');
    contentInput.classList.remove('is-hidden');
    statusPicker.classList.remove('is-hidden');
    editBtn.classList.add('is-hidden');
  }

  editBtn.addEventListener('click', enterEditMode);

  saveBtn.addEventListener('click', () => {
    const updated = {
      ...memo,
      title: editing ? titleInput.value.trim() || memo.title : memo.title,
      content: editing ? contentInput.value.trim() : memo.content,
      status: editing ? selectedStatus : getMemoStatus(memo),
      updatedAt: new Date().toISOString(),
    };
    onSave?.(updated);
  });

  deleteBtn.addEventListener('click', () => {
    if (window.confirm('이 메모를 삭제할까요?')) {
      onDelete?.(memo.id);
    }
  });

  // 새 메모 작성 상태 — 처음부터 편집 모드, 아직 저장 전이라 삭제할 대상이 없음
  if (startEditing) enterEditMode();

  // 지난 날짜의 기존 메모는 수정/저장하기 버튼 자체를 렌더링하지 않는다 (삭제만 가능)
  if (isReadOnly) {
    actions.append(deleteBtn);
  } else {
    actions.append(editBtn, saveBtn);
    if (onDelete) actions.insertBefore(deleteBtn, saveBtn);
  }

  container.append(backBtn, dateLabel, titleText, titleInput, contentText, contentInput, statusPicker, actions);

  if (startEditing) titleInput.focus();
}
