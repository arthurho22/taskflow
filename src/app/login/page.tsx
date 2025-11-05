"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError("E-mail ou senha inválidos.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          TaskFlow
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Faça login para acessar seu painel
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ainda não tem uma conta?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  )
}
