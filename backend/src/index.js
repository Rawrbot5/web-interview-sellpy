import express from 'express'
import cors from 'cors'

//add validation

const app = express()

app.use(cors())
app.use(express.json())

const todoLists = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'First list',
    todos: ['Do the thing', 'Do the other thing', 'Do the third thing'],
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Second list',
    todos: ['Get stuff done', 'Get more stuff done', 'Even more stuff to do'],
  },
]

app.get('/todo-lists', (req, res) => {
  res.json(todoLists)
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
  const newTodoList = {
    id: crypto.randomUUID(),
    title: req.body.title,
    todos: [],
  }
  todoLists.push(newTodoList)
  res.status(201).json(newTodoList)
})

app.put('/todo-lists/:id', (req, res) => {
  const { id } = req.params
  const { title, todos } = req.body
  const listToUpdate = todoLists.find((list) => list.id === id)
  listToUpdate.title = title
  listToUpdate.todos = todos
  res.json(listToUpdate)
})

const PORT = 3001

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
