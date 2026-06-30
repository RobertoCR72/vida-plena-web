# Vida Plena Eventos

🎯 **APLICAÇÃO PUBLICADA:** https://vida-plena-web.vercel.app

Aplicacao web academica para uma ONG gerenciar palestras, palestrantes, participantes, inscricoes, confirmacoes, check-in, cronogramas pessoais, avaliacoes, notificacoes simuladas, auditoria e dashboards.

## ⚠️ Nota sobre Escopo Acadêmico

Este projeto foi desenvolvido com stack **Pro-Code (Next.js + PostgreSQL + Vercel)** para validação técnica. Contudo, a disciplina "Bancos de Dados Visuais & Ferramentas Integradas No-Code" exige manutenção autônoma pela ONG sem dependência de programadores.

**Solução Recomendada para Produção:** Google Sheets + AppSheet  
- ✅ Banco de dados visual (Google Sheets)
- ✅ Interface sem código (AppSheet)  
- ✅ Manutenção autônoma pela ONG
- ✅ GRÁTIS (primeira app)
- ✅ Publicação em 10 minutos

Ver: `vida-plena-google-sheets-appsheet-IMPLEMENTACAO.md`

## Escopo Atual

O envio de arquivos e a visualizacao de materiais por inscritos foram removidos para simplificar o sistema e o banco de dados. O schema agora fica concentrado nos fluxos principais de evento.

## Stack

- Next.js App Router, TypeScript e Tailwind CSS
- Supabase Auth, PostgreSQL e Row Level Security
- React Hook Form, Zod e Lucide React
- CSV simples via rota de exportacao
- Deploy-ready para Vercel

## Perfis

- Administrador: dashboards, palestras, palestrantes, inscricoes, check-in, notificacoes e logs.
- Gestor de palestras: cadastro, edicao e publicacao de palestras.
- Palestrante: palestras vinculadas, cronograma e inscritos confirmados.
- Participante: palestras disponiveis, inscricoes, cronograma, avaliacoes e certificado simples.

## Como Rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Login Demo

- Admin: `admin.demo@vidaplena.org`
- Senha: `Admin@123456`

## Rotas Principais

- Home: `/`
- Palestras publicas: `/lectures`
- Login: `/login`
- Cadastro participante: `/register`
- Cadastro palestrante: `/register/speaker`
- Admin: `/dashboard/admin`
- Palestras: `/dashboard/admin/lectures`
- Palestrantes: `/dashboard/admin/speakers`
- Inscricoes e check-in: `/dashboard/admin/enrollments`
- Notificacoes: `/dashboard/admin/notifications`
- Logs: `/dashboard/admin/audit-logs`
- Gestor: `/dashboard/manager`
- Palestrante: `/dashboard/speaker`
- Participante: `/dashboard/participant`
- Cronograma: `/dashboard/schedule`
- LGPD: `/dashboard/privacy`

## Banco de Dados

Migrations em `supabase/migrations`:

- `profiles`
- `speakers`
- `lectures`
- `lecture_speakers`
- `enrollments`
- `personal_schedule`
- `attendance`
- `notifications`
- `lecture_feedback`
- `audit_logs`

Nao ha tabela de arquivos, bucket de Storage ou policies de arquivo no escopo atual.

## Supabase

1. Crie um projeto no Supabase.
2. Copie `.env.example` para `.env.local`.
3. Preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e, se necessario, `SUPABASE_SERVICE_ROLE_KEY`.
4. Execute as migrations:

```bash
supabase db push
```

5. Execute `supabase/seed.sql` no SQL Editor para dados ficticios.

## Funcionalidades Demonstraveis

- Criar conta e login demo.
- Criar, editar, publicar, encerrar, cancelar e excluir palestras no admin.
- Aprovar, deixar pendente ou reprovar palestrantes.
- Confirmar, rejeitar ou colocar inscricoes em lista de espera.
- Registrar check-in.
- Ver logs de auditoria.
- Exportar inscricoes em CSV por `/api/export/enrollments`.
- Simular notificacao de inscricao confirmada por `/api/notifications/enrollment-confirmed`.
- Visualizar cronograma pessoal e conflitos de horario.

## Verificacao

```bash
npm run lint
npm run build
```

## Evidencias Sugeridas

1. Tela inicial com palestras publicadas.
2. Cadastro de participante.
3. Cadastro de palestrante.
4. Painel do administrador.
5. Dashboard com metricas.
6. Edicao de palestra pelo administrador.
7. Aprovacao de palestrante.
8. Confirmacao de inscricao.
9. Registro de check-in.
10. Historico de notificacoes.
11. Painel do participante com cronograma.
12. Alerta de conflito de horario.
13. Painel do palestrante com inscritos confirmados.
14. Logs de auditoria.
15. Politica de privacidade/LGPD.

## Deploy em Producao

### Vercel (Recomendado)

1. Conecte seu repositorio GitHub ao Vercel
2. Configure variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático ao fazer push em `main`

[Deploy com Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vida-plena)

### Outras Plataformas

- Railway
- Render
- Netlify (com funcoes serverless)

## Melhorias Futuras

- Integracao real com WhatsApp Business API.
- Integracao real com SendGrid, Resend ou Amazon SES.
- QR Code para check-in.
- Certificados em PDF.
- Dashboard avancado de impacto social.
- Relatorios por comunidade e regiao.
- App mobile.
- Permissoes mais granulares.
