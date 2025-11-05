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
  Sparkles
} from 'lucide-react'

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
      
      // Fallback mock
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900 p-6">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <Sparkles className="absolute top-1/2 left-1/2 w-6 h-6 text-blue-500 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Carregando seu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Bem-vindo de volta! {error && '(Modo demonstração)'}
            </p>
          </div>

          <Link 
            href="/dashboard/kanban"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 transform"
          >
            <Plus size={20} /> Nova Tarefa
          </Link>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total de Tarefas', value: stats.total, icon: <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-300" />, gradient: 'from-blue-500 to-blue-600' },
            { title: 'Pendentes', value: stats.pending, icon: <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />, gradient: 'from-orange-500 to-amber-600' },
            { title: 'Concluídas', value: stats.completed, icon: <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-300" />, gradient: 'from-green-500 to-emerald-600' },
            { title: 'Vencidas', value: stats.overdue, icon: <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />, gradient: 'from-red-500 to-rose-600' },
          ].map((card, idx) => (
            <div key={idx} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}></div>
              <div className="relative rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl p-6 border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                  </div>
                  <div className="p-3 bg-white/30 dark:bg-gray-700/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progresso */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { title: 'Progresso Geral', value: progress, color: 'from-blue-500 to-indigo-600', icon: <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" /> },
            { title: 'Esta Semana', value: weeklyProgress, color: 'from-purple-500 to-pink-600', icon: <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" /> },
          ].map((prog, idx) => (
            <div key={idx} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${prog.color} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}></div>
              <div className="relative rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl p-6 border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{prog.title}</h3>
                  <div className="p-2 bg-white/30 dark:bg-gray-700/30 rounded-lg">{prog.icon}</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Progresso</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{prog.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${prog.color}`}
                      style={{ width: `${prog.value}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ações rápidas */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl p-6 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Ações Rápidas</h3>
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/kanban" className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 group hover:scale-105 transform flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg"><ListTodo className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Ver Kanban</span>
              </Link>
              <Link href="/dashboard/calendar" className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200 group hover:scale-105 transform flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg"><Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" /></div>
                <span className="font-medium text-purple-700 dark:text-purple-300">Calendário</span>
              </Link>
              <Link href="/dashboard/tasks" className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-200 group hover:scale-105 transform flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg"><CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" /></div>
                <span className="font-medium text-green-700 dark:text-green-300">Lista de Tarefas</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
