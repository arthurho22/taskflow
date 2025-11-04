'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Nome */}
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            TaskFlow
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
              Início
            </Link>
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
              Dashboard
            </Link>
            <Link href="/tarefas" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
              Tarefas
            </Link>

            {/* Botão tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Alternar tema"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-800" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>

            {/* Botão login */}
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md px-4 py-3 space-y-2">
          <Link href="/" className="block text-gray-700 dark:text-gray-200 hover:text-blue-500">
            Início
          </Link>
          <Link href="/dashboard" className="block text-gray-700 dark:text-gray-200 hover:text-blue-500">
            Dashboard
          </Link>
          <Link href="/tarefas" className="block text-gray-700 dark:text-gray-200 hover:text-blue-500">
            Tarefas
          </Link>
          <button
            onClick={toggleTheme}
            className="block w-full text-left text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
          </button>
          <Link
            href="/login"
            className="block bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  )
}
