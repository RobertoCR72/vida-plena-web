'use client'

import { useState, useEffect } from 'react'
import type { UserRole } from '@/lib/rbac'

/**
 * Hook para obter o role do usuário atual
 * Por enquanto retorna 'participant' (demo)
 * Será integrado com Supabase Auth depois
 */
export function useUserRole(): UserRole {
  const [role, setRole] = useState<UserRole>('participant')

  useEffect(() => {
    // TODO: Integrar com Supabase Auth
    // const { data } = await supabase.auth.getSession()
    // const userRole = await fetchUserRole(data.user.id)
    // setRole(userRole)

    // Por enquanto: simula diferentes roles baseado em URL ou localStorage
    const stored = localStorage.getItem('demo-user-role')
    if (stored === 'admin' || stored === 'speaker' || stored === 'participant') {
      setRole(stored as UserRole)
    }
  }, [])

  return role
}

/**
 * Define o role do usuário (para demo)
 */
export function setUserRole(role: UserRole) {
  localStorage.setItem('demo-user-role', role)
  window.location.reload()
}
