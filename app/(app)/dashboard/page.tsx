'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardCard } from "@/components/dashboard-card"
import { SimpleBarChart } from "@/components/simple-chart"
import { ClientOnly } from "@/components/client-only"
import { dashboardMetrics, demoEnrollments, demoLectures, type DemoEnrollment, type DemoLecture } from "@/lib/demo-data"
import { loadStoredEnrollments, loadStoredLectures } from '@/lib/adapters/supabase-adapter'

export default function DashboardHome() {
  const [enrollments, setEnrollments] = useState<DemoEnrollment[]>(demoEnrollments)
  const [lectures, setLectures] = useState<DemoLecture[]>(demoLectures)

  // Carregar dados e configurar auto-refresh
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedEnrollments = await loadStoredEnrollments()
        const storedLectures = await loadStoredLectures()

        setEnrollments([...storedEnrollments])
        setLectures([...storedLectures])
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      }
    }

    loadData()

    // Recarregar dados a cada 2 segundos
    const interval = setInterval(loadData, 2000)

    return () => clearInterval(interval)
  }, [])

  const publishedLectures = lectures.filter((lecture) => lecture.status === "published").length

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Visao geral</h1>
      <p className="mt-2 text-slate-600">Entrada rapida para demonstrar cada perfil da Vida Plena Eventos.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {dashboardMetrics.slice(0, 4).map((metric) => <DashboardCard key={metric.label} {...metric} />)}
      </div>
      <ClientOnly>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold">Inscricoes por status</h2>
            <div className="mt-4">
              <SimpleBarChart data={[
                { label: "Pendentes", value: enrollments.filter((item) => item.status === "pending").length, color: "#d97706" },
                { label: "Confirmadas", value: enrollments.filter((item) => item.status === "confirmed").length, color: "#059669" },
                { label: "Lista de espera", value: enrollments.filter((item) => item.status === "waitlisted").length, color: "#ea580c" },
                { label: "Rejeitadas", value: enrollments.filter((item) => item.status === "rejected").length, color: "#dc2626" },
              ]} />
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold">Fluxos de demonstracao</h2>
            <div className="mt-4 grid gap-2">
              {[
                ["/dashboard/admin", "Administrador"],
                ["/dashboard/manager", "Gestor de palestras"],
                ["/dashboard/speaker", "Palestrante"],
                ["/dashboard/participant", "Participante"],
                ["/dashboard/schedule", "Cronograma com conflito"],
              ].map(([href, label]) => (
                <Link key={href} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" href={href}>{label}</Link>
              ))}
            </div>
          </section>
        </div>
      </ClientOnly>
      <ClientOnly>
        <p className="mt-6 text-sm text-slate-500">Palestras publicadas: {publishedLectures}</p>
      </ClientOnly>
    </div>
  )
}
