declare module '*.css'

import './globals.css' 
import { ThemeProvider } from 'next-themes'
import Navbar from '../components/navbar' 
import { ReactNode } from 'react'

export const metadata = {
  title: 'TaskFlow',
  description: 'Gestor de tarefas — TaskFlow',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system">
          <Navbar />
          <div className="pt-16">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
