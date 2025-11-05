'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TaskService, Task } from '@/services/taskService'
import { Plus, ListTodo, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function KanbanPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Escuta em tempo real das tarefas do usuário
    const unsubscribe = TaskService.listenTasksByUser(user.uid, (userTasks) => {
      setTasks(userTasks)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, router])

  const grouped = {
    todo: tasks.filter((t) => t.status === 'todo'),
    inProgress: tasks.filter((t) => t.status === 'in-progress'),
    done: tasks.filter((t) => t.status === 'done'),
    overdue: tasks.filter((t) => t.status === 'overdue'),
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Carregando seu Kanban...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg">
              <ListTodo className="w-7 h-7 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kanban
            </h1>
          </div>

          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
          >
            <Plus size={20} /> Nova Tarefa
          </Link>
        </header>

        {/* Colunas */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'A Fazer', key: 'todo', color: 'blue' },
            { title: 'Em Progresso', key: 'inProgress', color: 'amber' },
            { title: 'Concluídas', key: 'done', color: 'emerald' },
            { title: 'Atrasadas', key: 'overdue', color: 'rose' },
          ].map((col) => (
            <div
              key={col.key}
              className={`bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-white/20 p-4`}
            >
              <h3
                className={`text-lg font-semibold mb-4 text-${col.color}-600 dark:text-${col.color}-400`}
              >
                {col.title} ({grouped[col.key as keyof typeof grouped].length})
              </h3>
              <div className="space-y-3">
                {grouped[col.key as keyof typeof grouped].length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center italic">
                    Nenhuma tarefa
                  </p>
                ) : (
                  grouped[col.key as keyof typeof grouped].map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200/30 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-all"
                    >
                      <p className="font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
