import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardActions, Button, Typography, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { updateTodoList, getTodoListById } from '../../lib/actions'
import { isListCompleted } from '../../lib/utils'
import { useDebouncedCallback } from 'use-debounce'
import { TodoItem } from './TodoItem'
import { toast } from 'react-toastify'
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

  const debouncedSaveTodos = useDebouncedCallback((newTodos) => {
    saveTodos(newTodos)
  }, 600)

  //cancel debounced saves on list change
  useEffect(() => {
    return () => {
      if (debouncedSaveTodos.isPending())
        toast.error('Saving interrupted', { hideProgressBar: true })
      debouncedSaveTodos.cancel()
    }
  }, [activeListId, debouncedSaveTodos])

  const saveTodos = (newTodos) => {
    if (!activeListId || isLoading) return
    setIsSaving(true)
    const startTime = Date.now()

    //ensure a minimum delay for the save indicator to show
    updateTodoList(activeListId, newTodos)
      .then(() => {
        setListCompletion(activeList, isListCompleted(newTodos))
        const elapsedTime = Date.now() - startTime
        const remainingDelay = Math.max(0, 1000 - elapsedTime)
        setTimeout(() => setIsSaving(false), remainingDelay)
      })
      .catch(() => {
        setIsSaving(false)
      })
  }

  const handleTodoUpdate = (index, newTodo) => {
    const newTodos = [...todos.slice(0, index), newTodo, ...todos.slice(index + 1)]
    setTodos(newTodos)
    saveTodos(newTodos)
  }

  const handleTextChange = (index, newText, todo) => {
    const newTodos = [
      ...todos.slice(0, index),
      { ...todo, text: newText },
      ...todos.slice(index + 1),
    ]
    setTodos(newTodos)
    debouncedSaveTodos(newTodos)
  }

  const handleTodoDeletion = (index) => {
    const newTodos = [...todos.slice(0, index), ...todos.slice(index + 1)]
    setTodos(newTodos)
    saveTodos(newTodos)
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
              return (
                <TodoItem
                  key={index}
                  todo={todo}
                  index={index}
                  onUpdate={handleTodoUpdate}
                  onTextChange={handleTextChange}
                  onDelete={handleTodoDeletion}
                />
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
