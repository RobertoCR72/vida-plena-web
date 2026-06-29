'use client'

import { useEffect, useState } from 'react'
import { SimpleBarChart } from "@/components/simple-chart";
import { StatusBadge } from "@/components/status-badge";
import { ClientOnly } from "@/components/client-only";
import { demoEnrollments, demoLectures, demoSpeakers, type DemoEnrollment, type DemoLecture } from "@/lib/demo-data";
import { loadStoredEnrollments, loadStoredLectures, loadStoredSpeakers } from '@/lib/adapters/supabase-adapter';
import type { StoredSpeaker } from '@/lib/local-demo-store';

export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState<DemoEnrollment[]>(demoEnrollments)
  const [lectures, setLectures] = useState<DemoLecture[]>(demoLectures)
  const [speakers, setSpeakers] = useState<any[]>(demoSpeakers as any[])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Carregar dados do Supabase ao montar e configurar auto-refresh
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedEnrollments = await loadStoredEnrollments()
        const storedLectures = await loadStoredLectures()
        const storedSpeakers = await loadStoredSpeakers()

        // Forçar atualização com cópia dos arrays para garantir detecção de mudanças
        setEnrollments([...storedEnrollments])
        setLectures([...storedLectures])
        setSpeakers([...storedSpeakers])
        setLastUpdate(new Date())
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      }
    }

    // Carregar imediatamente
    loadData()

    // Recarregar dados a cada 2 segundos
    const interval = setInterval(loadData, 2000)

    return () => clearInterval(interval)
  }, [])

  // Calcular métricas dinamicamente
  const metrics = [
    {
      label: 'Palestras',
      value: lectures.length.toString(),
      icon: '📚',
    },
    {
      label: 'Participantes',
      value: new Set(enrollments.map(e => e.participant)).size.toString(),
      icon: '👥',
    },
    {
      label: 'Palestrantes',
      value: speakers.length.toString(),
      icon: '🎤',
    },
    {
      label: 'Pendências',
      value: enrollments.filter(e => e.status === 'pending').length.toString(),
      icon: '⏳',
    },
    {
      label: 'Confirmadas',
      value: enrollments.filter(e => e.status === 'confirmed').length.toString(),
      icon: '✅',
    },
    {
      label: 'Check-ins',
      value: enrollments.filter(e => e.checkedIn).length.toString(),
      icon: '📍',
    },
    {
      label: 'Avaliação média',
      value: '4.6',
      icon: '⭐',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Dashboard administrativo</h1>
      <p className="mt-2 text-slate-600">Metricas, aprovacoes, ocupacao, check-in, notificacoes e auditoria. (Atualizado há {Math.round((new Date().getTime() - lastUpdate.getTime()) / 1000)}s)</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{metric.value}</p>
              </div>
              <div className="text-2xl">{metric.icon}</div>
            </div>
          </div>
        ))}
      </div>
      <ClientOnly>
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold">Ocupacao por palestra</h2>
            <div className="mt-4">
              <SimpleBarChart data={lectures.map((lecture) => ({ label: lecture.title, value: lecture.confirmed }))} />
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold">Palestrantes</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-500"><tr><th className="py-2">Nome</th><th>Area</th><th>Status</th></tr></thead>
                <tbody>
                  {speakers.map((speaker) => (
                    <tr key={speaker.id} className="border-t border-slate-100">
                      <td className="py-3 font-medium">{speaker.name}</td>
                      <td>{speaker.expertise}</td>
                      <td><StatusBadge status={speaker.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </ClientOnly>
      <ClientOnly>
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Inscricoes recentes</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-2">Participante</th><th>Palestra</th><th>Estado</th><th>Status</th><th>Check-in</th></tr></thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-t border-slate-100">
                    <td className="py-3 font-medium">{enrollment.participant}</td>
                    <td>{lectures.find((lecture) => lecture.id === enrollment.lectureId)?.title}</td>
                    <td>{enrollment.state}</td>
                    <td><StatusBadge status={enrollment.status} /></td>
                    <td>{enrollment.checkedIn ? "Presente" : "Pendente"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ClientOnly>
    </div>
  );
}
