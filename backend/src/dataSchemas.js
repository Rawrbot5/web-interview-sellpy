import { z } from 'zod'

export const todoItemSchema = z.object({
  text: z.string(),
  completed: z.boolean().default(false),
  dueDate: z.date().optional(),
})

export const todoListSchema = z.object({
  id: z.string(),
  title: z.string(),
  todos: z.array(todoItemSchema).default([]),
})
