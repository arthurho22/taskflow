'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, registerSchema } from '@/schemas/authSchemas'
import { z } from 'zod'
import { auth } from '@/lib/firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginData | RegisterData>({
        resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    })

    const onSubmit = async (data: any) => {
        try {
            if (isRegister) {
                // Cadastro de novo usuário
                const { email, password, name } = data
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                await updateProfile(userCredential.user, { displayName: name })
                toast.success('Conta criada com sucesso!')
            } else {
                // Login de usuário existente
                const { email, password } = data
                await signInWithEmailAndPassword(auth, email, password)
                toast.success('Login realizado com sucesso!')
            }

            reset()
            router.push('/dashboard')
        } catch (error: any) {
            console.error(error)
            const message =
                error.code === 'auth/email-already-in-use'
                    ? 'Este e-mail já está em uso.'
                    : error.code === 'auth/invalid-credential'
                        ? 'E-mail ou senha incorretos.'
                        : 'Erro ao autenticar. Tente novamente.'
            toast.error(message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    {isRegister ? 'Criar conta' : 'Fazer login'}
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Nome</label>
                            <input
                                type="text"
                                {...register('name' as const)}
                                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                            />
                            {'name' in errors && errors.name && (
                                <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
                            )}
                        </div>
                    )}


                    <div>
                        <label className="block text-sm font-medium mb-1">E-mail</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Senha</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                    >
                        {isSubmitting
                            ? 'Carregando...'
                            : isRegister
                                ? 'Cadastrar'
                                : 'Entrar'}
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    {isRegister ? 'Já tem uma conta?' : 'Ainda não tem conta?'}{' '}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {isRegister ? 'Entrar' : 'Cadastrar-se'}
                    </button>
                </p>
            </div>
        </div>
    )
}
