// src/types/task.ts

export interface Subtask {
  id: string
  title: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

// Interface principal Task que estava faltando
export type Task = {
  id: string
  userId: string
  title: string
  description?: string
  priority: 'alta' | 'media' | 'baixa'
  status: 'todo' | 'in-progress' | 'done' | 'overdue'
  dueDate?: string   // ← ALTERADO: era Date
  createdAt: string  // ← também string, já que Firestore armazena assim
  subtasks?: {
    id: string
    title: string
    completed: boolean
  }[]
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
export type CreateTaskData = Omit<Task, 'id' | 'createdAt' | 'userId'>
