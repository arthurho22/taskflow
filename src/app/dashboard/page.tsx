// src/app/dashboard/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, Title, BarChart, DonutChart, Metric, Text, ProgressBar } from '@tremor/react'
import { Calendar, CheckCircle2, Clock, AlertTriangle, Plus, ListTodo, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { TaskService } from '@/services/taskService'
import { TaskStats } from '@/types/task'
import Link from 'next/link'

const chartData = [
  { day: 'Seg', tasks: 4 },
  { day: 'Ter', tasks: 2 },
  { day: 'Qua', tasks: 6 },
  { day: 'Qui', tasks: 3 },
  { day: 'Sex', tasks: 5 },
  { day: 'Sáb', tasks: 1 },
  { day: 'Dom', tasks: 2 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
    completedThisWeek: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    try {
      if (!user) return
      const userStats = await TaskService.getUserStats(user.uid)
      setStats(userStats)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusData = [
    { name: 'Concluídas', value: stats.completed },
    { name: 'Pendentes', value: stats.pending },
    { name: 'Em Andamento', value: stats.total - stats.completed - stats.pending },
  ]

  const priorityData = [
    { name: 'Alta', value: 3 },
    { name: 'Média', value: 2 },
    { name: 'Baixa', value: 1 },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Visão geral do seu progresso e tarefas
              </p>
            </div>
            <Link 
              href="/dashboard/kanban"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Nova Tarefa
            </Link>
          </div>
        </div>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-2xl border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600 dark:text-gray-400">Total de Tarefas</Text>
                <Metric className="text-2xl">{stats.total}</Metric>
                <Text className="text-sm text-gray-500 mt-1">Todas as tarefas</Text>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600 dark:text-gray-400">Pendentes</Text>
                <Metric className="text-2xl text-yellow-600">{stats.pending}</Metric>
                <Text className="text-sm text-gray-500 mt-1">Aguardando</Text>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600 dark:text-gray-400">Concluídas</Text>
                <Metric className="text-2xl text-green-600">{stats.completed}</Metric>
                <Text className="text-sm text-gray-500 mt-1">Finalizadas</Text>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600 dark:text-gray-400">Vencidas</Text>
                <Metric className="text-2xl text-red-600">{stats.overdue}</Metric>
                <Text className="text-sm text-gray-500 mt-1">Atrasadas</Text>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Progresso Geral */}
        <Card className="rounded-2xl border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <Title className="text-lg font-semibold text-gray-800 dark:text-white">
              Progresso Geral
            </Title>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Text className="text-gray-600 dark:text-gray-400">Conclusão</Text>
              <Text className="font-semibold">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </Text>
            </div>
            <ProgressBar 
              value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
              color="blue" 
              className="h-3"
            />
            <Text className="text-xs text-gray-500">
              {stats.completed} de {stats.total} tarefas concluídas
            </Text>
          </div>
        </Card>

        {/* Grid de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Barras - Tarefas por Dia */}
          <Card className="rounded-2xl border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6">
            <Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Produtividade Semanal
            </Title>
            <BarChart
              data={chartData}
              index="day"
              categories={["tasks"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} tarefas`}
              className="h-72"
              showAnimation={true}
            />
          </Card>

          {/* Gráfico de Pizza - Status das Tarefas */}
          <Card className="rounded-2xl border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6">
            <Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Distribuição por Status
            </Title>
            <DonutChart
              data={statusData}
              category="value"
              index="name"
              colors={["green", "yellow", "blue"]}
              valueFormatter={(value) => `${value} tarefas`}
              className="h-72"
              showAnimation={true}
            />
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="rounded-2xl border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Ações Rápidas
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/dashboard/kanban"
              className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg group-hover:scale-110 transition-transform">
                  <ListTodo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <Text className="font-semibold text-blue-700 dark:text-blue-300">Quadro Kanban</Text>
                  <Text className="text-sm text-blue-600 dark:text-blue-400">Organize visualmente</Text>
                </div>
              </div>
            </Link>

            <Link 
              href="/dashboard/calendar"
              className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <Text className="font-semibold text-green-700 dark:text-green-300">Calendário</Text>
                  <Text className="text-sm text-green-600 dark:text-green-400">Visualize prazos</Text>
                </div>
              </div>
            </Link>

            <Link 
              href="/dashboard/kanban"
              className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <Text className="font-semibold text-purple-700 dark:text-purple-300">Nova Tarefa</Text>
                  <Text className="text-sm text-purple-600 dark:text-purple-400">Adicione agora</Text>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}