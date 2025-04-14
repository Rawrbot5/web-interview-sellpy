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
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { updateTodoList, getTodoListById } from '../../lib/actions'
import { getDueDateDifference, isListCompleted } from '../../lib/utils'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useDebouncedCallback } from 'use-debounce'

export const TodoListContent = ({ activeList, setListCompletion }) => {
  const activeListId = activeList?.id
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // fetch todos from server
  useEffect(() => {
    if (!activeListId) return

    setIsLoading(true)
    getTodoListById(activeListId).then((todosList) => {
      setTodos(todosList.todos)
      setIsLoading(false)
    })
  }, [activeListId])

  //cancel debounced saves on list change
  useEffect(() => {
    return () => {
      debouncedSaveTodos.cancel()
    }
  }, [activeListId])

  //debounce setting save state
  const debouncedSetNotSaving = useDebouncedCallback(() => {
    setIsSaving(false)
  }, 200)

  const saveTodos = (newTodos) => {
    if (!activeListId || isLoading) return
    setIsSaving(true)
    updateTodoList(activeListId, newTodos).then(() => {
      setListCompletion(activeList, isListCompleted(newTodos))
      debouncedSetNotSaving()
    })
  }

  const debouncedSaveTodos = useDebouncedCallback((newTodos) => {
    saveTodos(newTodos)
  }, 600)

  const handleTextChange = (index, newText, todo) => {
    const newTodos = [
      ...todos.slice(0, index),
      { ...todo, text: newText },
      ...todos.slice(index + 1),
    ]
    setTodos(newTodos)
    debouncedSaveTodos(newTodos)
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
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
                      const newTodos = [
                        ...todos.slice(0, index),
                        { ...todo, completed: event.target.checked },
                        ...todos.slice(index + 1),
                      ]
                      setTodos(newTodos)
                      saveTodos(newTodos)
                    }}
                  />
                  <TextField
                    sx={{ flex: '6 0 0' }}
                    label='What to do?'
                    value={todo.text}
                    onChange={(event) => {
                      handleTextChange(index, event.target.value, todo)
                    }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ flex: '4 0 0' }}
                      label='Due when?'
                      format='YYYY-MM-DD'
                      value={todo.dueDate ? dayjs(todo.dueDate) : null}
                      onChange={(newDate, context) => {
                        if (context.validationError === null) {
                          const newTodos = [
                            ...todos.slice(0, index),
                            { ...todo, dueDate: newDate ? newDate.format('YYYY-MM-DD') : null },
                            ...todos.slice(index + 1),
                          ]
                          setTodos(newTodos)
                          saveTodos(newTodos)
                        }
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
                        visibility:
                          dueDateDifference && dayjs(todo.dueDate).isValid() ? 'visible' : 'hidden',
                      }}
                    />
                  </div>
                  <Button
                    sx={{ flex: '0 0 auto' }}
                    size='small'
                    color='secondary'
                    onClick={() => {
                      const newTodos = [...todos.slice(0, index), ...todos.slice(index + 1)]
                      setTodos(newTodos)
                      saveTodos(newTodos)
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
                const newTodos = [...todos, { text: '', completed: false }]
                setTodos(newTodos)
                saveTodos(newTodos)
              }}
            >
              Add Todo <AddIcon />
            </Button>
            {isSaving && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CircularProgress
                  size={24}
                  sx={{
                    marginLeft: 'auto',
                    marginRight: 2,
                  }}
                />
                <Typography color='primary'>Saving...</Typography>
              </div>
            )}
          </CardActions>
        </div>
      </CardContent>
    </Card>
  )
}
