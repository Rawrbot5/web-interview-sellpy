import { z } from 'zod'

export const todoItemSchema = z.object({
  text: z.string().optional(),
  completed: z.boolean().default(false),
  dueDate: z.string().date().nullable().optional(),
})

export const todoListSchema = z.object({
  id: z.string(),
  title: z.string(),
  todos: z.array(todoItemSchema).default([]),
  completed: z.boolean().optional(),
})

export const todoArraySchema = z.array(todoItemSchema)
