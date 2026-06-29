# Configuração Supabase - Vida Plena

## ✅ Status de Integração

- [x] Pacotes instalados (@supabase/ssr, @supabase/supabase-js)
- [x] Credenciais configuradas em .env.local
- [x] Middleware criado para gerenciar sessões
- [x] Clients (server/browser) integrados
- [x] Build compilando sem erros

---

## 📋 Credenciais do Projeto

```
Project: https://obikdroawfzuogldlypn.supabase.co
API Key: sb_publishable_uaLmgNPQxlfOr0Od4RL06Q_61hdGCRa
```

As credenciais estão configuradas em `.env.local` (já preenchido).

---

## 🗄️ Schema SQL - Próximo Passo

Acesse o painel Supabase:

**Projeto → SQL Editor**

1. Copie o conteúdo de `supabase/migrations/001_initial_schema.sql`
2. Cole no editor
3. Clique em "RUN"
4. Aguarde criação das tabelas (~30 segundos)

Isto criará:
- ✅ 11 tabelas (profiles, talks, enrollments, etc)
- ✅ Índices para performance
- ✅ Row Level Security (RLS) policies
- ✅ Constraints e validações

---

## 🔑 Criar Usuários de Teste

### No Supabase Dashboard

**Authentication → Users → Add User**

1. **Admin**
   - Email: `admin@vidaplena.local`
   - Password: `senha123`
   - Auto confirm: ✓

2. **Participante**
   - Email: `participante@vidaplena.local`
   - Password: `senha123`
   - Auto confirm: ✓

3. **Palestrante**
   - Email: `palestrante@vidaplena.local`
   - Password: `senha123`
   - Auto confirm: ✓

### No Table Editor (profiles)

**Novo registro para cada usuário:**

**Admin**
```json
{
  "user_id": "uuid-do-admin-aqui",
  "full_name": "Admin Teste",
  "email": "admin@vidaplena.local",
  "phone_whatsapp": null,
  "city": null,
  "state": null,
  "role": "admin",
  "account_status": "approved"
}
```

**Participante**
```json
{
  "user_id": "uuid-do-participante-aqui",
  "full_name": "Participante Teste",
  "email": "participante@vidaplena.local",
  "phone_whatsapp": "(11) 99999-9999",
  "city": "São Paulo",
  "state": "SP",
  "role": "participant",
  "account_status": "approved"
}
```

**Palestrante**
```json
{
  "user_id": "uuid-do-palestrante-aqui",
  "full_name": "Palestrante Teste",
  "email": "palestrante@vidaplena.local",
  "phone_whatsapp": "(11) 98888-8888",
  "city": "São Paulo",
  "state": "SP",
  "role": "speaker",
  "account_status": "pending"
}
```

Depois criar `speaker_profiles` correspondente.

---

## 🎯 Fluxo de Funcionamento

### 1. Login
- Browser → `/login`
- Supabase Auth valida credenciais
- Session armazenada em cookies (SSR)
- Middleware (`middleware.ts`) mantém sessão ativa

### 2. Dashboard
- Server-side: Fetch com `createClient(cookieStore)`
- Data protegida por RLS
- Exibe apenas dados do usuário ou todos (se admin)

### 3. Notificações
- Evento dispara → insere em `notifications` table
- Status: "simulated" (padrão)
- Se `RESEND_API_KEY` configurada → envia email real

### 4. Arquivos
- Upload → Supabase Storage
- Referência em `talk_files` table
- RLS controla acesso baseado em `visibility` + enrollment status

---

## 🔐 Row Level Security (RLS)

Todas as tabelas têm políticas RLS ativas:

**profiles table**
```sql
-- Usuário vê seus dados
SELECT * FROM profiles WHERE user_id = auth.uid()

-- Admin vê tudo
SELECT * FROM profiles WHERE EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
)
```

**enrollments table**
```sql
-- Inscrito vê suas próprias inscrições
SELECT * FROM enrollments WHERE participant_profile_id = (
  SELECT id FROM profiles WHERE user_id = auth.uid()
)

-- Admin vê tudo
SELECT * FROM enrollments WHERE EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
)
```

**talk_files table** (mais complexo)
```sql
-- Arquivo visível se:
-- 1. Admin
-- 2. Palestrante da palestra
-- 3. Inscrito confirmado na palestra
-- Baseado em visibility + status de enrollment
```

---

## 🧪 Testar Funcionamento

### 1. Iniciar Dev Server
```bash
npm run dev
```

### 2. Login Admin
- URL: `http://localhost:3000/login`
- Email: `admin@vidaplena.local`
- Senha: `senha123`

### 3. Dashboard
- Deve exibir KPIs
- Deve mostrar palestras
- Deve mostrar inscritos

### 4. RLS Check
- Login como participante
- Tente acessar `/api/admin/users` (deve falhar - 401)
- Ver apenas seus dados

---

## 📦 Estrutura de Clients

### Server-side (SSR)
```typescript
// app/page.tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data } = await supabase.from('talks').select()
  // ...
}
```

### Client-side
```typescript
'use client'
import { createClient } from '@/utils/supabase/client'

export function MyComponent() {
  const supabase = createClient()
  // useEffect...
  supabase.from('enrollments').on('INSERT', ...)
}
```

### Middleware
```typescript
// middleware.ts
// Verifica sessions a cada request
// Mantém cookies atualizados
// Funciona transparentemente
```

---

## 🚀 Próximos Passos

1. ✅ Instalar pacotes
2. ✅ Configurar credenciais
3. ⏳ **Executar migration SQL**
4. ⏳ **Criar usuários de teste**
5. ⏳ **Testar login**
6. ⏳ **Capturar evidências**
7. ⏳ **Gravar vídeo pitch**

---

## 📚 Referências

- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## 🆘 Troubleshooting

### "SUPABASE_URL is required"
✓ Verificar `.env.local` preenchido
✓ Reiniciar `npm run dev`

### "Unexpected token" on page load
✓ Verificar middleware.ts está no root
✓ Limpar `.next` folder: `rm -r .next`
✓ Recompile: `npm run build`

### "RLS policy violation"
✓ Checkar se user_id está correto no profiles
✓ Verificar RLS policy está ativa
✓ Pode desabilitar temporariamente: Settings → RLS → Disable

### "Cannot find module"
✓ Verificar `utils/supabase/` exists
✓ Verificar imports usam `@/utils/supabase/`

---

**Status: 🟢 PRONTO PARA IMPLEMENTAÇÃO**
