'use client'

import { ReactNode } from 'react'
import { useEffect, useState } from 'react'

/**
 * Wrapper para renderizar componentes apenas no cliente
 * Previne hydration mismatches quando dados variam entre servidor e cliente
 */
export function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <>{children}</>
}
