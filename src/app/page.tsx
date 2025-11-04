'use client'

import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 px-6">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          TaskFlow 📋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Gerencie suas tarefas de forma simples e eficiente.
        </p>

        {user ? (
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Ir para o Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Fazer Login
          </Link>
        )}
      </div>
    </main>
  )
}
