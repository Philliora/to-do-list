const field = document.querySelector('.todo__field');
const addBtn = document.querySelector('.todo__add-btn');
const list = document.querySelector('.todo__list');
const filterBtn = document.querySelectorAll('.todo__filter-btn');

function addTask() {
    const text = field.value.trim();
    if (text === '') {
        return;
    } else {
    
    const listItem = document.createElement('li');
    listItem.classList.add("todo__list-item");

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add("todo__list-checkbox");
    checkbox.addEventListener('change', function() {
        toggleCompleted(listItem, checkbox);
    });

    const span = document.createElement('span');
    span.classList.add("todo__list-span");
    span.textContent = text;

    const editBtn = document.createElement('button');
    editBtn.classList.add("todo__list-editBtn");
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function() {
        const isEditing = listItem.classList.contains("todo__list-item--editing")
        if(!isEditing) {
            listItem.classList.add('todo__list-item--editing');
            span.contentEditable = true;
            span.focus();
            editBtn.textContent = "Save";
        } else {
            if (span.innerText.trim() === '') {
                span.textContent = text;
            }
            listItem.classList.remove('todo__list-item--editing');
            span.contentEditable = false;
            editBtn.textContent = "Edit";
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add("todo__list-deleteBtn");
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function() {
        listItem.remove();
    });


    listItem.append(checkbox, span, editBtn, deleteBtn);
    list.append(listItem);
        
    field.value = '';
    field.focus();
    }    
}

addBtn.addEventListener('click', addTask);
field.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function toggleCompleted(listItem) {
    listItem.classList.toggle("todo__list-item--completed");
}

filterBtn.forEach(button => {
    button.addEventListener('click', function() {
        const filterType = button.dataset.filter
        filtration(filterType);
    });
});

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

console.log(filterBtn);

// console.log(field, addBtn, list);