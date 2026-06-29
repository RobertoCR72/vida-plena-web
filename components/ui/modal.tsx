import type { ReactNode } from "react";

export function Modal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
