const field = document.querySelector('.todo__field');
const addBtn = document.querySelector('.todo__add-btn');
const list = document.querySelector('.todo__list');
const filterBtn = document.querySelectorAll('.todo__filter-btn');
let currentFilter = 'all';


function createTaskElement(text, completed = false) {
    const listItem = document.createElement('li');
    listItem.classList.add('todo__list-item');

    if (completed) {
        listItem.classList.add('todo__list-item--completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('todo__list-checkbox');
    checkbox.checked = completed;

    const span = document.createElement('span');
    span.classList.add('todo__list-span');
    span.textContent = text;

    const editBtn = document.createElement('button');
    editBtn.classList.add('todo__list-editBtn');
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('todo__list-deleteBtn');
    deleteBtn.textContent = 'Delete';

    listItem.append(checkbox, span, editBtn, deleteBtn);
    list.append(listItem);
}

function addTask() {
    const text = field.value.trim();
    if (text === '') return;

    createTaskElement(text);
    toggleEmptyState();
    countTasks();
    filtration(currentFilter);
    saveTasksToLS();

    field.value = '';
    field.focus();
}

function saveTasksToLS() {
    const tasks = JSON.stringify(getTasks());
    localStorage.setItem("todo-tasks", tasks)
}

function loadTasksFromLS() {
    const savedTasks = localStorage.getItem("todo-tasks");
    if (!savedTasks) return;

    const tasks = JSON.parse(savedTasks);

    for (const task of tasks) {
        createTaskElement(task.text, task.completed);
    }
    countTasks();
}

function getTasks() {
    const allListItems = document.querySelectorAll('.todo__list-item');
    const tasks = [];

    for (const item of allListItems) {
        const text = item.querySelector('.todo__list-span').innerText.trim();
        const completed = item.classList.contains('todo__list-item--completed');

        tasks.push({
            text,
            completed
        });
    }

    return tasks;
}



function toggleEmptyState() {
    const hasTasks = document.querySelectorAll('.todo__list-item').length > 0;
    const emptyState = document.querySelector('.todo__empty');

    if (!emptyState) return;

    emptyState.classList.toggle('hidden', hasTasks);
}

function toggleCompleted(listItem) {
    listItem.classList.toggle('todo__list-item--completed');
}

function setCaretToEnd(element) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);

  selection.removeAllRanges();
  selection.addRange(range);
}

function countTasks() {
    const counter = document.querySelector('.todo__counter-text');
    const allListItems = document.querySelectorAll('.todo__list-item');
    const completedListItems = document.querySelectorAll('.todo__list-item--completed');
    
    let completedTask = completedListItems.length;;
    let allTask = allListItems.length;
    counter.textContent = `${completedTask} / ${allTask}`;
    console.log(allListItems);
}
countTasks();



addBtn.addEventListener('click', addTask);
field.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

list.addEventListener('click', function(event) {
    const listItem = event.target.closest('.todo__list-item');
    if (!listItem) return; //якщо клікнути поза айтемом, можу отримати далі помилку

    const deleteBtn = event.target.closest('.todo__list-deleteBtn');
    const editBtn = event.target.closest('.todo__list-editBtn');
    const span = listItem.querySelector('.todo__list-span');

    if (deleteBtn) {
        listItem.remove();
        countTasks();
        saveTasksToLS();
        return;
    }

    if (editBtn) {
        const isEditing = listItem.classList.contains('todo__list-item--editing');

        if (!isEditing) {
            span.dataset.prevText = span.innerText;
            listItem.classList.add('todo__list-item--editing');
            span.contentEditable = true;
            span.focus();
            setCaretToEnd(span);
            editBtn.textContent = 'Save';
        } else {
            if (span.innerText.trim() === '') {
                span.innerText = span.dataset.prevText;
            }
            listItem.classList.remove('todo__list-item--editing');
            toggleEmptyState();
            countTasks();
            span.contentEditable = false;
            editBtn.textContent = 'Edit';
            saveTasksToLS();
        }
    }
});

list.addEventListener('keydown', function (event) {
    const span = event.target.closest('.todo__list-span');
    if (!span) return;

    const listItem = span.closest('.todo__list-item');
    const editBtn = listItem.querySelector('.todo__list-editBtn');
    const isEditing = listItem.classList.contains('todo__list-item--editing');

    if (!isEditing) return;
    
    if (event.key === 'Enter') {
        event.preventDefault(); // щоб не створювався новий рядок

        if (span.innerText.trim() === '') {
            span.innerText = span.dataset.prevText;
        }
        span.contentEditable = false;
        listItem.classList.remove('todo__list-item--editing');
        toggleEmptyState();
        editBtn.textContent = 'Edit';
        saveTasksToLS();
    }
    
    if (event.key === 'Escape') {
        span.innerText = span.dataset.prevText;
        span.contentEditable = false;
        listItem.classList.remove('todo__list-item--editing');
        
        editBtn.textContent = 'Edit';
    }
});

list.addEventListener('change', function(event) {
    const checkbox = event.target.closest('.todo__list-checkbox');
    if (!checkbox) return;

    const listItem = checkbox.closest('.todo__list-item');
    toggleCompleted(listItem);
    countTasks();
    filtration(currentFilter);
    saveTasksToLS();
});



filterBtn.forEach(button => {
    button.addEventListener('click', function() {
        const filterType = button.dataset.filter;
        currentFilter = filterType;
        setActiveFilterButton(button);
        filtration(filterType);
    });
});

function setActiveFilterButton(activeBtn) {
    filterBtn.forEach(button => {
        button.classList.remove('todo__filter-btn--active');
    });

    activeBtn.classList.add('todo__filter-btn--active');
}

function filtration(filterType) {
    const allListItems = document.querySelectorAll('.todo__list-item');

    for (const listItem of allListItems) {
        const isCompleted = listItem.classList.contains("todo__list-item--completed");

        if (filterType === 'all') {
            listItem.style.display = '';
        } else if (filterType === 'active') {
            if (!isCompleted) {
                listItem.style.display = '';
            } else {
                listItem.style.display = 'none';
            }
        } else if (filterType === 'completed') {
            if (isCompleted) {
                listItem.style.display = '';
            } else {
                listItem.style.display = 'none';
            }
        } 
    } 
}


loadTasksFromLS();
toggleEmptyState();


const defaultFilterBtn = document.querySelector('.todo__filter-btn[data-filter="all"]');

if (defaultFilterBtn) {
    setActiveFilterButton(defaultFilterBtn);
    filtration('all');
}

// console.log(filterBtn);

// console.log(field, addBtn, list);