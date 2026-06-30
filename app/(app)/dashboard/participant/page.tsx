'use client'

import { useState } from "react"
import { useUserRole } from "@/lib/use-user-role"
import { getPermissions } from "@/lib/rbac"
import { ProtectedPage } from "@/components/protected-page"
import { LectureCard } from "@/components/lecture-card"
import { SimpleBarChart } from "@/components/simple-chart"
import { demoLectures, type DemoLecture } from "@/lib/demo-data"

export default function ParticipantDashboard() {
  const role = useUserRole()
  const permissions = getPermissions(role as any)
  const lectures = demoLectures as DemoLecture[]
  const [message, setMessage] = useState("")

  return (
    <ProtectedPage requiredPermission={(r) => getPermissions(r).canRequestEnrollment}>
      <div>
        <h1 className="text-3xl font-bold">Painel do Participante</h1>
        <p className="mt-2 text-slate-600">Consulte palestras publicadas e solicite inscrição.</p>
        {message && <div className="mt-4 rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{message}</div>}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="grid gap-4">
            {lectures.filter(l => l.status === 'published').map((lecture) => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                actionHref="/dashboard/participant"
              />
            ))}
          </div>
          <section className="h-fit rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold">Palestras por tema</h2>
            <div className="mt-4">
              <SimpleBarChart
                data={Array.from(
                  new Map(
                    lectures
                      .filter(l => l.status === 'published')
                      .map(l => [l.theme, (lectures.filter(x => x.theme === l.theme && x.status === 'published').length)])
                  )
                ).map(([theme, count]) => ({ label: theme, value: count }))}
              />
            </div>
          </section>
        </div>
      </div>
    </ProtectedPage>
  )
}
