'use client'

import { useEffect, useState } from 'react'
import { Task } from '@/types/task'
import { useAuth } from '@/providers/AuthProvider'
import { listenTasksByUser, deleteTask, updateTask } from '@/services/taskService'
import { toast } from 'sonner'

export default function TaskList() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'todas' | 'pendente' | 'andamento' | 'concluida'>('todas')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')

  useEffect(() => {
    if (!user?.uid) return
    const unsubscribe = listenTasksByUser(user.uid, (data) => {
      setTasks(data)
    })
    return () => unsubscribe()
  }, [user])

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id)
      toast.success('Tarefa removida!')
    } catch {
      toast.error('Erro ao excluir tarefa.')
    }
  }

  const handleToggleStatus = async (task: Task) => {
    const next =
      task.status === 'pendente'
        ? 'andamento'
        : task.status === 'andamento'
        ? 'concluida'
        : 'pendente'
    await updateTask(task.id!, { status: next })
  }

  const handleEdit = (task: Task) => {
    setEditingId(task.id!)
    setEditTitle(task.title)
    setEditDesc(task.description || '')
  }

  const handleSaveEdit = async (id: string) => {
    try {
      await updateTask(id, { title: editTitle, description: editDesc })
      toast.success('Tarefa atualizada!')
      setEditingId(null)
    } catch {
      toast.error('Erro ao editar tarefa.')
    }
  }

  const filtered = filter === 'todas' ? tasks : tasks.filter((t) => t.status === filter)
  const doneCount = tasks.filter((t) => t.status === 'concluida').length

  if (!tasks.length)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Nenhuma tarefa encontrada.
      </div>
    )

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Tarefas ({doneCount}/{tasks.length} concluídas)
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border rounded-md px-2 py-1 dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="todas">Todas</option>
          <option value="pendente">Pendentes</option>
          <option value="andamento">Em andamento</option>
          <option value="concluida">Concluídas</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 flex justify-between items-start dark:border-gray-700"
          >
            <div className="flex-1">
              {editingId === task.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full mb-2 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full mb-2 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  />
                </>
              ) : (
                <>
                  <h3 className="font-medium">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                  )}
                  <p className="text-xs text-gray-500">Status: {task.status}</p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2 ml-4">
              {editingId === task.id ? (
                <button
                  onClick={() => handleSaveEdit(task.id!)}
                  className="bg-green-600 text-white text-sm px-3 py-1 rounded-md hover:bg-green-700"
                >
                  Salvar
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-md hover:bg-yellow-600"
                >
                  Editar
                </button>
              )}
              <button
                onClick={() => handleToggleStatus(task)}
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700"
              >
                Mudar status
              </button>
              <button
                onClick={() => handleDelete(task.id!)}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
