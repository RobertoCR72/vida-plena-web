# 🚀 Próximas Ações - Integração Supabase

**Criado em:** 2026-06-29 11:45 GMT-3  
**Para:** Próximo desenvolvedor ou continuação  
**Tempo estimado:** 3-4 horas

---

## 📍 Onde Estamos Agora

✅ **Infraestrutura criada e testada**
- Serviços Supabase funcionais
- Adaptadores de tipos prontos
- Hooks React com auto-refresh
- Build passando sem erros
- Arquivo de lectures.page.tsx já migrado

---

## 🎯 Próximos 3 Passos Concretos

### **PASSO 1: Testar Lecturas (15 minutos)**

```bash
# Terminal 1: Inicia servidor
cd C:\Users\bobrc\vida-plena-web
npm run dev

# Espere: "✓ Ready in XXXms"
# Local: http://localhost:3000
```

**No browser:**
1. Vá para `http://localhost:3000/dashboard/admin/lectures`
2. Preencha o formulário:
   - Título: "Teste Supabase"
   - Tema: "Integração"
   - Data: 2026-07-15
3. Clique "Criar palestra"
4. ✅ Esperado: Mensagem "Palestra... criada com sucesso!"

**No Supabase:**
1. Abra `https://app.supabase.com`
2. Projeto: `vida-plena-web`
3. Table Editor → `lectures`
4. ✅ Procure seu registro: "Teste Supabase"

**Se funcionar:** ÓTIMO! Passe para o Passo 2  
**Se não funcionar:** Verifique:
- `.env.local` tem credenciais Supabase?
- Console do browser (F12) mostra erro?
- Network tab: requisição para Supabase saiu?

---

### **PASSO 2: Implementar Enrollments (30 minutos)**

**Arquivo a editar:** `app/(app)/dashboard/admin/enrollments/page.tsx`

**Instruções passo a passo:**

**2.1 - Trocar imports (linhas 1-10)**

Substitua:
```typescript
import { loadStoredEnrollments, saveStoredEnrollments } from '@/lib/local-demo-store'
```

Por:
```typescript
import {
  loadStoredEnrollments,
  updateStoredEnrollment,
  appendAudit,
} from '@/lib/adapters/supabase-adapter'
import { useSupabaseEnrollments } from '@/lib/use-supabase-store'
```

**2.2 - Atualizar componente (linhas 60-90)**

Trocar:
```typescript
const enrollments = useStoredEnrollments() as DemoEnrollment[]
```

Por:
```typescript
const { enrollments, refetch } = useSupabaseEnrollments(2000)
```

Adicionar:
```typescript
const [isSaving, setIsSaving] = useState(false)
```

**2.3 - Converter handleConfirm para async (encontre a função)**

Trocar:
```typescript
const handleConfirm = (enrollmentId: string) => {
  // ... código existente ...
  setEnrollments(updated)
}
```

Por:
```typescript
const handleConfirm = async (enrollmentId: string) => {
  setIsSaving(true)
  try {
    await updateStoredEnrollment(enrollmentId, 'confirmed')
    await appendAudit('Admin Demo', 'confirm_enrollment', 'enrollments', 'Inscrição confirmada')
    setMessage('Inscrição confirmada com sucesso!')
    await refetch()
  } catch (error) {
    setMessage(`Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`)
  } finally {
    setIsSaving(false)
  }
}
```

**2.4 - Fazer o mesmo para handleReject e handleWaitlist**

Padrão:
```typescript
const handleX = async (enrollmentId: string) => {
  setIsSaving(true)
  try {
    await updateStoredEnrollment(enrollmentId, 'STATUS_AQUI')
    await appendAudit(...)
    await refetch()
    setMessage('Sucesso!')
  } catch (error) {
    setMessage(`Erro: ${error.message}`)
  } finally {
    setIsSaving(false)
  }
}
```

**2.5 - Adicionar disabled nos botões (procure por onClick)**

Adicione `disabled={isSaving}` aos botões de ação.

**2.6 - Validar**

```bash
npm run build
# Esperado: ✓ Compiled successfully
```

**Se passar no build:** Continue para Passo 3  
**Se não passar:** Verifique erros de tipo

---

### **PASSO 3: Implementar Speakers (30 minutos)**

**Arquivo:** `app/(app)/dashboard/admin/speakers/page.tsx`

**Mesma sequência do Passo 2:**

1. Trocar imports
2. Atualizar componente com novo hook
3. Converter `updateSpeakerStatus` para async
4. Converter `notifySpeaker` para async
5. Adicionar `refetch()` após operações
6. Adicionar `isSaving` state
7. Build validation

**Dica:** Copie a estrutura do Passo 2, mas use `useSupabaseSpeakers()` e `updateStoredSpeaker()`

---

## 📋 Checklist Detalhado

