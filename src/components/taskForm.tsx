'use client'

import { useState } from 'react'
import { createTask } from '@/services/taskService'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'

export default function TaskForm() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!title.trim()) {
      toast.error('O título da tarefa é obrigatório.')
      return
    }

    try {
      setLoading(true)
      await createTask({
        userId: user.uid,
        title,
        description,
        status: 'pendente',
        createdAt: Date.now(),
      })
      toast.success('Tarefa criada com sucesso!')
      setTitle('')
      setDescription('')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao criar tarefa.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">Nova Tarefa</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da tarefa"
        className="w-full p-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição (opcional)"
        className="w-full p-2 mb-3 border rounded-md dark:bg-gray-800 dark:border-gray-700"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? 'Adicionando...' : 'Adicionar tarefa'}
      </button>
    </form>
  )
}
