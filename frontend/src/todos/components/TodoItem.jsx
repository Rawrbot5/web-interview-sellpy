import { TextField, Button, Checkbox, Chip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { getDueDateDifference } from '../../lib/utils'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'

export const TodoItem = ({ todo, index, onUpdate, onTextChange, onDelete }) => {
  const [todoText, setTodoText] = useState(todo.text)
  const dueDateDifference = !todo.completed ? getDueDateDifference(todo.dueDate) : null

  useEffect(() => {
    setTodoText(todo.text)
  }, [todo.text])

  useEffect(() => {
    return () => {
      if (todoText !== todo.text) {
        setTodoText(todo.text)
      }
    }
  }, [todo.text, todoText])

  const handleDateChange = (newDate, context) => {
    if (context.validationError === null) {
      onUpdate(index, { ...todo, dueDate: newDate ? newDate.format('YYYY-MM-DD') : null })
    }
  }

  return (
    <div
      key={index}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem',
        flexWrap: 'wrap',
        gap: '0.5rem',
        width: '100%',
      }}
    >
      <Checkbox
        sx={{ flex: '0 0 auto' }}
        checked={todo.completed}
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleIcon />}
        color='success'
        onChange={() => {
          onUpdate(index, { ...todo, completed: !todo.completed })
        }}
      />
      <TextField
        sx={{
          flex: '1 1 250px',
          minWidth: { xs: '100%', md: '150px' },
        }}
        label='What to do?'
        value={todoText}
        multiline
        onChange={(event) => {
          const newText = event.target.value
          setTodoText(newText)
          onTextChange(index, newText, todo)
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            flex: '1 1 200px',
            minWidth: { xs: '100%', md: '150px' },
          }}
          label='Due when?'
          format='YYYY-MM-DD'
          value={todo.dueDate ? dayjs(todo.dueDate) : null}
          onChange={(newDate, context) => handleDateChange(newDate, context)}
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
          flex: '0 0 100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: { xs: '100%', md: '100px' },
        }}
      >
        <Chip
          label={dueDateDifference?.label}
          color={dueDateDifference?.color}
          variant={dueDateDifference?.variant}
          size='small'
          sx={{
            visibility: dueDateDifference && dayjs(todo.dueDate).isValid() ? 'visible' : 'hidden',
            maxWidth: '100%',
          }}
        />
      </div>
      <Button
        sx={{
          flex: '0 0 auto',
        }}
        size='small'
        color='secondary'
        onClick={() => onDelete(index)}
      >
        <DeleteIcon />
      </Button>
    </div>
  )
}
