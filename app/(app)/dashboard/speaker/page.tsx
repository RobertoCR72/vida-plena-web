'use client'

import { ScheduleTimeline } from "@/components/schedule-timeline";
import { StatusBadge } from "@/components/status-badge";
import { demoEnrollments, demoLectures } from "@/lib/demo-data";

export default function SpeakerPage() {
  const myLectures = demoLectures.filter((lecture) => lecture.speakers.includes("Rafael Lima"));
  const confirmed = demoEnrollments.filter((enrollment) => enrollment.status === "confirmed");

  return (
    <div>
      <h1 className="text-3xl font-bold">Painel do palestrante</h1>
      <p className="mt-2 text-slate-600">Status de aprovacao, minhas palestras, inscritos confirmados e cronograma.</p>
      <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
        Status de acesso: <strong>aprovado</strong>. Palestrantes pendentes seriam redirecionados para a tela de aguardando aprovacao.
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Minhas palestras</h2>
          <div className="mt-4 grid gap-3">
            {myLectures.map((lecture) => (
              <div key={lecture.id} className="rounded-md border border-slate-200 p-4">
                <div className="flex justify-between gap-3"><strong>{lecture.title}</strong><StatusBadge status={lecture.status} /></div>
                <p className="mt-2 text-sm text-slate-600">{lecture.contentSummary}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Resumo operacional</h2>
          <p className="mt-2 text-sm text-slate-600">
            O envio de arquivos foi removido para simplificar o sistema e o banco de dados.
          </p>
          <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
            Palestras vinculadas: {myLectures.length}
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold">Inscritos confirmados nas minhas palestras</h2>
        <div className="mt-4 grid gap-2">
          {confirmed.map((enrollment) => <p key={enrollment.id} className="rounded bg-slate-50 p-3 text-sm">{enrollment.participant} - {enrollment.email}</p>)}
        </div>
      </section>
      <div className="mt-6">
        <ScheduleTimeline lectures={myLectures} />
      </div>
    </div>
  );
}