### Antes de Começar
- [ ] Terminal pronto
- [ ] VS Code aberto
- [ ] Supabase dashboard aberto em outra aba

### Passo 1: Lectures
- [ ] npm run dev funcionando
- [ ] Browser aberto em localhost:3000
- [ ] Criar palestra teste
- [ ] Verificar em Supabase
- [ ] Editar palestra
- [ ] Deletar palestra

### Passo 2: Enrollments
- [ ] Imports atualizados
- [ ] useSupabaseEnrollments() usado
- [ ] handleConfirm async
- [ ] handleReject async
- [ ] handleWaitlist async
- [ ] appendAudit adicionado
- [ ] isSaving state adicionado
- [ ] Build passa
- [ ] Testar no browser: confirmar inscrição
- [ ] Verificar em Supabase: status mudou?

### Passo 3: Speakers
- [ ] Imports atualizados
- [ ] useSupabaseSpeakers() usado
- [ ] updateSpeakerStatus async
- [ ] notifySpeaker async
- [ ] Build passa
- [ ] Testar no browser: aprovar palestrante
- [ ] Verificar em Supabase: status mudou?

### Passo 4: Dashboard
- [ ] Imports atualizados para supabase-adapter
- [ ] Build passa
- [ ] Testar: dashboard atualiza a cada 2s?

### Testes Finais
- [ ] npm run build completo
- [ ] npm run dev rodando
- [ ] Criar registro em cada módulo
- [ ] Editar registro
- [ ] Deletar registro
- [ ] Verificar em Supabase
- [ ] Audit logs registram ações?

---

## 🐛 Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| "Cannot find module" | Import errado | Verifique caminho: `@/lib/adapters/supabase-adapter` |
| "refetch is not defined" | Hook não importado | Adicione: `import { useSupabase... } from '@/lib/use-supabase-store'` |
| "Promise returned from click handler" | Função não async | Adicione `async` na frente da função |
| Dados não salvam | setIsSaving não removido | Certifique de `finally { setIsSaving(false) }` |
| Type error: 'waitlist' | Nome errado | Use `'waitlisted'` no DemoEnrollment, `'waitlist'` em Supabase |
| Build fails TypeScript | Falta as types | Use `as any` se necessário (temporário) |

---

## 🔍 Verificação Rápida de Sucesso

```bash
# Terminal
npm run build

# Esperado:
# ✓ Compiled successfully
# ✓ No TypeScript errors
```

```bash
# Browser Console (F12)
# Esperado: Sem erros vermelhos
# Avisos amarelos são OK
```

```sql
-- Supabase SQL Editor
SELECT COUNT(*) FROM enrollments WHERE updated_at > NOW() - INTERVAL '5 minutes';

-- Esperado: número aumenta conforme você edita enrollments
```

---

## 📞 Perguntas Frequentes

**P: Como eu sou que funcionou?**  
R: Você vê a mudança no app E no Supabase, e nenhum erro no console.

**P: E se eu quiser reverter?**  
R: Os arquivos originais (`local-demo-store.ts`) ainda existem. Basta trocar os imports de volta.

**P: Quanto tempo leva tudo?**  
R: ~3 horas se seguir este guia. Pode ser mais rápido na segunda vez.

**P: Preciso reiniciar o npm run dev?**  
R: Só se editar `.env.local`. Casos normais, hot-reload funciona.

**P: E se der erro no Supabase?**  
R: Verifique `.env.local` tem URL e ANON_KEY. Se ainda não funciona, pode ser RLS bloqueando (verifique policies).

---

## 🎓 Conceitos Importantes

- **Async/Await:** Espera requisição Supabase terminar antes de continuar
- **refetch():** Recarrega dados do Supabase
- **appendAudit():** Registra ação em audit_logs
- **isSaving:** Previne cliques múltiplos enquanto processa
- **Auto-refresh 2s:** Mantém dashboard sincronizado

---

## 📚 Documentação Relacionada

- `SUPABASE_MIGRATION_GUIDE.md` - Guia completo
- `SUMMARY_SUPABASE_INTEGRATION.md` - Resumo do que foi feito
- `INTEGRATION_PROGRESS.md` - Status detalhado

---

## ✅ Conclusão

Quando terminar os 4 passos:
- [ ] Toda a infraestrutura estará rodando no Supabase real
- [ ] Dados persistem entre recarregar página
- [ ] Dashboard atualiza automaticamente
- [ ] Auditoria registra todas as ações
- [ ] Pronto para integração de autenticação real

**Tempo total:** ~3-4 horas  
**Dificuldade:** Baixa (padrão repetido)  
**Risco:** Mínimo (testes validam tudo)

---

**Boa sorte!** 🚀

*Se tiver dúvidas, consulte o arquivo original ou a documentação de Supabase.*
