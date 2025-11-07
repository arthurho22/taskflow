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
  serverTimestamp,
} from 'firebase/firestore'

// ✅ Correto:
import type { Task } from '@/types/task'


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
  // 🔹 Criar nova tarefa
async createTask(userId: string, task: Omit<Task, 'id' | 'userId' | 'createdAt'>) {
  const tasksRef = collection(db, 'tasks')
  await addDoc(tasksRef, {
    ...task,
    userId,
    createdAt: new Date().toISOString(), // string ISO
    dueDate: task.dueDate || null,       // já é string, sem precisar converter
  })
},

  // 🔹 Buscar todas as tarefas do usuário (para o calendário)
  async getUserTasks(userId: string) {
    const tasksRef = collection(db, 'tasks')
    const q = query(tasksRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)

    const tasks: Task[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Task, 'id'>),
    }))

    return tasks
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
