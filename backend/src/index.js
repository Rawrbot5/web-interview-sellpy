import express from 'express'
import cors from 'cors'
import { todoListSchema, todoArraySchema } from './dataSchemas.js'

const app = express()

app.use(cors())
app.use(express.json())

const generateTodoListMockupItem = (textParam) => {
  return {
    text: textParam,
    completed: false,
    dueDate: '2025-12-24',
  }
}

const todoLists = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'First list',
    todos: [
      generateTodoListMockupItem('Do the thing'),
      generateTodoListMockupItem('Do the other thing'),
      generateTodoListMockupItem('Do the third thing'),
    ],
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Second list',
    todos: [
      generateTodoListMockupItem('Get stuff done'),
      generateTodoListMockupItem('Get more stuff done'),
      generateTodoListMockupItem('Even more stuff to do'),
    ],
  },
]

app.get('/todo-lists', (req, res) => {
  const todoListIdandTitles = todoLists.map((list) => ({
    id: list.id,
    title: list.title,
    completed: list.todos.length > 0 && list.todos.every((todo) => todo.completed),
  }))
  res.json(todoListIdandTitles)
})

app.get('/todo-lists/:id', (req, res) => {
  const { id } = req.params
  const todoList = todoLists.find((list) => list.id === id)
  if (!todoList) {
    return res.status(404).json({ error: 'Todo list not found' })
  }
  res.json(todoList)
})

app.post('/todo-lists', (req, res) => {
  const { title } = todoListSchema.parse(req.body)
  const newTodoList = {
    id: crypto.randomUUID(),
    title,
    todos: [],
  }
  todoLists.push(newTodoList)
  res.status(201).json(newTodoList)
})

app.put('/todo-lists/:id', async (req, res) => {
  const { id } = req.params
  const todos = req.body
  const validatedTodos = todoArraySchema.safeParse(todos)
  const listIndexToUpdate = todoLists.findIndex((list) => list.id === id)
  if (listIndexToUpdate === -1) {
    return res.status(404).json({ error: 'Todo list not found' })
  }
  if (!validatedTodos.success) {
    return res.status(400).json({ error: 'Invalid todo items' })
  }
  todoLists[listIndexToUpdate].todos = validatedTodos.data
  res.status(204).send()
})

const PORT = 3001

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
