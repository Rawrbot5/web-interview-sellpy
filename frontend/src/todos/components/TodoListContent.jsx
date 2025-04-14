import React, { useState, useEffect } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Checkbox,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { updateTodoList, getTodoListById } from '../../lib/actions'

export const TodoListContent = ({ activeList, setListCompletion }) => {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const activeListId = activeList?.id

  useEffect(() => {
    if (!activeListId) return

    setIsLoading(true)
    getTodoListById(activeListId).then((todosList) => {
      setTodos(todosList.todos)
      setIsLoading(false)
    })
  }, [activeListId])

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('todos in handleSubmit: ', todos)
    updateTodoList(activeListId, todos).then(() => {
      setListCompletion(activeList, isListCompleted(todos))
    })
  }

  const isListCompleted = (todos) => {
    return todos.every((todo) => todo.completed)
  }

  if (isLoading) {
    return (
      <Card sx={{ margin: '0 1rem' }}>
        <CardContent>
          <Typography>Loading todos...</Typography>
        </CardContent>
      </Card>
    )
  }

  console.log('todos in TodoListContent: ', todos)

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{activeList?.title}</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos &&
            todos.map((todo, index) => {
              return (
                <div
                  key={index}
                  style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}
                >
                  <Checkbox
                    sx={{ margin: '8px' }}
                    checked={todo.completed}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    color='success'
                    onChange={(event) => {
                      setTodos([
                        ...todos.slice(0, index),
                        { ...todo, completed: event.target.checked },
                        ...todos.slice(index + 1),
                      ])
                    }}
                  />
                  <TextField
                    sx={{ flexGrow: 1 }}
                    label='What to do?'
                    value={todo.text}
                    onChange={(event) => {
                      setTodos([
                        // immutable update
                        ...todos.slice(0, index),
                        { ...todo, text: event.target.value },
                        ...todos.slice(index + 1),
                      ])
                    }}
                  />
                  <Button
                    sx={{ margin: '8px' }}
                    size='small'
                    color='secondary'
                    aria-label={`Delete todo item ${index + 1}`}
                    onClick={() => {
                      setTodos([
                        // immutable delete
                        ...todos.slice(0, index),
                        ...todos.slice(index + 1),
                      ])
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              )
            })}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { text: '', completed: false }])
              }}
            >
              Add Todo <AddIcon />
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Save
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
