// DOM ELEMENTS
const todoForm = document.querySelector('#todo-form')
const todoList = document.querySelector('.todos')
const totalTasks = document.querySelector('#total-tasks')
const remainingTasks = document.querySelector('#remaining-tasks')
const completedTasks = document.querySelector('#completed-tasks')
const mainInput = document.querySelector('#todo-form input')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

if (localStorage.getItem('tasks')){
    tasks.map((task) => {
        createTask(task)
    });
}

// INPUT BOX
todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputValue = mainInput.value

    if (inputValue == ''){
        return
    }

    const task = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false
    }

    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    createTask(task)

    todoForm.reset()
    mainInput.focus()
});

// RENAME ENTER KEY
todoList.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        e.preventDefault()

        e.target.blur()
    }
});

// TASK DELETE BUTTON
todoList.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-task');
    if (removeBtn) {
        const taskId = removeBtn.closest('li').id;
        removeTask(taskId);
    }
});

// TASK RENAME  
todoList.addEventListener('input', (e) => {
    const taskId = e.target.closest('li').id

    updateTask(taskId, e.target)
});

// CREATE TASK
function createTask(task){
    const taskEl = document.createElement('li')

    taskEl.setAttribute('id', task.id)

    if (task.isCompleted){
        taskEl.classList.add('complete')
    }

    const taskElMarkUp = `
        <div>
            <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked': ''}>
            <span ${!task.isCompleted ? 'contenteditable' : ''} placeholder="Add a task..." >${task.name}</span>
        </div>

        <button title="Remove the "${task.name}" task" class="remove-task">
            <svg width="181" height="181" viewBox="0 0 181 181" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="159.407" width="30" height="225" rx="15" transform="rotate(45.1112 159.407 0)"/>
            <rect x="180.044" y="159.408" width="30" height="225" rx="15" transform="rotate(135.111 180.044 159.408)"/>
            </svg>
        </button>
    `

    taskEl.innerHTML = taskElMarkUp

    todoList.appendChild(taskEl)

    countTasks()
}

// TASK COUNTER
function countTasks() {
    const completedTasksArray = tasks.filter((task) => task.isCompleted === true)

    totalTasks.textContent = tasks.length
    completedTasks.textContent = completedTasksArray.length
    remainingTasks.textContent = tasks.length - completedTasksArray.length
}

// REMOVE TASK
function removeTask(taskId){
    tasks = tasks.filter((task) => task.id !== parseInt(taskId))

    localStorage.setItem('tasks', JSON.stringify(tasks))

    document.getElementById(taskId).remove()

    countTasks()
}

// UPDATE TASK
function updateTask(taskId, el){
    const task = tasks.find((task) => task.id === parseInt(taskId))

    if(el.hasAttribute('contenteditable')){
        task.name = el.textContent
    } else {
        const span = el.nextElementSibling
        const parent = el.closest('li')

        task.isCompleted = !task.isCompleted

        if(task.isCompleted){
            span.removeAttribute('contenteditable')
            parent.classList.add('complete')
        } else{
            span.setAttribute('contenteditable', 'true')
            parent.classList.remove('complete')
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks))

    countTasks()
}