# 🔄 Guia de Integração Supabase Real

**Status:** Fase 1 Concluída ✅  
**Objetivo:** Migrar do localStorage para Supabase persistente  
**Tempo Estimado:** 30-45 minutos

---

## 📊 Estrutura Criada

```
lib/
├── services/
│   └── supabase.service.ts          ✅ [Novo] Funções CRUD para Supabase
└── adapters/
    └── supabase-adapter.ts          ✅ [Novo] Compatibilidade com código existente
```

**Próximo passo:** Atualizar componentes para usar os novos serviços.

---

## 🚀 FASE 2: Substituir localStorage nos Componentes

### **Passo 2.1** - Atualizar `app/(app)/dashboard/admin/lectures/page.tsx`

**O que fazer:**
1. Substituir imports de `local-demo-store` por `supabase-adapter`
2. Converter `useState` em chamadas ao Supabase
3. Usar `useEffect` para buscar dados do Supabase

**Arquivo:** `app/(app)/dashboard/admin/lectures/page.tsx`

```typescript
// ANTES (localStorage):
import { loadStoredLectures, saveStoredLectures } from '@/lib/local-demo-store'

// DEPOIS (Supabase):
import { 
  loadStoredLectures, 
  createStoredLecture,
  updateStoredLecture,
  deleteStoredLecture,
  appendAudit
} from '@/lib/adapters/supabase-adapter'
```

**Mudanças no useEffect:**
- Manter o `setInterval` para auto-refresh
- Trocar `loadStoredLectures()` → agora retorna Promise

**Exemplo:**
```typescript
useEffect(() => {
  const loadData = async () => {
    const freshLectures = await loadStoredLectures()
    setLectures(freshLectures)
  }

  loadData()
  const interval = setInterval(loadData, 2000)
  return () => clearInterval(interval)
}, [])
```

---

### **Passo 2.2** - Atualizar `app/(app)/dashboard/admin/enrollments/page.tsx`

**O que fazer:**
1. Importar do `supabase-adapter`
2. Converter `loadStoredEnrollments()` em async/await
3. Atualizar `handleConfirm`, `handleReject`, `handleWaitlist`

**Mudanças principais:**

```typescript
const handleConfirm = async (enrollmentId: string) => {
  try {
    const updated = await updateStoredEnrollment(enrollmentId, 'confirmed')
    if (updated) {
      await appendAudit('Admin Demo', 'confirm_enrollment', 'enrollments', 
        `Inscrição confirmada`)
      // Recarregar dados
      const freshEnrollments = await loadStoredEnrollments()
      setEnrollments(freshEnrollments)
    }
  } catch (error) {
    setMessage(`Erro ao confirmar: ${error.message}`)
  }
}
```

---

### **Passo 2.3** - Atualizar `app/(app)/dashboard/admin/speakers/page.tsx`

**O que fazer:**
1. Substituir imports
2. Converter `updateSpeakerStatus` para async

```typescript
const updateSpeakerStatus = async (speakerId: string, status: 'approved' | 'pending' | 'rejected') => {
  try {
    const updated = await updateStoredSpeaker(speakerId, status)
    await appendAudit('Admin Demo', 'update_speaker_status', 'speakers', 
      `Palestrante alterado para ${status}`)
    
    const freshSpeakers = await loadStoredSpeakers()
    setSpeakers(freshSpeakers)
    setMessage('Status atualizado com sucesso')
  } catch (error) {
    setMessage(`Erro: ${error.message}`)
  }
}
```

---

### **Passo 2.4** - Atualizar `app/(app)/dashboard/admin/page.tsx`

**O que fazer:**
1. Manter estrutura existente (já está bem feita!)
2. Apenas trocar os imports

```typescript
import { 
  loadStoredEnrollments, 
  loadStoredLectures, 
  loadStoredSpeakers 
} from '@/lib/adapters/supabase-adapter'
```

---

## 🧪 FASE 3: Testar a Integração

### **Teste 3.1** - Verificar Build

```bash
npm run build
```

✅ Esperado: Build sem erros

---

### **Teste 3.2** - Verificar Desenvolvimento

