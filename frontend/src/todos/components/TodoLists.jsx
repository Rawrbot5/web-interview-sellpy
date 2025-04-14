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
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={todoList?.title} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
      {activeList && (
        <TodoListContent
          key={activeList.id} // use key to make React recreate component to reset internal state
          activeList={activeList}
          saveTodoList={(id, { todos }) => {
            const listToUpdate = todoLists.find((list) => list.id === id)
            setTodoLists([
              ...todoLists.filter((list) => list.id !== id),
              { ...listToUpdate, todos },
            ])
          }}
        />
      )}
    </Fragment>
  )
}
