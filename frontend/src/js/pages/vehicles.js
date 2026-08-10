document.addEventListener('DOMContentLoaded', () => {
  const btnShowForm = document.getElementById('btn-show-form');
  const btnEmptyAdd = document.getElementById('btn-empty-add');
  const btnBack = document.getElementById('btn-back');
  const btnCancel = document.getElementById('btn-cancel');
  const screenList = document.getElementById('screen-list');
  const screenForm = document.getElementById('screen-form');
  
  function showForm() {
    if (screenList) screenList.style.display = 'none';
    if (screenForm) screenForm.style.display = 'block';
  }

  function showList() {
    if (screenForm) screenForm.style.display = 'none';
    if (screenList) screenList.style.display = 'block';
  }

  if (btnShowForm) btnShowForm.addEventListener('click', showForm);
  if (btnEmptyAdd) btnEmptyAdd.addEventListener('click', showForm);
  if (btnBack) btnBack.addEventListener('click', showList);
  if (btnCancel) btnCancel.addEventListener('click', showList);
});