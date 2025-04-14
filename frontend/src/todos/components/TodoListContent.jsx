import React, { useState, useEffect } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Checkbox,
  Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { updateTodoList, getTodoListById } from '../../lib/actions'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

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

  const getDueDateDifference = (dueDate) => {
    if (!dueDate) return null
    const dueDateDayjs = dayjs(dueDate)
    const dayDifference = dueDateDayjs.diff(dayjs(), 'day')
    if (dayDifference === 0) return { label: 'Today', color: 'warning', variant: 'filled' }
    else if (dayDifference === 1)
      return { label: 'Tomorrow', color: 'success', variant: 'outlined' }
    else if (dayDifference === -1)
      return { label: 'Yesterday', color: 'error', variant: 'outlined' }
    else if (dayDifference < -1)
      return {
        label: `${Math.abs(dayDifference)} days ago!`,
        color: 'error',
        variant: 'filled',
      }
    else return { label: `In ${dayDifference} days`, color: 'success', variant: 'outlined' }
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
              const dueDateDifference = !todo.completed ? getDueDateDifference(todo.dueDate) : null
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.25rem',
                    gap: '0.5rem',
                  }}
                >
                  <Checkbox
                    sx={{ flex: '0 0 auto' }}
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
                    sx={{ flex: '6 0 0' }}
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ flex: '4 0 0' }}
                      label='Due when?'
                      format='YYYY-MM-DD'
                      value={todo.dueDate ? dayjs(todo.dueDate) : null}
                      onChange={(newDate) => {
                        setTodos([
                          ...todos.slice(0, index),
                          { ...todo, dueDate: newDate ? newDate.format('YYYY-MM-DD') : null },
                          ...todos.slice(index + 1),
                        ])
                      }}
                      slotProps={{
                        textField: {
                          size: 'medium',
                          clearable: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <div
                    style={{
                      flex: '1 0 0',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Chip
                      label={dueDateDifference?.label}
                      color={dueDateDifference?.color}
                      variant={dueDateDifference?.variant}
                      size='small'
                      sx={{
                        visibility: dueDateDifference ? 'visible' : 'hidden',
                      }}
                    />
                  </div>
                  <Button
                    sx={{ flex: '0 0 auto' }}
                    size='small'
                    color='secondary'
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
