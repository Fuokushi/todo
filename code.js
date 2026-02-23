const API_URL = 'http://localhost:3000/todos';

function checkinput() {
  const input = document.getElementById('newTodo');
  const button = document.getElementById('submitButton');
  const text = input.value.trim();

  button.classList.toggle('input-empty', text === '');

  if (text !== '') {
    setInfoMessage('');
  }
}

function setInfoMessage(message) {
  const infoText = document.getElementById('infoText');
  infoText.textContent = message;
}

function showPopupMessage(message) {
  window.alert(message);
}

function getValidatedInputText() {
  const input = document.getElementById('newTodo');
  const text = input.value.trim();

  if (text === '') {
    showPopupMessage('Tehtävä ei voi olla tyhjä!');
    checkinput();
    return null;
  }

  return text;
}

function init() {
  const input = document.getElementById('newTodo');
  input.setAttribute('oninput', 'checkinput()');
  checkinput();
  setInfoMessage('Ladataan tehtävälista palvelimelta, odota...');
  loadTodos();
}

async function loadTodos() {
  const response = await fetch(API_URL);
  const todos = await response.json();
  showTodos(todos);
}

function createTodoListItem(todo) {
  const li = document.createElement('li');
  li.id = todo._id;

  const textNode = document.createElement('span');
  textNode.className = 'text';
  textNode.textContent = todo.text;
  li.appendChild(textNode);

  const edit = document.createElement('span');
  edit.className = 'edit';
  edit.appendChild(document.createTextNode(' Muokkaa '));
  edit.onclick = function () { editTodo(todo._id, todo.text); };
  li.appendChild(edit);

  const del = document.createElement('span');
  del.className = 'delete';
  del.appendChild(document.createTextNode(' x '));
  del.onclick = function () { removeTodo(todo._id); };
  li.appendChild(del);

  return li;
}

function showTodos(todos) {
  const todosList = document.getElementById('todosList');
  todosList.replaceChildren();

  if (todos.length === 0) {
    setInfoMessage('Ei tehtäviä');
    return;
  }

  todos.forEach((todo) => {
    todosList.appendChild(createTodoListItem(todo));
  });
  setInfoMessage('');
}

async function addTodo() {
  const text = getValidatedInputText();
  if (text === null) {
    return;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  const responseJson = await response.json();
  if (!response.ok) {
    showPopupMessage(responseJson.error || 'Tehtävän lisäys epäonnistui.');
    return;
  }

  document.getElementById('todosList').appendChild(createTodoListItem(responseJson));

  const newTodo = document.getElementById('newTodo');
  newTodo.value = '';
  setInfoMessage('');
  checkinput();
}

async function removeTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    showPopupMessage('Tehtävän poisto epäonnistui.');
    return;
  }

  const li = document.getElementById(id);
  if (li && li.parentNode) {
    li.parentNode.removeChild(li);
  }

  const todosList = document.getElementById('todosList');
  if (!todosList.hasChildNodes()) {
    setInfoMessage('Ei tehtäviä');
  }
}

function changeButton(id) {
  const button = document.getElementById('submitButton');
  const mode = button.dataset.mode || 'add';

  if (mode === 'add') {
    button.dataset.mode = 'edit';
    button.textContent = 'Tallenna';
    button.className = 'editbutton';
    button.setAttribute('onclick', `updateTodo("${id}")`);
  } else if (id) {
    button.setAttribute('onclick', `updateTodo("${id}")`);
  } else {
    button.dataset.mode = 'add';
    button.textContent = 'Lisää';
    button.className = 'addButton';
    button.setAttribute('onclick', 'addTodo()');
  }

  checkinput();
}

function editTodo(id, text) {
  const newTodo = document.getElementById('newTodo');
  newTodo.value = text;
  changeButton(id);
  setInfoMessage('');
  checkinput();
  newTodo.focus();
}

async function updateTodo(id) {
  const text = getValidatedInputText();
  if (text === null) {
    return;
  }

  if (window.confirm('Haluatko varmasti päivittää tehtävän?') === false) {
    return;
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  const responseJson = await response.json();
  if (!response.ok) {
    showPopupMessage(responseJson.error || 'Tehtävän päivitys epäonnistui.');
    return;
  }

  await loadTodos();

  const newTodo = document.getElementById('newTodo');
  newTodo.value = '';
  setInfoMessage('');
  changeButton();
}
