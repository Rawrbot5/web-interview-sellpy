import express from 'express'
import cors from 'cors'
import { z } from 'zod'
import { todoListSchema, todoItemSchema } from './dataSchemas.js'

const app = express()

app.use(cors())
app.use(express.json())

const generateTodoListMockupItem = (textParam, dueDateAdditionalDays = 0) => {
  return {
    text: textParam,
    completed: false,
    dueDate: new Date().setDate(new Date().getDate() + dueDateAdditionalDays),
  }
}

const todoLists = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'First list',
    todos: [
      generateTodoListMockupItem('Do the thing', 7),
      generateTodoListMockupItem('Do the other thing', 8),
      generateTodoListMockupItem('Do the third thing', 9),
    ],
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Second list',
    todos: [
      generateTodoListMockupItem('Get stuff done', 10),
      generateTodoListMockupItem('Get more stuff done', 11),
      generateTodoListMockupItem('Even more stuff to do', 12),
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

app.put('/todo-lists/:id', (req, res) => {
  const { id } = req.params
  const todos = req.body
  const listIndexToUpdate = todoLists.findIndex((list) => list.id === id)
  todoLists[listIndexToUpdate].todos = todos
  console.log('updating: ', todoLists[listIndexToUpdate])
  res.status(204).send()
})

const PORT = 3001

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
