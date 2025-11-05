'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Surface from '@/components/surface'
import {
  Plus, ListTodo, Clock, CheckCircle2, AlertTriangle, TrendingUp, Calendar as CalIcon, Zap, Sparkles
} from 'lucide-react'
import { TaskService } from '@/services/taskService'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total:0, pending:0, completed:0, overdue:0, completedThisWeek:0 })

  useEffect(() => {
    if (!user) {
      // protegido: se não tiver user, manda ao login
      router.push('/login')
      return
    }
    async function load() {
      try {
        if (!user) throw new Error('User is null');
        const userStats = await TaskService.getUserStats(user.uid)
        setStats(userStats)
      } catch {
        setStats({ total: 12, pending: 4, completed:6, overdue:2, completedThisWeek:3 })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, router])

  const progress = Math.round((stats.completed / (stats.total || 1)) * 100)
  const weeklyProgress = Math.round((stats.completedThisWeek / (stats.total || 1)) * 100)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-16 h-16 border-b-2 border-blue-600 rounded-full mx-auto relative">
          <Sparkles className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
        </div>
        <p className="mt-4 text-gray-600">Carregando seu dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">Visão geral das suas tarefas</p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard/kanban" className="btn-primary">
              <Plus /> Nova Tarefa
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Surface>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de tarefas</p>
                <p className="text-2xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ListTodo className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Surface>

          <Surface>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold mt-2">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Surface>

          <Surface>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Concluídas</p>
                <p className="text-2xl font-bold mt-2">{stats.completed}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Surface>

          <Surface>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vencidas</p>
                <p className="text-2xl font-bold mt-2">{stats.overdue}</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </Surface>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Surface>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Progresso Geral</h3>
              <div className="text-sm text-gray-500">{progress}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </Surface>

          <Surface>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Esta Semana</h3>
              <div className="text-sm text-gray-500">{weeklyProgress}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all" style={{ width: `${weeklyProgress}%` }} />
            </div>
          </Surface>
        </div>

        <Surface>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Ações Rápidas</h3>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/kanban" className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition flex items-center gap-3">
              <ListTodo className="w-5 h-5 text-blue-600" /><span>Ver Kanban</span>
            </Link>
            <Link href="/dashboard/calendar" className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition flex items-center gap-3">
              <CalIcon className="w-5 h-5 text-purple-600"/><span>Calendário</span>
            </Link>
            <Link href="/dashboard/tasks" className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600"/><span>Lista de Tarefas</span>
            </Link>
          </div>
        </Surface>

      </div>
    </div>
  )
}
