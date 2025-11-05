'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900">
      <div className="animate-pulse text-center text-gray-600 dark:text-gray-300 text-lg font-medium">
        Redirecionando para o login...
      </div>
    </div>
  )
}
