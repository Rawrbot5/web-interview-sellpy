import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardActions, Button, Typography, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { isListCompleted } from '../../lib/utils'
import { useDebouncedCallback } from 'use-debounce'
import { useQueryClient } from '@tanstack/react-query'
import { TodoItem } from './TodoItem'
import { toast } from 'react-toastify'
import { useTodoList, useUpdateTodoList } from '../../lib/queries'

export const TodoListContent = ({ activeList }) => {
  const queryClient = useQueryClient()
  const activeListId = activeList?.id
  const [isSaving, setIsSaving] = useState(false)

  const { data: todoList, isLoading: isTodoListLoading } = useTodoList(activeListId)

  const updateTodoListMutation = useUpdateTodoList()

  const debouncedSaveTodos = useDebouncedCallback((newTodos) => {
    saveTodos(newTodos)
  }, 600)

  //cancel debounced saves on list change
  useEffect(() => {
    return () => {
      if (debouncedSaveTodos.isPending())
        toast.error('Saving interrupted', { hideProgressBar: true })
      queryClient.invalidateQueries({ queryKey: ['todoList', activeListId] })
      debouncedSaveTodos.cancel()
    }
  }, [activeListId, debouncedSaveTodos, queryClient])

  const saveTodos = (newTodos) => {
    if (!activeListId || isTodoListLoading) return
    setIsSaving(true)
    const startTime = Date.now()

    updateTodoListMutation.mutate(
      { id: activeListId, todos: newTodos },
      {
        onSuccess: (data) => {
          const elapsedTime = Date.now() - startTime
          const remainingDelay = Math.max(0, 1000 - elapsedTime)
          setTimeout(() => setIsSaving(false), remainingDelay)
        },
        onError: (error) => {
          console.error('Mutation error:', error)
          toast.error('Failed to save todos', { hideProgressBar: true })
          setIsSaving(false)
        },
      }
    )
  }

  const handleTodoUpdate = (index, newTodo) => {
    console.log('handleTodoUpdate called with:', { index, newTodo })
    const newTodos = [
      ...todoList.todos.slice(0, index),
      newTodo,
      ...todoList.todos.slice(index + 1),
    ]
    saveTodos(newTodos)
  }

  const handleTextChange = (index, newText, todo) => {
    const newTodos = [
      ...todoList.todos.slice(0, index),
      { ...todo, text: newText },
      ...todoList.todos.slice(index + 1),
    ]
    queryClient.setQueryData(['todoList', activeListId], { ...todoList, todos: newTodos })
    debouncedSaveTodos(newTodos)
  }

  const handleTodoDeletion = (index) => {
    const newTodos = [...todoList.todos.slice(0, index), ...todoList.todos.slice(index + 1)]
    saveTodos(newTodos)
  }

  if (isTodoListLoading) {
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
          {todoList?.todos &&
            todoList.todos.map((todo, index) => {
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
                const newTodos = [...todoList.todos, { text: '', completed: false }]
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
