import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  confirmed: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  waitlisted: "bg-orange-100 text-orange-800 ring-orange-200",
  waitlist: "bg-orange-100 text-orange-800 ring-orange-200",
  cancelled: "bg-red-100 text-red-800 ring-red-200",
  rejected: "bg-red-100 text-red-800 ring-red-200",
  published: "bg-sky-100 text-sky-800 ring-sky-200",
  draft: "bg-slate-100 text-slate-800 ring-slate-200",
  closed: "bg-zinc-100 text-zinc-800 ring-zinc-200",
  simulated: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  sent: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};

const labels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  approved: "Aprovado",
  waitlisted: "Lista de espera",
  waitlist: "Lista de espera",
  cancelled: "Cancelada",
  rejected: "Rejeitada",
  published: "Publicada",
  draft: "Rascunho",
  closed: "Encerrada",
  simulated: "Simulada",
  sent: "Enviada",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", styles[status] || styles.draft)}>
      {labels[status] || status}
    </span>
  );
}
