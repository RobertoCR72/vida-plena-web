'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupInput } from '@/lib/validations/schemas'
import { dashboardPathForDemoUser, loginDemoUser, registerDemoUser } from '@/lib/local-demo-store'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'participant',
      terms: false,
    },
  })

  const onSubmit = (data: SignupInput) => {
    setError('')
    setSuccess('')
    try {
      registerDemoUser({
        fullName: data.full_name,
        email: data.email,
        password: data.password,
        phoneWhatsapp: data.phone_whatsapp,
        city: data.city,
        state: data.state,
        role: data.role,
      })

      setSuccess('Conta criada com sucesso. Entrando automaticamente...')
      const loggedUser = loginDemoUser(data.email, data.password)
      router.push(dashboardPathForDemoUser(loggedUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro</h1>
        <p className="text-gray-600 mb-6">Crie sua conta para começar</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input {...register('full_name')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Seu nome" />
            {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input {...register('email')} type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="seu@email.com" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input {...register('password')} type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Sua senha" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
            <input {...register('city')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="São Paulo" />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <input {...register('state')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="SP" />
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone/WhatsApp</label>
            <input {...register('phone_whatsapp')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="(11) 99999-9999" />
            {errors.phone_whatsapp && <p className="text-red-500 text-sm mt-1">{errors.phone_whatsapp.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
            <select {...register('role')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="participant">Inscrito / Participante</option>
              <option value="speaker">Palestrante</option>
            </select>
          </div>

          <div className="flex items-start">
            <input {...register('terms')} type="checkbox" className="mt-1" />
            <label className="ml-2 text-sm text-gray-600">Concordo com os termos de uso e LGPD</label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Já tem conta? <Link href="/login" className="text-indigo-600 hover:underline">Faça login</Link>
        </p>
      </div>
    </div>
  )
}
