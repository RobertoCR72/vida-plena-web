import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="max-w-lg rounded-lg border border-amber-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Cadastro em analise</h1>
        <p className="mt-3 text-slate-600">Sua solicitacao como palestrante foi registrada e precisa de aprovacao administrativa antes do acesso ao painel.</p>
        <Link className="mt-6 inline-flex rounded-md bg-blue-700 px-4 py-2 font-semibold text-white" href="/">Voltar ao inicio</Link>
      </div>
    </main>
  );
}
