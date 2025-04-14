import React, { useState, useEffect } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { updateTodoList, getTodoListById } from '../../lib/actions'

export const TodoListContent = ({ activeList }) => {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!activeList?.id) return

    setIsLoading(true)
    getTodoListById(activeList?.id).then((todosList) => {
      setTodos(todosList.todos)
      setIsLoading(false)
    })
  }, [activeList?.id])

  const handleSubmit = (event) => {
    event.preventDefault()
    updateTodoList(activeList?.id, todos)
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
                  <Typography sx={{ margin: '8px' }} variant='h6'>
                    {index + 1}
                  </Typography>
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
                setTodos([...todos, ''])
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
