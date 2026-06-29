# 🚀 Próximos Passos - Integração Supabase

## 📋 Checklist de Implementação

### ✅ Fase 1: Schema (AGORA)

- [ ] 1. Copie `supabase/migrations/schema_clean.sql`
- [ ] 2. Abra https://app.supabase.com
- [ ] 3. Vá para **SQL Editor** → **New Query**
- [ ] 4. Cole TODO o SQL
- [ ] 5. Clique **Run** ou Ctrl+Enter
- [ ] 6. Aguarde completar (1-2 minutos)
- [ ] 7. Verifique em **Table Editor** que todas as tabelas existem

### ⏳ Fase 2: Auth Trigger (Próximo)

Depois que o schema estiver pronto, execute este SQL separadamente:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (new.id, new.email, new.email, 'participant', 'pending');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

**O que faz:** Cria automaticamente um perfil quando um novo usuário se registra.

### 🔐 Fase 3: API Keys (Depois)

No Supabase:
1. Vá para **Settings** → **API**
2. Copie:
   - `Project URL`
   - `anon key` (public)
   - `service_role key` (secret)

Guarde bem! Você vai usar no Next.js.

### 🔗 Fase 4: Conectar Next.js (Depois)

Seus arquivos `.env.local` já têm:
```
NEXT_PUBLIC_SUPABASE_URL=https://obikdroawfzuogldlypn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

✅ Já está configurado! Não precisa mudar nada.

### 🧪 Fase 5: Testar Conexão

No SQL Editor do Supabase, execute:

```sql
-- Deve retornar suas tabelas
select * from information_schema.tables 
where table_schema = 'public' 
order by table_name;
```

**Esperado:** Lista com ~13 tabelas.

### 📊 Fase 6: Atualizar Tipos TypeScript (Depois)

Se usar geradores de tipos (Supabase CLI):

```bash
npx supabase gen types typescript --project-id seu_project_id > types/database.ts
```

Mas o projeto atual já tem tipos manuais. Pode deixar como está.

---

## 🎯 O Que Vai Funcionar Após Cada Fase

### Após Fase 1 (Schema)
- ✅ Banco de dados estruturado
- ✅ RLS habilitado (segurança)
- ✅ Índices criados (performance)

### Após Fase 2 (Auth Trigger)
- ✅ Novo usuário → perfil criado automaticamente
- ✅ Workflow completo de autenticação

### Após Fase 3 (API Keys)
- ✅ Credenciais documentadas
- ✅ Pronto para conectar com backend

### Após Fase 4 (Next.js)
- ✅ Aplicação conectada ao banco
- ✅ Dados salvos persistentemente
- ✅ Inscrições salvas no Supabase (não localStorage)

---

## 🔄 Fluxo Completo de Dados

```
Next.js App
    ↓
Client Supabase (@supabase/supabase-js)
    ↓
Supabase Auth + RLS
    ↓
PostgreSQL (seu banco)
    ↓
Retorna dados
    ↓
App persiste em localStorage (backup)
```

---

## 📝 Mudanças Necessárias na App

Após conectar Supabase, você vai poder remover:

```typescript
// ❌ REMOVER (localStorage)
import { demoEnrollments } from '@/lib/demo-data'

// ✅ USAR (Supabase)
const { data, error } = await supabase
  .from('enrollments')
  .select('*')
```

Mas por enquanto mantemos os dados de demo como fallback.

---

## 🚨 Troubleshooting Comum

### "Posso apagar a tabela e recriar?"
✅ Sim! Execute:
```sql
drop table if exists public.nome_tabela cascade;
```
Depois rode o SQL de novo.

### "Esqueci um campo!"
✅ Adicione com:
```sql
alter table public.nome_tabela add column novo_campo text;
```

### "Mudei de ideia sobre um ENUM"
❌ Difícil remover ENUM sem quebrar
✅ Solução: Delete table, recrie com novo schema

### "RLS está bloqueando tudo!"
✅ Isso é bom (segurança)
❌ Mas você pode desabilitar temporário para testes:
```sql
alter table public.profiles disable row level security;
```

---

## 📚 Documentação de Referência

### Criar Novo Registro
```typescript
const { data, error } = await supabase
  .from('profiles')
  .insert([{ id, full_name, email, role: 'participant' }])
  .select()
```

### Atualizar Registro
```typescript
const { data, error } = await supabase
  .from('enrollments')
  .update({ status: 'confirmed' })
  .eq('id', enrollmentId)
  .select()
```

### Deletar Registro
```typescript
const { error } = await supabase
  .from('lectures')
  .delete()
  .eq('id', lectureId)
```

### Listar com Filtros
```typescript
const { data, error } = await supabase
  .from('enrollments')
  .select('*')
  .eq('participant_id', userId)
  .eq('status', 'confirmed')
```

---

## 🎯 Resumo: Por Que Isso Funciona

| Antes | Depois |
|-------|--------|
| Dados em localStorage | Dados no Supabase (PostgreSQL) |
| Apenas um usuário local | Múltiplos usuários autenticados |
| Dados perdidos ao limpar cache | Dados persistem na nuvem |
| Sem segurança | RLS controla acesso |
| Sem auditoria | Logs de tudo |
| Sem escalabilidade | Pronto para produção |

---

## 🚀 Timeline Recomendado

| Fase | Tempo | Status |
|------|-------|--------|
| Schema SQL | ⏱️ 2 min | 🔴 AGORA |
| Auth Trigger | ⏱️ 1 min | 🟡 Depois |
| Conectar Next.js | ⏱️ 5 min | 🟡 Depois |
| Testar E2E | ⏱️ 15 min | 🟡 Depois |
| Deploy | ⏱️ 10 min | 🟡 Depois |

**Total:** ~30 minutos para infraestrutura completa.

---

## ✅ Confirmação Final

Após completar Fase 1, você terá:

```
✅ 13 tabelas criadas
✅ 24 índices otimizados
✅ RLS em todas as tabelas
✅ Triggers automáticos
✅ Views úteis
✅ Funções SQL
✅ Pronto para produção
```

---

**Próximo passo: Copie o SQL e execute no Supabase! 🚀**

Documentação salva em:
- `supabase/migrations/complete_schema.sql` (com comentários)
- `supabase/migrations/schema_clean.sql` (limpo)
- `SUPABASE_SQL_GUIDE.md` (guia detalhado)
