import { TextField, Button, Checkbox, Chip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { getDueDateDifference } from '../../lib/utils'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

export const TodoItem = ({ todo, index, onUpdate, onTextChange, onDelete }) => {
  const dueDateDifference = !todo.completed ? getDueDateDifference(todo.dueDate) : null

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
        gap: '0.5rem',
      }}
    >
      <Checkbox
        sx={{ flex: '0 0 auto' }}
        checked={todo.completed}
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleIcon />}
        color='success'
        onChange={() => onUpdate(index, { ...todo, completed: !todo.completed })}
      />
      <TextField
        sx={{ flex: '6 0 0' }}
        label='What to do?'
        value={todo.text}
        onChange={(event) => {
          onTextChange(index, event.target.value, todo)
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ flex: '4 0 0' }}
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
            visibility: dueDateDifference && dayjs(todo.dueDate).isValid() ? 'visible' : 'hidden',
          }}
        />
      </div>
      <Button
        sx={{ flex: '0 0 auto' }}
        size='small'
        color='secondary'
        onClick={() => onDelete(index)}
      >
        <DeleteIcon />
      </Button>
    </div>
  )
}
