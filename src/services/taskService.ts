// src/services/taskService.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  Timestamp,
  onSnapshot // ← ADICIONE ESTE IMPORT
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Task, Subtask, CreateTaskData, TaskStats } from '@/types/task'

export class TaskService {
  // Criar nova tarefa
  static async createTask(taskData: CreateTaskData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      throw error
    }
  }

  // Buscar todas as tarefas do usuário
  static async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const tasks: Task[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        tasks.push({
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          dueDate: data.dueDate || new Date().toISOString(),
          priority: data.priority || 'media',
          status: data.status || 'pendente',
          subtasks: data.subtasks || [],
          userId: data.userId,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis() || Date.now(),
        })
      })
      
      return tasks
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
      throw error
    }
  }

  // ADICIONE ESTA FUNÇÃO - para o calendário em tempo real
  static listenTasksByUser(userId: string, callback: (tasks: Task[]) => void): () => void {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasks: Task[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          tasks.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            dueDate: data.dueDate || '',
            priority: data.priority || 'media',
            status: data.status || 'pendente',
            subtasks: data.subtasks || [],
            userId: data.userId,
            createdAt: data.createdAt?.toMillis() || Date.now(),
            updatedAt: data.updatedAt?.toMillis() || Date.now(),
          })
        })
        callback(tasks)
      }, (error) => {
        console.error('Erro ao ouvir tarefas:', error)
      })
      
      return unsubscribe
    } catch (error) {
      console.error('Erro ao configurar listener:', error)
      return () => {} // Retorna função vazia em caso de erro
    }
  }

  // Atualizar tarefa
  static async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId)
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      throw error
    }
  }

  // Deletar tarefa
  static async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', taskId))
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
      throw error
    }
  }

  // Adicionar sub-tarefa
  static async addSubtask(taskId: string, subtaskData: Omit<Subtask, 'id'>): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId)
      const taskDoc = await getDoc(taskRef)
      
      if (taskDoc.exists()) {
        const task = taskDoc.data()
        const currentSubtasks: Subtask[] = task.subtasks || []
        
        const newSubtask: Subtask = {
          ...subtaskData,
          id: `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
        
        await updateDoc(taskRef, {
          subtasks: [...currentSubtasks, newSubtask],
          updatedAt: Timestamp.now(),
        })
      } else {
        throw new Error('Tarefa não encontrada')
      }
    } catch (error) {
      console.error('Erro ao adicionar sub-tarefa:', error)
      throw error
    }
  }

  // Atualizar sub-tarefa
  static async updateSubtask(taskId: string, subtaskId: string, updates: Partial<Subtask>): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId)
      const taskDoc = await getDoc(taskRef)
      
      if (taskDoc.exists()) {
        const task = taskDoc.data()
        const currentSubtasks: Subtask[] = task.subtasks || []
        
        const updatedSubtasks = currentSubtasks.map(subtask =>
          subtask.id === subtaskId 
            ? { 
                ...subtask, 
                ...updates, 
                updatedAt: Date.now() 
              }
            : subtask
        )
        
        await updateDoc(taskRef, {
          subtasks: updatedSubtasks,
          updatedAt: Timestamp.now(),
        })
      } else {
        throw new Error('Tarefa não encontrada')
      }
    } catch (error) {
      console.error('Erro ao atualizar sub-tarefa:', error)
      throw error
    }
  }

  // Calcular progresso da tarefa
  static calculateTaskProgress(subtasks: Subtask[]): number {
    if (!subtasks || subtasks.length === 0) return 0
    const completed = subtasks.filter(subtask => subtask.completed).length
    return Math.round((completed / subtasks.length) * 100)
  }

  // Buscar estatísticas do usuário
  static async getUserStats(userId: string): Promise<TaskStats> {
    try {
      const tasks = await this.getUserTasks(userId)
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const stats: TaskStats = {
        total: tasks.length,
        pending: tasks.filter(task => task.status === 'pendente').length,
        completed: tasks.filter(task => task.status === 'concluida').length,
        overdue: tasks.filter(task => 
          task.status !== 'concluida' && 
          new Date(task.dueDate) < now
        ).length,
        completedThisWeek: tasks.filter(task => 
          task.status === 'concluida' && 
          new Date(task.updatedAt) >= oneWeekAgo
        ).length,
      }

      return stats
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return {
        total: 0,
        pending: 0,
        completed: 0,
        overdue: 0,
        completedThisWeek: 0,
      }
    }
  }
}