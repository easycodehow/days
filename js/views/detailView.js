// js/views/detailView.js
// 상세보기 화면 — 전체 본문 + 수정/삭제/저장하기

// onSave(updatedMemo), onDelete(id), onClose()
export function renderDetailView(container, memo, { onSave, onDelete, onClose } = {}) {
  container.className = 'detail-view';
  container.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'detail-view__back';
  backBtn.textContent = '← 목록으로';
  backBtn.addEventListener('click', () => onClose?.());

  const titleText = document.createElement('h2');
  titleText.className = 'detail-view__title';
  titleText.textContent = memo.title;

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'detail-view__title-input is-hidden';
  titleInput.value = memo.title;

  const contentText = document.createElement('div');
  contentText.className = 'detail-view__content';
  contentText.textContent = memo.content;

  const contentInput = document.createElement('textarea');
  contentInput.className = 'detail-view__content-input is-hidden';
  contentInput.value = memo.content;

  const actions = document.createElement('div');
  actions.className = 'detail-view__actions';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn btn--amber';
  editBtn.textContent = '수정';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn--danger';
  deleteBtn.textContent = '삭제';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn btn--amber';
  saveBtn.textContent = '저장하기';

  let editing = false;

  editBtn.addEventListener('click', () => {
    editing = true;
    titleText.classList.add('is-hidden');
    contentText.classList.add('is-hidden');
    titleInput.classList.remove('is-hidden');
    contentInput.classList.remove('is-hidden');
    titleInput.focus();
  });

  saveBtn.addEventListener('click', () => {
    const updated = {
      ...memo,
      title: editing ? titleInput.value.trim() || memo.title : memo.title,
      content: editing ? contentInput.value.trim() : memo.content,
      updatedAt: new Date().toISOString(),
    };
    onSave?.(updated);
  });

  deleteBtn.addEventListener('click', () => {
    if (window.confirm('이 메모를 삭제할까요?')) {
      onDelete?.(memo.id);
    }
  });

  actions.append(editBtn, deleteBtn, saveBtn);
  container.append(backBtn, titleText, titleInput, contentText, contentInput, actions);
}
