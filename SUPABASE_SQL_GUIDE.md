# 🗄️ Guia Completo SQL para Supabase

## 📋 O Que Está Incluído

O arquivo `supabase/migrations/complete_schema.sql` contém:

### 1. **Extensions** ✅
- `pgcrypto` - Para UUIDs aleatórios
- `uuid-ossp` - Para funções UUID adicionais

### 2. **ENUMs** ✅
- user_role
- user_status
- speaker_approval_status
- lecture_status
- enrollment_status
- speaker_role_in_lecture
- file_visibility
- schedule_source
- notification_channel
- notification_type
- notification_status

### 3. **13 Tabelas** ✅
1. profiles - Usuários
2. speakers - Perfis de palestrantes
3. lectures - Palestras
4. lecture_speakers - Relacionamento palestra/palestrante (M2M)
5. enrollments - Inscrições
6. lecture_files - Arquivos de palestras
7. personal_schedule - Cronograma pessoal
8. attendance - Check-in
9. certificates - Certificados ✨ NOVO
10. notifications - Notificações
11. lecture_feedback - Avaliações
12. audit_logs - Auditoria
13. (Views: lectures_with_enrollment_count, speakers_with_details)

### 4. **22 Índices** ✅
Otimizados para as queries mais comuns

### 5. **RLS (Row Level Security)** ✅
Políticas de segurança para:
- Profiles
- Speakers
- Lectures
- Enrollments
- Lecture Files
- Notifications
- Attendance
- Certificates
- Feedback
- Personal Schedule
- Audit Logs

### 6. **Triggers Automáticos** ✅
- `update_updated_at()` para manter timestamps

### 7. **Views Úteis** ✅
- lectures_with_enrollment_count
- speakers_with_details

### 8. **Funções Úteis** ✅
- get_user_upcoming_lectures()

---

## 🚀 Como Usar no Supabase

### Passo 1: Abra o SQL Editor

1. Vá para https://app.supabase.com
2. Selecione seu projeto
3. Clique em **SQL Editor** (lado esquerdo)
4. Clique em **New Query**

### Passo 2: Copie o SQL

1. Abra o arquivo: `supabase/migrations/complete_schema.sql`
2. Copie **TODO** o conteúdo
3. Cole no SQL Editor do Supabase

### Passo 3: Execute

Clique em **Run** ou pressione `Ctrl + Enter`

⏳ Aguarde a execução (pode levar 1-2 minutos)

### Passo 4: Verifique

Vá para **Table Editor** e confirme que todas as tabelas foram criadas:

- ✅ profiles
- ✅ speakers
- ✅ lectures
- ✅ lecture_speakers
- ✅ enrollments
- ✅ lecture_files
- ✅ personal_schedule
- ✅ attendance
- ✅ certificates
- ✅ notifications
- ✅ lecture_feedback
- ✅ audit_logs

---

## ⚙️ Configurações Pós-Instalação

### 1. Habilitar Auth Trigger (Importante!)

Para criar perfil automaticamente ao registrar novo usuário:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (new.id, new.email, new.email, 'participant', 'pending');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

⏱️ Execute este SQL separadamente após o schema ser criado.

### 2. Testar RLS

1. Vá para **SQL Editor**
2. Execute:
```sql
select * from public.profiles;
```

- ❌ Se retornar erro = RLS está funcionando ✅
- ✅ Se retornar dados = há um perfil admin ✅

### 3. Seed de Dados (Opcional)

Para popular com dados de teste:

```sql
-- Criar admin manualmente (substitua uuid real)
insert into public.profiles (id, full_name, email, role, status)
values (
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  'Admin Vida Plena',
  'admin@vidaplena.local',
  'admin',
  'active'
);

-- Criar palestrante de teste
insert into public.speakers (profile_id, bio, organization, expertise_area, approval_status)
select id, 'Bio de teste', 'Org Teste', 'Geral', 'approved'
from public.profiles
where role = 'speaker'
limit 1;
```

---

## 📊 Estrutura de Dados

