import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllTodoLists, getTodoListById, updateTodoList } from './actions'

export const useTodoLists = () => {
  return useQuery({
    queryKey: ['todoLists'],
    queryFn: () => getAllTodoLists(),
  })
}

export const useTodoList = (id) => {
  return useQuery({
    queryKey: ['todoList', id],
    queryFn: () => getTodoListById(id),
  })
}

export const useUpdateTodoList = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, todos }) => updateTodoList(id, todos),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['todoList', id] })
      queryClient.invalidateQueries({ queryKey: ['todoLists'] })
    },
  })
}
