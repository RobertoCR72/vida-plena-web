'use client'

import { useState } from "react"
import { useUserRole } from "@/lib/use-user-role"
import { getPermissions } from "@/lib/rbac"
import { ProtectedPage } from "@/components/protected-page"
import { LectureCard } from "@/components/lecture-card"
import { SimpleBarChart } from "@/components/simple-chart"
import { demoLectures, type DemoLecture } from "@/lib/demo-data"

export default function SpeakerDashboard() {
  const role = useUserRole()
  const permissions = getPermissions(role as any)
  const lectures = demoLectures as DemoLecture[]
  const [message, setMessage] = useState("")

  const createSpeakerLecture = () => {
    const next: DemoLecture = {
      ...demoLectures[0],
      id: crypto.randomUUID(),
      title: `Nova palestra do palestrante ${lectures.length + 1}`,
      theme: "Tema informado pelo palestrante",
      description: "Palestra criada no painel do palestrante para demonstração.",
      contentSummary: "Resumo editável pelo palestrante.",
      status: "draft",
      confirmed: 0,
      pending: 0,
      waitlisted: 0,
      rating: 0,
    }
    setMessage(`Palestra "${next.title}" criada e salva.`)
  }

  return (
    <ProtectedPage requiredPermission={(r) => getPermissions(r).canEditOwnLectures}>
      <div>
        <h1 className="text-3xl font-bold">Painel do Palestrante</h1>
        <p className="mt-2 text-slate-600">Cadastro, edição, publicação e consulta de inscrições de suas palestras.</p>
        {message && <div className="mt-4 rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{message}</div>}

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Nova palestra</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {["Título", "Tema", "Descrição", "Resumo", "Categoria", "Data", "Início", "Fim", "Duração", "Sala", "Local", "Capacidade"].map((label) => (
              <input key={label} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder={label} />
            ))}
            <button type="button" onClick={createSpeakerLecture} className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Salvar palestra</button>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="grid gap-4">
            {lectures.map((lecture) => (
              <LectureCard key={lecture.id} lecture={lecture} actionHref="/dashboard/speaker" />
            ))}
          </div>
          <section className="h-fit rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold">Ocupação</h2>
            <div className="mt-4">
              <SimpleBarChart data={lectures.map((lecture) => ({ label: lecture.title, value: lecture.confirmed }))} />
            </div>
          </section>
        </div>
      </div>
    </ProtectedPage>
  )
}
