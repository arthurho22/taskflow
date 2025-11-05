// src/types/task.ts

export interface Subtask {
  id: string
  title: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

// Interface principal Task que estava faltando
export interface Task {
  id: string
  title: string
  description: string
  dueDate: string // ISO string
  priority: 'baixa' | 'media' | 'alta'
  status: 'pendente' | 'andamento' | 'concluida'
  subtasks: Subtask[]
  userId: string
  createdAt: number
  updatedAt: number
}

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: number
}

export interface TaskStats {
  total: number
  pending: number
  completed: number
  overdue: number
  completedThisWeek: number
}

// Tipo para criar nova tarefa (sem id e timestamps)
export type CreateTaskData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>