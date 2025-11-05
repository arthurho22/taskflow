import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore'

// 🔹 Tipagem de uma tarefa
export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done' | 'overdue'
  userId: string
  createdAt?: Date
  dueDate?: Date
}

export const TaskService = {
  // 🔹 Estatísticas do usuário
  async getUserStats(userId: string) {
    const tasksRef = collection(db, 'tasks')
    const q = query(tasksRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)

    const tasks: Task[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Task, 'id'>),
    }))

    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'done').length
    const pending = tasks.filter(t => t.status === 'todo').length
    const overdue = tasks.filter(t => t.status === 'overdue').length

    return {
      total,
      completed,
      pending,
      overdue,
      completedThisWeek: Math.floor(Math.random() * completed),
    }
  },

  // 🔹 Criar nova tarefa
  async createTask(userId: string, taskData: Omit<Task, 'id' | 'userId'>) {
    const tasksRef = collection(db, 'tasks')
    await addDoc(tasksRef, { ...taskData, userId, createdAt: new Date() })
  },

  // 🔹 Atualizar tarefa
  async updateTask(taskId: string, updates: Partial<Task>) {
    const taskRef = doc(db, 'tasks', taskId)
    await updateDoc(taskRef, updates)
  },

  // 🔹 Deletar tarefa
  async deleteTask(taskId: string) {
    const taskRef = doc(db, 'tasks', taskId)
    await deleteDoc(taskRef)
  },

  // 🔹 Escuta em tempo real (Kanban)
  listenTasksByUser(userId: string, callback: (tasks: Task[]) => void) {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, 'id'>),
      }))
      callback(tasks)
    })
    return unsubscribe
  },
}
