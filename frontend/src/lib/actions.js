import { sleep } from './utils'

export const getAllTodoLists = async () => {
  const response = await fetch('http://localhost:3001/todo-lists')
  const data = await response.json()
  return data
}

export const getTodoListById = async (id) => {
  const response = await fetch(`http://localhost:3001/todo-lists/${id}`)
  const data = await response.json()
  return data
}

export const createTodoList = async (title) => {
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
  const response = await fetch(`http://localhost:3001/todo-lists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todos),
  })
  if (!response.ok) {
    const error = await response.json()
    console.error('Error updating todo list:', error)
  }
}