```
auth.users (Supabase Auth)
    ↓
profiles (Todos os usuários)
    ├── speakers (Apenas palestrantes)
    │   └── lecture_speakers (M2M)
    │       └── lectures
    │
    └── enrollments (Inscrições)
        └── lectures
        └── attendance (Check-in)
        └── certificates (Certificados)
        └── lecture_feedback (Avaliações)
```

---

## 🔒 Segurança RLS

### O Que Está Protegido?

| Tabela | Proteção | Acesso |
|--------|----------|--------|
| profiles | Usuário vê só seu perfil | Admin vê todos |
| speakers | Aprovados são públicos | Palestrante vê seu | Admin vê todos |
| lectures | Publicadas são públicas | Admin vê todos |
| enrollments | Usuário vê suas inscrições | Admin vê todas |
| lecture_files | Apenas inscritos confirmados | Admin vê todos |
| notifications | Usuário vê suas notificações | Admin vê todas |
| attendance | Usuário vê sua presença | Admin vê todas |
| certificates | Usuário vê seus certificados | Admin vê todos |

### Como Funciona?

RLS usa `auth.uid()` para verificar quem está acessando:

```sql
-- Exemplo: Usuário só vê seus próprios dados
where auth.uid() = user_id
```

---

## 🔧 Troubleshooting

### Erro: "Table already exists"
- ✅ Normal se tabelas já existem
- Execute `drop table` antes ou use `if not exists` (já está no SQL)

### Erro: "Role does not exist"
- ✅ Normal - ENUMS podem ter conflito com nomes
- Solução: Execute de novo, o `create type` tem `if not exists`

### Erro: "Permission denied"
- ❌ Você não tem permissão de criar tabelas
- Solução: Use uma key com permissão `service_role` (não `anon`)

### RLS retornando zero registros
- ✅ Normal se não há perfil criado
- Solução: Execute o trigger para auto-criar perfil ao registrar

---

## 📈 Performance

### Índices Criados Para:

- ✅ Buscar usuários por role/status
- ✅ Filtrar palestras por status e data
- ✅ Listar inscrições por participante/palestra
- ✅ Buscar notificações por usuário e status
- ✅ Auditoria ordenada por data

### Para Aplicações Grandes (>100k registros)

Considere adicionar:

```sql
-- Particionamento por data (se >1M registros)
create table if not exists public.audit_logs_2026_06
partition of public.audit_logs
for values from ('2026-06-01') to ('2026-07-01');

-- Análises com materialized view
create materialized view public.lecture_stats as
select
  l.id,
  count(distinct e.id) as total_enrollments,
  avg(f.rating) as avg_rating
from public.lectures l
left join public.enrollments e on l.id = e.lecture_id
left join public.lecture_feedback f on e.id = f.enrollment_id
group by l.id;
```

---

## 🧪 Testes Recomendados

### Teste 1: Verificar Tabelas

```sql
select * from information_schema.tables 
where table_schema = 'public';
```

### Teste 2: Verificar Índices

```sql
select * from pg_indexes 
where schemaname = 'public';
```

### Teste 3: Verificar RLS

```sql
select schemaname, tablename, rowsecurity 
from pg_tables 
where schemaname = 'public';
```

### Teste 4: Testar Função

```sql
select * from public.get_user_upcoming_lectures('seu-uuid-aqui');
```

---

## 📝 Próximos Passos

1. ✅ Execute o SQL
2. ✅ Configure o trigger de auth
3. ✅ Teste RLS
4. ✅ Popule com dados iniciais
5. ✅ Configure API keys no Next.js
6. ✅ Teste conexão da aplicação

---

## 🎯 Checklist

- [ ] SQL executado sem erros
- [ ] 12 tabelas criadas
- [ ] 22 índices criados
- [ ] RLS habilitado em todas as tabelas
- [ ] Triggers criados
- [ ] Auth trigger configurado
- [ ] Dados de teste inseridos
- [ ] Conexão Next.js testada

---

## 📞 Suporte

Se encontrar erros:

1. Verifique a mensagem de erro exata
2. Procure no SQL por `create or replace`
3. Tente executar apenas a seção com erro
4. Consulte logs do Supabase em **Database** > **Query Performance**

---

**Versão:** 1.0  
**Data:** 2026-06-29  
**Status:** Pronto para Produção
