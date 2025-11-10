'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TaskService } from '@/services/taskService'
import type { Task } from '@/types/task'
import { Loader2, Trash2, Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TaskListPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const unsubscribe = TaskService.listenTasksByUser(user.uid, (userTasks) => {
      setTasks(userTasks)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, router])

  const handleDelete = async (taskId: string, title: string) => {
    if (confirm(`Tem certeza que deseja deletar "${title}"?`)) {
      try {
        await TaskService.deleteTask(taskId)
      } catch (err) {
        console.error('Erro ao deletar tarefa:', err)
        alert('Erro ao deletar tarefa.')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
        <p className="mt-3 text-gray-600">Carregando suas tarefas...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900 p-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Lista de Tarefas
        </h1>

        {tasks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Nenhuma tarefa encontrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  <th className="p-3 text-left">Título</th>
                  <th className="p-3 text-left">Descrição</th>
                  <th className="p-3 text-left">Prioridade</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Vencimento</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-3 font-medium">{task.title}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">
                      {task.description || '—'}
                    </td>
                    <td className="p-3 capitalize">{task.priority}</td>
                    <td className="p-3 capitalize">{task.status}</td>
                    <td className="p-3">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => alert('Em breve: edição de tarefas')}
                        className="text-blue-500 hover:text-blue-700"
                        title="Editar tarefa"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id, task.title)}
                        className="text-red-500 hover:text-red-700"
                        title="Excluir tarefa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
