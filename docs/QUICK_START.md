# Quick Start - Vida Plena

## 1. Instalar e Rodar (1 minuto)

```bash
cd vida-plena-web
npm install
npm run dev
```

Abrir: `http://localhost:3000`

## 2. Configurar Supabase (5 minutos)

### Criar Projeto
1. Ir para supabase.com
2. New Project → PostgreSQL
3. Aguardar criação (~2 min)

### Executar Migrations
1. Copiar `supabase/migrations/001_initial_schema.sql`
2. Supabase → SQL Editor → Colar e executar
3. Esperar conclusão (~30 seg)

### Credenciais
1. Projeto → Settings → API
2. Copiar:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Editar `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   ```

## 3. Criar Usuários de Teste (2 minutos)

### No Supabase Authentication
1. Admin:
   - Email: `admin@vidaplena.local`
   - Password: `senha123`

2. Participante:
   - Email: `participante@vidaplena.local`
   - Password: `senha123`

3. Palestrante:
   - Email: `palestrante@vidaplena.local`
   - Password: `senha123`

### No Table Editor (profiles)
Criar registros correspondentes:

**Admin**
```
user_id: (ID do user no auth)
full_name: Admin Teste
email: admin@vidaplena.local
role: admin
status: approved
```

**Participante**
```
user_id: (ID do user no auth)
full_name: Participante Teste
email: participante@vidaplena.local
role: participant
status: approved
```

**Palestrante**
```
user_id: (ID do user no auth)
full_name: Palestrante Teste
email: palestrante@vidaplena.local
role: speaker
status: pending
```

## 4. Testar Fluxos (10 minutos)

### Login Admin
```
/dashboard/admin
→ Vê KPIs e opções para aprovar
```

### Aprovar Palestrante
```
Admin → Palestrantes → Aprovar
→ Notificação criada em notifications table
```

### Participante Inscreve
```
Login Participante → Catálogo → "Solicitar Inscrição"
→ Aparece em enrollments (status: pending)
```

### Admin Aprova
```
Admin → Inscrições → Aprovar
→ enrollment.status = confirmed
```

## 5. Próximos Passos

- [ ] Criar palestras (admin/manager)
- [ ] Adicionar mais participantes
- [ ] Fazer uploads de arquivos
- [ ] Testar check-in
- [ ] Gerar certificados

## 📞 Troubleshooting

### "SUPABASE_URL is required"
✓ Verificar `.env.local` preenchido corretamente

### "User not found"
✓ Criar user em Supabase Auth primeiro
✓ Depois criar profile correspondente

### "RLS policy error"
✓ Certificates RLS pode bloquear se não configurado
✓ Desabilitar RLS temporariamente se necessário

### Notificações não aparecem
✓ Norma... o sistema está em modo "simulated"
✓ Ver tabela `notifications` com status "simulated"

---

**Tempo total: ~15 minutos**
