'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/lib/use-user-role'
import { canAccessPage } from '@/lib/rbac'

interface ProtectedPageProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'speaker' | 'participant' | 'lecture_manager'
  requiredPermission?: (role: any) => boolean
}

/**
 * Wrapper para proteger páginas baseado em role
 */
export function ProtectedPage({
  children,
  requiredRole,
  requiredPermission,
}: ProtectedPageProps) {
  const role = useUserRole()
  const router = useRouter()

  useEffect(() => {
    // Verifica permissão customizada
    if (requiredPermission && !requiredPermission(role)) {
      router.push('/dashboard')
      return
    }

    // Verifica role específico
    if (requiredRole && role !== requiredRole && role !== 'admin') {
      router.push('/dashboard')
      return
    }
  }, [role, requiredRole, requiredPermission, router])

  // Se for admin, sempre renderiza
  if (role === 'admin') {
    return <>{children}</>
  }

  // Se tem permissão, renderiza
  if (requiredPermission && requiredPermission(role)) {
    return <>{children}</>
  }

  if (requiredRole && role === requiredRole) {
    return <>{children}</>
  }

  // Sem permissão: mostra mensagem
  return (
    <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
      <h2 className='text-lg font-bold text-red-900'>Acesso Negado</h2>
      <p className='mt-2 text-red-700'>Você não tem permissão para acessar esta página.</p>
    </div>
  )
}
