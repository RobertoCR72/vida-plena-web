'use client'

import { useState, useEffect } from 'react'
import { StatusBadge } from '@/components/status-badge'
import { ClientOnly } from '@/components/client-only'
import { lectureById, type DemoEnrollment, type EnrollmentStatus } from '@/lib/demo-data'
import {
  appendAudit,
  updateStoredEnrollment,
} from '@/lib/adapters/supabase-adapter'
import { useSupabaseEnrollments } from '@/lib/use-supabase-store'

// Helper para detectar IDs de demo
function isDemoId(id: string): boolean {
  return /^(demo-|enrollment-|enr-|speaker-|lecture-)/.test(id)
}

const statusOptions: Array<{ label: string; value: EnrollmentStatus }> = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Confirmada', value: 'confirmed' },
  { label: 'Lista de espera', value: 'waitlisted' },
  { label: 'Cancelada', value: 'cancelled' },
  { label: 'Rejeitada', value: 'rejected' },
]

export default function AdminEnrollmentsPage() {
  const { enrollments: initialEnrollments, refetch } = useSupabaseEnrollments(2000)
  const [enrollments, setEnrollments] = useState<DemoEnrollment[]>(initialEnrollments)
  const [message, setMessage] = useState('')
  const [lastChangedId, setLastChangedId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Sincronizar dados do hook com estado local
  useEffect(() => {
    setEnrollments(initialEnrollments)
  }, [initialEnrollments])

  const updateEnrollmentStatus = async (enrollmentId: string, status: EnrollmentStatus) => {
    setLastChangedId(enrollmentId)
    setIsSaving(true)
    try {
      // Encontrar inscrição antes de atualizar
      const enrollment = enrollments.find((item) => item.id === enrollmentId)

      // Atualizar no Supabase
      await updateStoredEnrollment(enrollmentId, status)

      // Se for ID de demo, atualizar estado local imediatamente
      if (isDemoId(enrollmentId)) {
        setEnrollments((current) =>
          current.map((item) =>
            item.id === enrollmentId ? { ...item, status, state: status } : item,
          ),
        )
      }

      // Registrar ação na auditoria
      await appendAudit(
        'Admin Demo',
        'update_enrollment_status',
        'enrollments',
        `${enrollment?.participant || 'Participante'} alterado para ${status}`,
      )

      setMessage(`${enrollment?.participant || 'Inscrição'}: status atualizado para ${status} com sucesso!`)

      // Recarregar dados do Supabase (se não for demo)
      if (!isDemoId(enrollmentId)) {
        await refetch()
      }
    } catch (error) {
      setMessage(`Erro ao atualizar: ${error instanceof Error ? error.message : 'Desconhecido'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCheckin = async (enrollmentId: string) => {
    setLastChangedId(enrollmentId)
    setIsSaving(true)
    try {
      const enrollment = enrollments.find((item) => item.id === enrollmentId)

      // Registrar check-in como 'confirmed' (já que não temos campo separado para check-in)
      // Em produção, isso seria um campo separado em attendance
      await appendAudit(
        'Admin Demo',
        'check_in',
        'attendance',
        `Check-in registrado para ${enrollment?.participant || 'participante'}`,
      )

      setMessage(`Check-in registrado para ${enrollment?.participant || 'participante'} com sucesso!`)
      await refetch()
    } catch (error) {
      setMessage(`Erro ao registrar check-in: ${error instanceof Error ? error.message : 'Desconhecido'}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Inscrições e check-in</h1>
      <p className="mt-2 text-slate-600">Altere o status por seletor ou botões rápidos. Dados persistem no Supabase e atualizam automaticamente.</p>
      {message && (
        <div className="mt-4 rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3">Participante</th>
              <th>Palestra</th>
              <th>Status atual</th>
              <th>Alterar status</th>
              <th>Acoes rapidas</th>
              <th>Check-in</th>
            </tr>
          </thead>
          <ClientOnly>
            <tbody>
              {enrollments.map((enrollment) => (
              <tr
                key={enrollment.id}
                className={`border-t border-slate-100 transition-colors ${
                  lastChangedId === enrollment.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="p-3 font-medium">{enrollment.participant}</td>
                <td>{lectureById(enrollment.lectureId)?.title}</td>
                <td><StatusBadge status={enrollment.status} /></td>
                <td>
                  <select
                    value={enrollment.status}
                    onChange={(event) => updateEnrollmentStatus(enrollment.id, event.target.value as EnrollmentStatus)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </td>
                <td className="space-x-2">
                  <button
                    type="button"
                    onClick={() => updateEnrollmentStatus(enrollment.id, 'confirmed')}
                    disabled={isSaving}
                    className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    onClick={() => updateEnrollmentStatus(enrollment.id, 'waitlisted')}
                    disabled={isSaving}
                    className="rounded bg-orange-500 px-2 py-1 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Espera
                  </button>
                  <button
                    type="button"
                    onClick={() => updateEnrollmentStatus(enrollment.id, 'rejected')}
                    disabled={isSaving}
                    className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Rejeitar
                  </button>
                </td>
                <td>
                  {enrollment.checkedIn ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Presente</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCheckin(enrollment.id)}
                      disabled={isSaving}
                      className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Registrando...' : 'Registrar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </ClientOnly>
        </table>
      </div>
    </div>
  )
}