```bash
npm run dev
```

✅ Esperado: Servidor rodando sem erros

---

### **Teste 3.3** - Testar Fluxo Completo

1. Acesse `http://localhost:3000/dashboard/admin`
2. Vá para "Palestras"
3. Crie uma nova palestra
4. ✅ A palestra deve aparecer no Supabase (Table Editor)
5. Edite a palestra
6. ✅ As mudanças devem persistir no Supabase
7. Delete a palestra
8. ✅ Deve desaparecer do Supabase

---

### **Teste 3.4** - Verificar Supabase

1. Acesse `https://app.supabase.com`
2. Projeto: `vida-plena-web`
3. Vá para **SQL Editor**
4. Execute:
```sql
SELECT COUNT(*) FROM lectures;
SELECT COUNT(*) FROM enrollments;
SELECT COUNT(*) FROM speakers;
SELECT COUNT(*) FROM audit_logs;
```

✅ Esperado: Os números aumentam conforme você faz operações no app

---

## 🔐 FASE 4: Validações e Segurança

### **Passo 4.1** - Verificar RLS está ativo

No Supabase, vá para: **Authentication → Policies**

✅ Você deve ver políticas para:
- `lectures`
- `enrollments`
- `speakers`
- `audit_logs`

Se não houver, execute em **SQL Editor**:
```sql
-- Exemplo simples (Não recomendado para produção)
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read lectures"
  ON lectures FOR SELECT
  TO authenticated, anon
  USING (true);
```

---

### **Passo 4.2** - Validar Tipos TypeScript

Se houver erros de tipo, regenere os tipos:

```bash
# Copiar do Supabase
npx supabase gen types typescript > types/database.ts
```

---

## 📋 Checklist de Conclusão

- [ ] Arquivo `lib/services/supabase.service.ts` criado
- [ ] Arquivo `lib/adapters/supabase-adapter.ts` criado
- [ ] `lectures/page.tsx` atualizado para Supabase
- [ ] `enrollments/page.tsx` atualizado para Supabase
- [ ] `speakers/page.tsx` atualizado para Supabase
- [ ] `admin/page.tsx` imports atualizados
- [ ] `npm run build` passou sem erros
- [ ] `npm run dev` funcionando
- [ ] Teste de criar palestra ✅
- [ ] Teste de editar palestra ✅
- [ ] Teste de deletar palestra ✅
- [ ] Dados visíveis no Supabase Dashboard ✅
- [ ] RLS habilitado nas tabelas ✅

---

## 🐛 Troubleshooting

### Erro: "Supabase URL not found"
**Causa:** Variáveis de ambiente não configuradas  
**Solução:**
```bash
# Verificar .env.local
cat .env.local | grep NEXT_PUBLIC_SUPABASE

# Deve aparecer:
# NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Erro: "Column 'participant_id' does not exist"
**Causa:** Schema do Supabase diferente do esperado  
**Solução:** Verificar migration 001 foi executada:
```bash
# No Supabase, SQL Editor:
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Dados não aparecem após operação
**Causa:** Transação não commitada ou erro silencioso  
**Solução:**
1. Verificar browser console (F12)
2. Verificar logs do servidor (`npm run dev`)
3. Verificar RLS não está bloqueando a operação

---

## 📝 Próximos Passos Opcionais

1. **Real-time com Subscriptions**
   - Usar `subscribeToLectures()` e `subscribeToEnrollments()`
   - Remove a necessidade de polling a cada 2 segundos

2. **Autenticação Real**
   - Trocar demo users por Supabase Auth
   - Implementar `signUp()`, `signIn()`, `signOut()`

3. **Upload de Arquivos**
   - Integrar Supabase Storage
   - Upload de materiais de palestra

4. **Notificações Real**
   - Integrar Resend, SendGrid ou Twilio
   - Enviar emails/WhatsApp real

5. **Otimizações**
   - Cache local com `useSWR` ou React Query
   - Paginação de resultados
   - Filtros no banco (ao invés de cliente)

---

**Documento criado:** 2026-06-29  
**Última atualização:** Fase 1 Concluída  
**Próximo review:** Após implementar Fase 2
