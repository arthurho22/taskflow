// src/app/dashboard/page.tsx - VERSÃO DEBUG
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TaskService } from '@/services/taskService'
import Link from 'next/link'
import { Plus, ListTodo, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react'

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
    console.log('🔍 Dashboard - User:', user)
    
    if (user) {
      loadStats()
    } else {
      setLoading(false)
      setError('Usuário não autenticado')
    }
  }, [user])

  const loadStats = async () => {
    try {
      console.log('🔄 Carregando stats do Firebase...')
      setError(null)
      
      if (!user) {
        throw new Error('Usuário não disponível')
      }

      const userStats = await TaskService.getUserStats(user.uid)
      console.log('✅ Stats carregados:', userStats)
      setStats(userStats)
      
    } catch (error) {
      console.error('❌ Erro ao carregar stats:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
      
      // Fallback para dados mock
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Conectando ao Firebase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Debug Info - REMOVA DEPOIS */}
        {error && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800">
              <strong>Aviso:</strong> {error} (Usando dados de demonstração)
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Dashboard TaskFlow
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {error ? 'Modo de demonstração' : 'Dados em tempo real do Firebase'}
              </p>
            </div>
            <Link 
              href="/dashboard/kanban"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus size={20} />
              Nova Tarefa
            </Link>
          </div>
        </div>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de Tarefas */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg p-6 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total de Tarefas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-1">Todas as tarefas</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Pendentes */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg p-6 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                <p className="text-sm text-gray-500 mt-1">Aguardando</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Concluídas */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg p-6 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-500 mt-1">Finalizadas</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Vencidas */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg p-6 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-sm text-gray-500 mt-1">Atrasadas</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Progresso Geral */}
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Progresso Geral
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <p className="text-gray-600 dark:text-gray-400">Taxa de Conclusão</p>
              <p className="font-semibold text-blue-600">{progress}%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {stats.completed} de {stats.total} tarefas concluídas
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}