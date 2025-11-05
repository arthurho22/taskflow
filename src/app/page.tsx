// src/app/page.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Rocket, Users, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Task
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Flow
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Gerencie suas tarefas de forma simples, visual e eficiente. 
              <span className="block text-blue-300">Produtividade em fluxo contínuo.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/dashboard"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <span className="relative flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Começar Agora
                </span>
              </Link>
              
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-bold hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
              >
                Fazer Login
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              {
                icon: CheckCircle,
                title: "Gestão Completa",
                description: "CRUD completo de tarefas com subtarefas e prioridades"
              },
              {
                icon: BarChart3,
                title: "Dashboard Inteligente",
                description: "Métricas e gráficos para acompanhar seu progresso"
              },
              {
                icon: Users,
                title: "Visualização Multiplataforma",
                description: "Kanban, calendário e listas para cada necessidade"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 TaskFlow. Desenvolvido com Next.js, Tailwind CSS e Firebase.
          </p>
        </div>
      </footer>
    </div>
  )
}