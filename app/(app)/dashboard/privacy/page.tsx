const items = [
  "Coletamos nome, e-mail, WhatsApp, cidade, estado, papel de usuario, inscricoes, presenca e avaliacoes.",
  "A finalidade e organizar eventos, confirmar inscricoes, comunicar participantes e medir impacto social.",
  "Administradores acessam dados operacionais; gestores acessam palestras e inscricoes relacionadas; palestrantes veem apenas seus inscritos confirmados.",
  "Participantes acessam seus proprios dados, cronograma e notificacoes.",
  "Dados nao devem ser compartilhados indevidamente e o uso de e-mail/WhatsApp precisa respeitar consentimento e finalidade.",
  "O projeto usa dados ficticios para demonstracao academica.",
  "Em ambiente real, solicitacoes de exclusao devem ser atendidas por canal formal da ONG.",
  "Autenticacao e Row Level Security reduzem acesso indevido.",
];

export default function PrivacyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Politica de privacidade e LGPD</h1>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <ul className="grid gap-3 text-slate-700">
          {items.map((item) => <li key={item} className="rounded-md bg-slate-50 p-3">{item}</li>)}
        </ul>
      </div>
    </div>
  );
}
