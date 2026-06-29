'use client'

import { useState } from "react";
import { LectureCard } from "@/components/lecture-card";
import { SimpleBarChart } from "@/components/simple-chart";
import { demoLectures, type DemoLecture } from "@/lib/demo-data";
import { appendAudit, saveStoredLectures } from "@/lib/local-demo-store";
import { useStoredLectures } from "@/lib/use-demo-store";

export default function ManagerPage() {
  const lectures = useStoredLectures() as DemoLecture[];
  const [message, setMessage] = useState("");

  const createManagerLecture = () => {
    const next: DemoLecture = {
      ...demoLectures[0],
      id: crypto.randomUUID(),
      title: `Nova palestra do gestor ${lectures.length + 1}`,
      theme: "Tema informado pelo gestor",
      description: "Palestra criada no painel do gestor para demonstracao.",
      contentSummary: "Resumo editavel pelo gestor.",
      status: "draft",
      confirmed: 0,
      pending: 0,
      waitlisted: 0,
      rating: 0,
    };
    saveStoredLectures([next, ...lectures]);
    appendAudit("Gestor Demo", "create_lecture", "lectures", `${next.title} criada pelo gestor`);
    setMessage(`Palestra "${next.title}" criada e salva.`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Painel do gestor de palestras</h1>
      <p className="mt-2 text-slate-600">Cadastro, edicao, publicacao, vinculo de palestrantes e consulta de ocupacao.</p>
      {message && <div className="mt-4 rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{message}</div>}
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold">Nova palestra</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {["Titulo", "Tema", "Descricao", "Resumo", "Categoria", "Data", "Inicio", "Fim", "Duracao", "Sala", "Local", "Capacidade"].map((label) => (
            <input key={label} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder={label} />
          ))}
          <button type="button" onClick={createManagerLecture} className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Salvar palestra</button>
        </div>
      </section>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-4">
          {lectures.map((lecture) => <LectureCard key={lecture.id} lecture={lecture} actionHref="/dashboard/manager" />)}
        </div>
        <section className="h-fit rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Ocupacao</h2>
          <div className="mt-4">
            <SimpleBarChart data={lectures.map((lecture) => ({ label: lecture.title, value: lecture.confirmed }))} />
          </div>
        </section>
      </div>
    </div>
  );
}
