import Link from "next/link";
import { DashboardCard } from "@/components/dashboard-card";
import { SimpleBarChart } from "@/components/simple-chart";
import { dashboardMetrics, demoEnrollments, demoLectures } from "@/lib/demo-data";

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Visao geral</h1>
      <p className="mt-2 text-slate-600">Entrada rapida para demonstrar cada perfil da Vida Plena Eventos.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {dashboardMetrics.slice(0, 4).map((metric) => <DashboardCard key={metric.label} {...metric} />)}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Inscricoes por status</h2>
          <div className="mt-4">
            <SimpleBarChart data={[
              { label: "Pendentes", value: demoEnrollments.filter((item) => item.status === "pending").length, color: "#d97706" },
              { label: "Confirmadas", value: demoEnrollments.filter((item) => item.status === "confirmed").length, color: "#059669" },
              { label: "Lista de espera", value: demoEnrollments.filter((item) => item.status === "waitlisted").length, color: "#ea580c" },
              { label: "Rejeitadas", value: demoEnrollments.filter((item) => item.status === "rejected").length, color: "#dc2626" },
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
      <p className="mt-6 text-sm text-slate-500">Palestras publicadas: {demoLectures.filter((lecture) => lecture.status === "published").length}</p>
    </div>
  );
}
