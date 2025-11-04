'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Você saiu da conta')
    } catch (err) {
      toast.error('Erro ao deslogar')
    }
  }

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            TaskFlow
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              Início
            </Link>

            <Link
              href="/dashboard"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/calendar"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              Calendário
            </Link>

            <Link
              href="/dashboard/kanban"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              Kanban
            </Link>

            {/* Botão de tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Alternar tema"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Login / Logout */}
            {user ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {user.displayName ?? user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>

          {/* Botão Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md px-4 py-3 space-y-2">
          <Link href="/" className="block text-gray-700 dark:text-gray-200">
            Início
          </Link>

          <Link
            href="/dashboard"
            className="block text-gray-700 dark:text-gray-200"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/calendar"
            className="block text-gray-700 dark:text-gray-200"
          >
            Calendário
          </Link>

          <Link
            href="/dashboard/kanban"
            className="block text-gray-700 dark:text-gray-200"
          >
            Kanban
          </Link>

          <button
            onClick={toggleTheme}
            className="block w-full text-left text-gray-700 dark:text-gray-200"
          >
            {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
          </button>

          {user ? (
            <>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                {user.displayName ?? user.email}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block bg-blue-600 text-white text-center px-4 py-2 rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
