'use client'

import Protected from '@/components/protected'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  )
}

function DashboardContent() {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Você saiu da conta com sucesso!')
    } catch (err) {
      toast.error('Erro ao deslogar')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Bem-vindo{user?.displayName ? `, ${user.displayName}` : ''} 👋
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Sair
          </button>
        </div>

        <div className="border-t pt-4 text-gray-700 dark:text-gray-300">
          <p>
            Aqui vai aparecer sua <strong>lista de tarefas</strong> 🎯
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            (essa parte será implementada na próxima fase — Firestore + CRUD)
          </p>
        </div>
      </div>
    </div>
  )
}
