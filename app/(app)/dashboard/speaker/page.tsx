'use client'

import { useEffect, useState } from 'react'
import { useUserRole } from '@/lib/use-user-role'
import { getPermissions } from '@/lib/rbac'
import { ClientOnly } from '@/components/client-only'
import { ProtectedPage } from '@/components/protected-page'
import { demoLectures, demoEnrollments, type DemoLecture, type DemoEnrollment } from '@/lib/demo-data'
import { loadStoredLectures, loadStoredEnrollments } from '@/lib/adapters/supabase-adapter'
import { StatusBadge } from '@/components/status-badge'

export default function SpeakerDashboard() {
  const role = useUserRole()
  const permissions = getPermissions(role as any)
  const [lectures, setLectures] = useState<DemoLecture[]>([])
  const [enrollments, setEnrollments] = useState<DemoEnrollment[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const allLectures = await loadStoredLectures()
        const allEnrollments = await loadStoredEnrollments()
        
        // Para demo: mostrar todas as palestras como do palestrante
        setLectures([...allLectures])
        setEnrollments([...allEnrollments])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    loadData()
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!permissions.canEditOwnLectures) {
    return (
      <ProtectedPage requiredPermission={(r) => getPermissions(r).canEditOwnLectures}>
        <div>Carregando...</div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage requiredPermission={(r) => getPermissions(r).canEditOwnLectures}>
      <div>
        <h1 className="text-3xl font-bold">Painel do Palestrante</h1>
        <p className="mt-2 text-slate-600">Gerencie suas palestras e acompanhe as inscrições.</p>

        <ClientOnly>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Minhas Palestras */}
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold">Minhas Palestras</h2>
              {lectures.length === 0 ? (
                <p className="mt-4 text-slate-600">Você ainda não criou nenhuma palestra.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {lectures.map((lecture) => (
                    <div key={lecture.id} className="rounded-md border border-slate-200 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{lecture.title}</p>
                          <p className="text-sm text-slate-600">{lecture.date} - {lecture.startTime}</p>
                        </div>
                        <StatusBadge status={lecture.status} />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700">
                          Editar
                        </button>
                        <button className="rounded bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">
                          Visualizar Inscritos
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="mt-4 rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                + Criar Nova Palestra
              </button>
            </section>

            {/* Estatísticas de Inscrições */}
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold">Inscrições</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm text-slate-600">Total de Inscritos</p>
                  <p className="text-2xl font-bold text-slate-900">{enrollments.length}</p>
                </div>
                <div className="rounded-md bg-green-50 p-3">
                  <p className="text-sm text-green-600">Confirmados</p>
                  <p className="text-2xl font-bold text-green-900">
                    {enrollments.filter(e => e.status === 'confirmed').length}
                  </p>
                </div>
                <div className="rounded-md bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {enrollments.filter(e => e.status === 'pending').length}
                  </p>
                </div>
                <div className="rounded-md bg-orange-50 p-3">
                  <p className="text-sm text-orange-600">Lista de Espera</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {enrollments.filter(e => e.status === 'waitlisted').length}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ClientOnly>
      </div>
    </ProtectedPage>
  )
}
