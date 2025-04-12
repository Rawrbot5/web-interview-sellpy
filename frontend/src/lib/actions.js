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
}
