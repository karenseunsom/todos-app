function renderTodos(todosArray) {
    const todosHtmlArray = todosArray.map(todo => {
        return `<li class="${todo.completed ? 'completed' : 'incomplete'} list-group-item fs-5 bg-transparent">
            <input class="edit-field" id="edit-${todo.id}" type="text" value="${todo.text}">
            <button class="update-button" data-id="${todo.id}">💾</button>
            <button class="complete-button" data-id="${todo.id}" 
            data-completed="${ todo.completed ? 'completed' : 'incomplete'}">✅</button>
            <button class="delete-button" data-id="${todo.id}">🚮</button>
        </li>`
    })

    return todosHtmlArray.join('')
}

function fetchTodos() {
    fetch('/api/v1/todos')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            todos.innerHTML = renderTodos(data)
        })
}

const todos = document.getElementById('todos')
const todoForm = document.getElementById('todoForm')

fetchTodos()

todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = document.getElementById('todo_text')
    fetch('/api/v1/todos', {
        method: 'POST',
        // headers to tell what type of request we are sending
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: input.value
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error)
            }
            fetchTodos()
            // reset so we can type something else into form if we want to
            todoForm.reset()
        })
})

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')){
        // delete behavior
        const id = e.target.dataset.id;
        fetch(`/api/v1/todos/${id}`, {
            method: 'DELETE'
        })
            // if response not okay, return empty json
            .then(res => !res.ok && res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error)
                }
                fetchTodos()
            })
    }
    if (e.target.classList.contains('complete-button')){
        // delete behavior
        const id = e.target.dataset.id;
        const completed = e.target.dataset.completed;
        fetch(`/api/v1/todos/${id}`, {
            method: 'PATCH',
            headers: {
                // sending across data so need to tell what kind of data
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completed: completed === 'completed' ? false : true
            })
        })
            .then(res => res.json())
            .then(data => {
                // how would this below if statement be triggered?
                if (data.error) {
                    alert(data.error)
                }
                fetchTodos()
            })
    }
    if (e.target.classList.contains('update-button')) {
        // get the text from the edit field
        const id = e.target.dataset.id;
        // get input
        const editField = document.getElementById(`edit-${id}`)
        // get the id
        const newValue = editField.value
        // send a PATCH request to /api/v1/todos/{id}
        fetch(`/api/v1/todos/${id}`, {
            method: 'PATCH',
            headers: {
                // sending across data so need to tell what kind of data
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: newValue
            })
        })
            .then(res => res.json())
            .then(data => {
                // how would this below if statement be triggered?
                if (data.error) {
                    alert(data.error)
                }
                fetchTodos()
            })
    }
})