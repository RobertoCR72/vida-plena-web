'use client'

import { useState, useEffect } from 'react'
import { StatusBadge } from '@/components/status-badge'
import { ClientOnly } from '@/components/client-only'
import {
  appendAudit,
  updateStoredSpeaker,
} from '@/lib/adapters/supabase-adapter'
import { useSupabaseSpeakers } from '@/lib/use-supabase-store'
import type { StoredSpeaker } from '@/lib/local-demo-store'

// Helper para detectar IDs de demo
function isDemoId(id: string): boolean {
  return /^(demo-|enrollment-|enr-|speaker-|lecture-)/.test(id)
}

export default function AdminSpeakersPage() {
  const { speakers: initialSpeakers, refetch } = useSupabaseSpeakers(2000)
  const [speakers, setSpeakers] = useState<StoredSpeaker[]>(initialSpeakers)
  const [message, setMessage] = useState('')
  const [lastChangedId, setLastChangedId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Sincronizar dados do hook com estado local
  useEffect(() => {
    setSpeakers(initialSpeakers)
  }, [initialSpeakers])

  const updateSpeakerStatus = async (speakerId: string, status: StoredSpeaker['status']) => {
    setLastChangedId(speakerId)
    setIsSaving(true)
    try {
      const speaker = speakers.find((item) => item.id === speakerId)

      // Atualizar no Supabase
      await updateStoredSpeaker(speakerId, status)

      // Se for ID de demo, atualizar estado local imediatamente
      if (isDemoId(speakerId)) {
        setSpeakers((current) =>
          current.map((item) =>
            item.id === speakerId ? { ...item, status } : item,
          ),
        )
      }

      // Registrar auditoria
      await appendAudit(
        'Admin Demo',
        status === 'approved' ? 'approve_speaker' : status === 'pending' ? 'mark_speaker_pending' : 'reject_speaker',
        'speakers',
        `${speaker?.name || 'Palestrante'} alterado para ${status}`,
      )

      setMessage(`${speaker?.name || 'Palestrante'}: status atualizado para ${status} com sucesso!`)

      // Recarregar dados do Supabase (se não for demo)
      if (!isDemoId(speakerId)) {
        await refetch()
      }
    } catch (error) {
      setMessage(`Erro ao atualizar: ${error instanceof Error ? error.message : 'Desconhecido'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const notifySpeaker = async (speaker: StoredSpeaker) => {
    setLastChangedId(speaker.id)
    setIsSaving(true)
    try {
      await appendAudit(
        'Admin Demo',
        'notify_speaker',
        'notifications',
        `Notificacao simulada enviada para ${speaker.name} com status ${speaker.status}`,
      )
      setMessage(`Notificacao simulada registrada para ${speaker.name} com sucesso!`)
      await refetch()
    } catch (error) {
      setMessage(`Erro ao notificar: ${error instanceof Error ? error.message : 'Desconhecido'}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Aprovação de palestrantes</h1>
      <p className="mt-2 text-slate-600">Aprove, reprove ou volte cadastros para pendente. Cada alteração fica persistida no Supabase e auditada.</p>
      {message && (
        <div className="mt-4 rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}
      <ClientOnly>
        <div className="mt-6 grid gap-4">
          {speakers.map((speaker) => (
          <div
            key={speaker.id}
            className={`rounded-lg border p-5 transition-colors ${
              lastChangedId === speaker.id ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{speaker.name}</h2>
                <p className="text-sm text-slate-600">
                  {speaker.organization} - {speaker.expertise}
                </p>
              </div>
              <StatusBadge status={speaker.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateSpeakerStatus(speaker.id, 'approved')}
                disabled={isSaving}
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aprovar
              </button>
              <button
                type="button"
                onClick={() => updateSpeakerStatus(speaker.id, 'pending')}
                disabled={isSaving}
                className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pendente
              </button>
              <button
                type="button"
                onClick={() => updateSpeakerStatus(speaker.id, 'rejected')}
                disabled={isSaving}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reprovar
              </button>
              <button
                type="button"
                onClick={() => notifySpeaker(speaker)}
                disabled={isSaving}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Notificar
              </button>
            </div>
          </div>
        ))}
        </div>
      </ClientOnly>
    </div>
  )
}
