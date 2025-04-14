import dayjs from 'dayjs'

export const getDueDateDifference = (dueDate) => {
  if (!dueDate) return null

  const dueDateDayjs = dayjs(dueDate)
  const dayDifference = dueDateDayjs.diff(dayjs(), 'day')
  if (dayDifference === 0) return { label: 'Today', color: 'warning', variant: 'filled' }
  else if (dayDifference === 1) return { label: 'Tomorrow', color: 'success', variant: 'outlined' }
  else if (dayDifference === -1) return { label: 'Yesterday', color: 'error', variant: 'filled' }
  else if (dayDifference < -1)
    return {
      label: `${Math.abs(dayDifference)} days ago!`,
      color: 'error',
      variant: 'filled',
    }
  else return { label: `In ${dayDifference} days`, color: 'success', variant: 'outlined' }
}

export const isListCompleted = (todos) => {
  return todos.every((todo) => todo.completed)
}
// Simulate network
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
