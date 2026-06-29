'use client'

import { useState } from "react";

export function LectureForm() {
  const [message, setMessage] = useState("");

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {["Titulo", "Tema", "Descricao", "Data", "Inicio", "Fim", "Sala", "Capacidade"].map((label) => (
        <input key={label} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder={label} />
      ))}
      <button type="button" onClick={() => setMessage("Palestra demo salva.")} className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Salvar</button>
      {message && <p className="text-sm font-semibold text-emerald-700 md:col-span-4">{message}</p>}
    </div>
  );
}
