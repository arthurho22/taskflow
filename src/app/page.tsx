'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TaskService } from '@/services/taskService'
import Link from 'next/link'
import {
  Plus,
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Sparkles,
  UserCircle2
} from 'lucide-react'

<div className="bg-primary-600 text-white p-8 text-2xl font-bold">
  Tailwind funcionando 🎨
</div>


export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
    completedThisWeek: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadStats()
    } else {
      setLoading(false)
      setError('Usuário não autenticado')
    }
  }, [user])

  const loadStats = async () => {
    try {
      setError(null)
      if (!user) throw new Error('Usuário não disponível')

      const userStats = await TaskService.getUserStats(user.uid)
      setStats(userStats)
    } catch (error) {
      console.error('Erro ao carregar stats:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
      setStats({
        total: 12,
        pending: 4,
        completed: 6,
        overdue: 2,
        completedThisWeek: 3,
      })
    } finally {
      setLoading(false)
    }
  }

  const progress = Math.round((stats.completed / (stats.total || 1)) * 100)
  const weeklyProgress = Math.round((stats.completedThisWeek / (stats.total || 1)) * 100)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900">
        <div className="text-center animate-pulse">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Carregando seu painel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Olá, {user?.displayName || 'Usuário'} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
              Bem-vindo de volta ao seu painel de produtividade {error && '(modo demonstração)'}.
            </p>
          </div>

          <Link
            href="/dashboard/kanban"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
          >
            <Plus size={20} /> Nova Tarefa
          </Link>
        </header>

        {/* Estatísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total de Tarefas', value: stats.total, icon: ListTodo, color: 'blue' },
            { title: 'Pendentes', value: stats.pending, icon: Clock, color: 'amber' },
            { title: 'Concluídas', value: stats.completed, icon: CheckCircle2, color: 'emerald' },
            { title: 'Atrasadas', value: stats.overdue, icon: AlertTriangle, color: 'rose' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/90 p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-${stat.color}-400/20 to-${stat.color}-600/30 opacity-0 group-hover:opacity-100 blur-xl transition`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/40 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Gráficos de Progresso */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[{
            title: 'Progresso Geral',
            value: progress,
            color: 'from-blue-500 to-indigo-600',
            icon: <TrendingUp className="text-blue-600 dark:text-blue-400" />,
          }, {
            title: 'Esta Semana',
            value: weeklyProgress,
            color: 'from-purple-500 to-pink-600',
            icon: <Calendar className="text-purple-600 dark:text-purple-400" />,
          }].map((prog, i) => (
            <div
              key={i}
              className="relative bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{prog.title}</h3>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">{prog.icon}</div>
              </div>
              <div className="w-full bg-gray-200/70 dark:bg-gray-700/80 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r ${prog.color}`}
                  style={{ width: `${prog.value}%` }}
                />
              </div>
              <p className="mt-3 text-right text-sm text-gray-500 dark:text-gray-400 font-medium">{prog.value}% concluído</p>
            </div>
          ))}
        </section>

        {/* Ações Rápidas */}
        <section className="relative bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Ações Rápidas</h3>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { href: '/dashboard/kanban', label: 'Ver Kanban', color: 'blue', icon: ListTodo },
              { href: '/dashboard/calendar', label: 'Calendário', color: 'purple', icon: Calendar },
              { href: '/dashboard/tasks', label: 'Lista de Tarefas', color: 'green', icon: CheckCircle2 },
            ].map((btn, i) => (
              <Link
                key={i}
                href={btn.href}
                className={`p-5 rounded-xl flex items-center gap-3 bg-${btn.color}-50 dark:bg-${btn.color}-900/30 hover:bg-${btn.color}-100 dark:hover:bg-${btn.color}-900/50 transition-all shadow-md hover:shadow-xl hover:scale-105`}
              >
                <div className={`p-2 bg-${btn.color}-100 dark:bg-${btn.color}-800 rounded-lg`}>
                  <btn.icon className={`w-5 h-5 text-${btn.color}-600 dark:text-${btn.color}-400`} />
                </div>
                <span className={`font-medium text-${btn.color}-700 dark:text-${btn.color}-300`}>{btn.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
