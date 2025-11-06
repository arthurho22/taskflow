import './globals.css'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/navbar'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/hooks/useAuth'

export const metadata = { title: 'TaskFlow' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system">
          <AuthProvider> {/* ← envolver toda a app */}
            <Navbar />
            <div className="pt-16 px-4 sm:px-8">{children}</div>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
