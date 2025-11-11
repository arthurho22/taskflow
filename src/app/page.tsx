'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900 text-gray-900 dark:text-gray-100">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center flex-1 px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Gerencie Suas Tarefas com Estilo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-2xl text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10"
        >
          Simplifique seu dia a dia com o nosso <strong>TaskFlow!</strong> — um gestor moderno,
          prático e totalmente integrado. Organize, acompanhe e conclua suas metas, venha conhecer!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/register"
            className="px-8 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 justify-center"
          >
            Começar Agora <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 rounded-xl border-2 border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
          >
            Já Tenho Conta
          </Link>
        </motion.div>
      </section>

      {/* Call to Action / Features */}
      <section className="py-16 bg-white/70 dark:bg-gray-900/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Por que usar o TaskFlow?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              { icon: <CheckCircle className="w-8 h-8 text-blue-600" />, text: 'Organização intuitiva e visual com Kanban' },
              { icon: <CheckCircle className="w-8 h-8 text-purple-600" />, text: 'Calendário integrado para planejar suas metas' },
              { icon: <CheckCircle className="w-8 h-8 text-indigo-600" />, text: 'Acessível, moderno e responsivo' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-center mb-3">{item.icon}</div>
                <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-white/20 text-gray-600 dark:text-gray-400 bg-white/40 dark:bg-gray-950/50 backdrop-blur-md">
        <p>
          © {new Date().getFullYear()} <strong>TaskFlow</strong>. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
