'use client'

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { LectureCard } from "@/components/lecture-card";
import { ScheduleTimeline } from "@/components/schedule-timeline";
import { StatusBadge } from "@/components/status-badge";
import { demoLectures, type DemoEnrollment } from "@/lib/demo-data";
import { appendAudit } from "@/lib/local-demo-store";
import { useStoredEnrollments } from "@/lib/use-demo-store";

export default function ParticipantPage() {
  const schedule = demoLectures.slice(0, 3);
  const enrollments = useStoredEnrollments() as DemoEnrollment[];
  const [certificateVisible, setCertificateVisible] = useState(false);

  const showCertificate = () => {
    setCertificateVisible(true);
    appendAudit("Participante Demo", "view_certificate", "certificates", "Certificado simples visualizado");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Painel do participante</h1>
      <p className="mt-2 text-slate-600">Palestras disponiveis, inscricoes, cronograma, avaliacao e certificado.</p>
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-lg font-bold">Minhas inscricoes</h2>
          <div className="mt-4 grid gap-3">
            {enrollments.slice(0, 4).map((enrollment) => (
              <div key={enrollment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 p-3">
                <span className="font-medium">{demoLectures.find((lecture) => lecture.id === enrollment.lectureId)?.title}</span>
                <StatusBadge status={enrollment.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <GraduationCap className="h-7 w-7 text-blue-700" />
          <h2 className="mt-3 text-lg font-bold">Certificado simples</h2>
          <p className="mt-2 text-sm text-slate-600">Disponivel quando a presenca estiver confirmada.</p>
          <button type="button" onClick={showCertificate} className="mt-4 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold">Visualizar certificado</button>
          {certificateVisible && (
            <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-900">
              Certificamos a participacao de Ana Souza em atividade da ONG Vida Plena. Codigo: VP-DEMO-001.
            </div>
          )}
        </div>
      </section>
      <section className="mt-6">
        <h2 className="mb-4 text-xl font-bold">Palestras disponiveis</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          {demoLectures.filter((lecture) => lecture.status === "published").slice(0, 4).map((lecture) => <LectureCard key={lecture.id} lecture={lecture} actionHref="/dashboard/participant" />)}
        </div>
      </section>
      <section className="mt-6">
        <h2 className="mb-4 text-xl font-bold">Cronograma pessoal</h2>
        <ScheduleTimeline lectures={schedule} />
      </section>
    </div>
  );
}
