'use client'

import { useEffect, useState } from 'react'
import { useUserRole } from '@/lib/use-user-role'
import { getPermissions } from '@/lib/rbac'
import { ClientOnly } from '@/components/client-only'
import { ProtectedPage } from '@/components/protected-page'
import { demoEnrollments, demoLectures, type DemoEnrollment, type DemoLecture } from '@/lib/demo-data'
import { loadStoredEnrollments, loadStoredLectures } from '@/lib/adapters/supabase-adapter'
import { StatusBadge } from '@/components/status-badge'

export default function ParticipantDashboard() {
  const role = useUserRole()
  const permissions = getPermissions(role as any)
  const [enrollments, setEnrollments] = useState<DemoEnrollment[]>([])
  const [lectures, setLectures] = useState<DemoLecture[]>([])
  const [requestedLecture, setRequestedLecture] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const enrolled = await loadStoredEnrollments()
        const allLectures = await loadStoredLectures()
        
        // Filtrar apenas inscrições do participante (demo)
        const participantEnrollments = enrolled.filter(e => 
          e.status === 'confirmed' || e.status === 'pending' || e.status === 'waitlisted'
        )
        
        setEnrollments([...participantEnrollments])
        setLectures([...allLectures.filter(l => l.status === 'published')])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    loadData()
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleRequestEnrollment = (lectureId: string) => {
    setRequestedLecture(lectureId)
    // TODO: Chamar API para registrar inscrição
    setTimeout(() => setRequestedLecture(null), 2000)
  }

  if (!permissions.canRequestEnrollment) {
    return (
      <ProtectedPage requiredPermission={(r) => getPermissions(r).canRequestEnrollment}>
        <div>Carregando...</div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage requiredPermission={(r) => getPermissions(r).canRequestEnrollment}>
      <div>
        <h1 className="text-3xl font-bold">Painel do Participante</h1>
        <p className="mt-2 text-slate-600">Solicite inscrição em palestras e acompanhe seu status.</p>

        <ClientOnly>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Minhas Inscrições */}
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold">Minhas Inscrições</h2>
              {enrollments.length === 0 ? (
                <p className="mt-4 text-slate-600">Você ainda não se inscreveu em nenhuma palestra.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {enrollments.map((enrollment) => {
                    const lecture = lectures.find(l => l.id === enrollment.lectureId)
                    return (
                      <div key={enrollment.id} className="rounded-md border border-slate-200 p-3">
                        <p className="font-semibold">{lecture?.title}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-slate-600">{lecture?.date}</p>
                          <StatusBadge status={enrollment.status} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Palestras Disponíveis */}
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold">Palestras Disponíveis</h2>
              <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                {lectures.map((lecture) => {
                  const isEnrolled = enrollments.some(e => e.lectureId === lecture.id)
                  return (
                    <div key={lecture.id} className="rounded-md border border-slate-200 p-3">
                      <p className="font-semibold">{lecture.title}</p>
                      <p className="text-sm text-slate-600">{lecture.date} - {lecture.startTime}</p>
                      <button
                        onClick={() => handleRequestEnrollment(lecture.id)}
                        disabled={isEnrolled || requestedLecture === lecture.id}
                        className={`mt-2 rounded px-3 py-1 text-xs font-semibold transition-colors ${
                          isEnrolled
                            ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                            : requestedLecture === lecture.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isEnrolled ? 'Inscrito' : requestedLecture === lecture.id ? 'Solicitando...' : 'Solicitar Inscrição'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </ClientOnly>
      </div>
    </ProtectedPage>
  )
}
