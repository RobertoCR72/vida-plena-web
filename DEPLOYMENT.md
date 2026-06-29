# 🚀 GUIA DE PUBLICAÇÃO - Vida Plena

## Status Atual
✅ Aplicação pronta para produção
✅ Todos os erros corrigidos
✅ Código commitado localmente
✅ .env.example criado
✅ README atualizado

## Passo 1: Criar Repositório no GitHub

1. Vá para https://github.com/new
2. Nome: ida-plena-web (ou outro de sua preferência)
3. Descrição: Plataforma de gestão de eventos para ONGs
4. Clique "Create repository"
5. Copie o comando de push que aparece

## Passo 2: Configurar Remote e Push

No PowerShell/Terminal:

\\\ash
cd C:\Users\bobrc\vida-plena-web
git remote add origin https://github.com/SEU_USUARIO/vida-plena-web.git
git branch -M main
git push -u origin main
\\\

(Substitua SEU_USUARIO pelo seu usuário do GitHub)

## Passo 3: Publicar no Vercel

1. Vá para https://vercel.com/new
2. Clique "Import Git Repository"
3. Cole a URL do seu repositório GitHub
4. Vercel detecta Next.js automaticamente
5. Clique "Deploy"

## Passo 4: Configurar Variáveis de Ambiente

Na dashboard do Vercel:
1. Vá para Project Settings → Environment Variables
2. Adicione:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

3. Clique "Deploy" novamente

## Passo 5: Configurar Domínio (Opcional)

1. Na dashboard Vercel: Settings → Domains
2. Adicione seu domínio customizado
3. Siga as instruções de DNS

## Pronto! 🎉

Seu site está live em:
- Default: https://vida-plena-web.vercel.app
- Custom: https://seu-dominio.com (se configurado)

## Próximos Passos

1. Testar em produção
2. Configurar RLS properly no Supabase
3. Importar dados reais
4. Ativar backups automáticos
5. Configurar monitoring

## Suporte

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
