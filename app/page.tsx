import Link from "next/link";
import { CalendarDays, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import { LectureCard } from "@/components/lecture-card";
import { demoLectures } from "@/lib/demo-data";

export default function Home() {
  const published = demoLectures.filter((lecture) => lecture.status === "published").slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-blue-800">Vida Plena Eventos</Link>
          <nav className="flex flex-wrap gap-2">
            <Link className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="/lectures">Palestras</Link>
            <Link className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="/login">Entrar</Link>
            <Link className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800" href="/register">Criar conta</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="font-semibold text-emerald-700">ONG Vida Plena</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Vida Plena Eventos
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Plataforma para organizar palestras comunitarias, aprovar inscricoes, liberar materiais,
            registrar presenca e acompanhar o impacto social das atividades da ONG.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-md bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800" href="/login">Entrar</Link>
            <Link className="rounded-md border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-100" href="/register">Criar conta como participante</Link>
            <Link className="rounded-md border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-800 hover:bg-blue-100" href="/register/speaker">Solicitar cadastro como palestrante</Link>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Perfis com acesso", value: "4", icon: Users },
              { label: "Palestras seed", value: "6", icon: CalendarDays },
              { label: "Acesso protegido", value: "RLS", icon: ShieldCheck },
              { label: "Notificacoes", value: "Simuladas", icon: HeartHandshake },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-slate-50 p-4">
                <item.icon className="h-6 w-6 text-blue-700" />
                <p className="mt-4 text-2xl font-bold text-slate-950">{item.value}</p>
                <p className="text-sm text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Palestras publicadas</h2>
            <p className="mt-1 text-slate-600">Cards publicos com vagas, local, horario e status.</p>
          </div>
          <Link className="text-sm font-semibold text-blue-700 hover:underline" href="/lectures">Ver todas</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {published.map((lecture) => <LectureCard key={lecture.id} lecture={lecture} actionHref="/dashboard/participant" />)}
        </div>
      </section>
    </main>
  );
}
