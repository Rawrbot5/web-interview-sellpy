import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { TodoListContent } from './TodoListContent'
import { getAllTodoLists } from '../../lib/actions'
// Simulate network
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState([])
  const [activeList, setActiveList] = useState(null)

  // initial data fetching
  useEffect(() => {
    getAllTodoLists().then(setTodoLists)
  }, [])

  const setListCompletion = (list, completed) => {
    const updatedTodoLists = todoLists.map((todoList) =>
      todoList.id === list.id ? { ...todoList, completed } : todoList
    )
    setTodoLists(updatedTodoLists)
  }

  if (todoLists.length === 0) return null

  console.log('activeList: ', activeList)
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {todoLists.map((todoList) => (
              <ListItemButton
                key={todoList.id}
                onClick={() => setActiveList(todoList)}
                selected={todoList.id === activeList?.id}
              >
                <ListItemIcon>
                  {todoList.completed ? <CheckCircleIcon color='success' /> : <ReceiptIcon />}
                </ListItemIcon>
                <ListItemText primary={todoList?.title} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
      {activeList && (
        <TodoListContent activeList={activeList} setListCompletion={setListCompletion} />
      )}
    </Fragment>
  )
}
