import React, { Fragment, useState } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { TodoListContent } from './TodoListContent'
import { useTodoLists } from '../../lib/queries'

export const TodoLists = ({ style }) => {
  const { data: todoLists, isLoading: isTodoListsLoading } = useTodoLists()
  const [activeList, setActiveList] = useState(null)

  if (isTodoListsLoading)
    return (
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <CircularProgress sx={{ margin: '0.5rem' }} />
        </CardContent>
      </Card>
    )
  if (todoLists?.length === 0 || !todoLists) return null

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {todoLists?.map((todoList) => (
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
      {activeList && <TodoListContent activeList={activeList} />}
    </Fragment>
  )
}
