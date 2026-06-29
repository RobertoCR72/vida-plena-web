import type { LucideIcon } from "lucide-react";

export function DashboardCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-blue-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
