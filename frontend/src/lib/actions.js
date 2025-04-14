export const getAllTodoLists = async () => {
  console.log('triggered getAllTodoLists')
  const response = await fetch('http://localhost:3001/todo-lists')
  const data = await response.json()
  return data
}

export const getTodoListById = async (id) => {
  console.log('triggered getTodoListById')
  const response = await fetch(`http://localhost:3001/todo-lists/${id}`)
  const data = await response.json()
  return data
}

export const createTodoList = async (title) => {
  console.log('triggered createTodoList')
  const response = await fetch('http://localhost:3001/todo-lists', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
  if (!response.ok) {
    throw new Error('Failed to create todo list')
  }
  return response.json()
}

export const updateTodoList = async (id, todos) => {
  console.log('triggered updateTodoList')
  const response = await fetch(`http://localhost:3001/todo-lists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todos),
  })
  if (!response.ok) {
    throw new Error('Failed to update todo list')
  }
}
