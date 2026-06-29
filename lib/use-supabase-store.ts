'use client'

/**
 * Hooks que usam Supabase em vez de localStorage
 * Compatíveis com async/await e real-time updates
 */

import { useEffect, useState } from 'react'
import { loadStoredLectures, loadStoredEnrollments, loadStoredSpeakers, loadAuditLogs } from '@/lib/adapters/supabase-adapter'
import { demoLectures, demoEnrollments, demoSpeakers, demoAuditLogs } from '@/lib/demo-data'
import { mergeEnrollmentsWithChanges, mergeSpeakersWithChanges, mergeLecturesWithChanges } from '@/lib/demo-persistence'
import type { DemoLecture, DemoEnrollment } from '@/lib/demo-data'

/**
 * Hook para carregar palestras do Supabase com fallback para localStorage
 * Auto-atualiza a cada 2 segundos
 */
export function useSupabaseLectures(autoRefreshMs = 2000) {
  const [lectures, setLectures] = useState<DemoLecture[]>(() => mergeLecturesWithChanges(demoLectures))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await loadStoredLectures()
        const merged = mergeLecturesWithChanges(data || demoLectures)
        setLectures(merged)
        setError(null)
      } catch (err) {
        console.error('Erro ao carregar palestras:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    load()

    if (autoRefreshMs > 0) {
      const interval = setInterval(load, autoRefreshMs)
      return () => clearInterval(interval)
    }
  }, [autoRefreshMs])

  return { lectures, loading, error, refetch: async () => {
    const data = await loadStoredLectures()
    const merged = mergeLecturesWithChanges(data || demoLectures)
    setLectures(merged)
  } }
}

/**
 * Hook para carregar inscrições do Supabase
 */
export function useSupabaseEnrollments(autoRefreshMs = 2000) {
  const [enrollments, setEnrollments] = useState<DemoEnrollment[]>(() => mergeEnrollmentsWithChanges(demoEnrollments))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await loadStoredEnrollments()
        const merged = mergeEnrollmentsWithChanges(data || demoEnrollments)
        setEnrollments(merged)
        setError(null)
      } catch (err) {
        console.error('Erro ao carregar inscrições:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    load()

    if (autoRefreshMs > 0) {
      const interval = setInterval(load, autoRefreshMs)
      return () => clearInterval(interval)
    }
  }, [autoRefreshMs])

  return { enrollments, loading, error, refetch: async () => {
    const data = await loadStoredEnrollments()
    const merged = mergeEnrollmentsWithChanges(data || demoEnrollments)
    setEnrollments(merged)
  } }
}

/**
 * Hook para carregar palestrantes do Supabase
 */
export function useSupabaseSpeakers(autoRefreshMs = 2000) {
  const [speakers, setSpeakers] = useState<any[]>(() => mergeSpeakersWithChanges(demoSpeakers))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await loadStoredSpeakers()
        const merged = mergeSpeakersWithChanges(data || demoSpeakers)
        setSpeakers(merged)
        setError(null)
      } catch (err) {
        console.error('Erro ao carregar palestrantes:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    load()

    if (autoRefreshMs > 0) {
      const interval = setInterval(load, autoRefreshMs)
      return () => clearInterval(interval)
    }
  }, [autoRefreshMs])

  return { speakers, loading, error, refetch: async () => {
    const data = await loadStoredSpeakers()
    const merged = mergeSpeakersWithChanges(data || demoSpeakers)
    setSpeakers(merged)
  } }
}

/**
 * Hook para carregar logs de auditoria do Supabase
 */
export function useSupabaseAuditLogs() {
  const [logs, setLogs] = useState(demoAuditLogs)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await loadAuditLogs()
        setLogs(data || demoAuditLogs)
        setError(null)
      } catch (err) {
        console.error('Erro ao carregar auditoria:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { logs, loading, error, refetch: async () => {
    const data = await loadAuditLogs()
    setLogs(data || demoAuditLogs)
  } }
}
