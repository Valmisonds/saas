# HabitFlow

App B2C de acompanhamento de hábito de saúde (sono, hidratação ou exercício), com
onboarding personalizado, assinatura recorrente, e-mails de ativação automáticos e
suporte com IA. Construído para custo e manutenção mínimos.

Pilha: **Next.js 16** (site + app) · **Supabase** (auth + banco, grátis) ·
**Resend** (e-mails, grátis até 3.000/mês) · **Polar.sh** (pagamentos, sem
mensalidade — só taxa por venda) · **Chatwoot Cloud** (suporte com IA, grátis) ·
**Vercel** (hospedagem + cron jobs, grátis).

## O que já está pronto no código

- Landing page com captura de lista de espera (`/`)
- Login sem senha por link mágico (`/login`)
- Onboarding de 2 perguntas que gera um plano personalizado na hora — o "momento aha" (`/dashboard`)
- Registro diário de 1 toque com contador de sequência (streak)
- Página de planos com checkout via Polar.sh (`/pricing`)
- Portal do cliente para o usuário gerenciar/cancelar a própria assinatura (`/api/portal`)
- Webhook que ativa/cancela o plano automaticamente quando o pagamento muda (`/api/webhooks/polar`)
- Sequência de e-mail automática nos dias 1, 2, 3, 5 e 7 após cadastro (`/api/cron/activation-emails`, agendado via `vercel.json`)
- Widget de suporte com IA (Chatwoot Captain) embutido no site
- Base de conhecimento inicial para o suporte de IA em [`support/faq.md`](support/faq.md)

## O que só você pode fazer (não é possível automatizar)

Essas etapas exigem seus dados pessoais/bancários ou aprovação humana — nenhuma
ferramenta de IA pode fazer isso por você:

1. Criar as contas nos serviços abaixo
2. Comprar um domínio (opcional no início — a Vercel dá uma URL gratuita tipo `seuapp.vercel.app`)
3. Revisar e publicar posts em redes sociais (rascunhos podem ser gerados, mas postar 100% automático viola os termos da maioria das redes e arrisca a marca)
4. Responder tickets de suporte que a IA não conseguir resolver sozinha

### Qual é o mínimo real pra colocar no ar

Só duas contas exigem seus dados pessoais/financeiros: **domínio** (cartão) e
**Polar.sh** (conta bancária, pra você receber o dinheiro das assinaturas).

As outras duas obrigatórias — **Vercel** (hospedagem) e **Supabase** (banco de
dados) — dá pra criar clicando em "Continue with GitHub", usando a mesma conta
GitHub já conectada nesta sessão. Sem senha nova, sem cartão.

**Resend** (e-mail) e **Chatwoot** (suporte com IA) são opcionais pra começar —
o app já roda sem eles: o cadastro na lista de espera funciona normalmente sem
enviar e-mail de confirmação, e o site simplesmente não mostra o widget de chat
até você configurar. Ative os dois quando quiser, sem precisar tocar no código
de novo — é só preencher as variáveis de ambiente correspondentes.

## Checklist de configuração (siga nesta ordem)

### 1. Supabase (auth + banco de dados) — grátis
1. Crie uma conta em [supabase.com](https://supabase.com) e um novo projeto
2. Vá em **Project Settings > API** e copie: `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`, `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`
3. Vá em **SQL Editor > New query**, cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e rode

### 2. Resend (e-mail transacional) — grátis até 3.000 e-mails/mês — opcional agora, pode pular
1. Crie uma conta em [resend.com](https://resend.com)
2. Em **API Keys**, crie uma chave → `RESEND_API_KEY`
3. Enquanto não verificar um domínio próprio, o remetente fica travado em `onboarding@resend.dev` — funciona para testar, mas para enviar aos seus usuários reais verifique um domínio em **Domains**

### 3. Polar.sh (pagamentos) — sem mensalidade, ~4% + $0.40 por venda
1. Crie uma conta em [polar.sh](https://polar.sh) (comece no modo **sandbox** para testar sem dinheiro real)
2. Crie dois produtos de assinatura: **Plus** ($9/mês) e **Pro** ($18/mês)
3. Copie o ID de cada produto → `POLAR_PRODUCT_PLUS_ID` / `POLAR_PRODUCT_PRO_ID` (mesmo valor também em `NEXT_PUBLIC_POLAR_PRODUCT_PLUS` / `NEXT_PUBLIC_POLAR_PRODUCT_PRO`)
4. Em **Settings > API Keys**, crie um token → `POLAR_ACCESS_TOKEN`
5. Em **Settings > Webhooks**, crie um webhook apontando para `https://SEU-DOMINIO/api/webhooks/polar`, copie o secret → `POLAR_WEBHOOK_SECRET`
6. Quando estiver pronto para receber pagamentos de verdade, troque `POLAR_SERVER=sandbox` por `POLAR_SERVER=production` e complete a verificação de conta bancária pedida pela Polar

### 4. Chatwoot (suporte com IA) — grátis — opcional agora, pode pular
1. Crie uma conta em [chatwoot.com](https://www.chatwoot.com/) (plano cloud grátis)
2. Crie uma "Website Inbox" → copie o `websiteToken` → `NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN`, e a base URL (geralmente `https://app.chatwoot.com`) → `NEXT_PUBLIC_CHATWOOT_BASE_URL`
3. Ative o agente de IA **Captain** e cole o conteúdo de [`support/faq.md`](support/faq.md) na base de conhecimento dele

### 5. Vercel (hospedagem + cron) — grátis
1. Rode `vercel` na pasta do projeto (ou conecte o repositório [github.com/Valmisonds/saas](https://github.com/Valmisonds/saas) pelo dashboard da Vercel)
2. Em **Settings > Environment Variables**, cole todas as variáveis do seu `.env.local`
3. Gere um valor aleatório para `CRON_SECRET` (ex.: `openssl rand -hex 32`) e adicione também em **Settings > Environment Variables** — a Vercel usa isso automaticamente para autenticar o cron job diário definido em `vercel.json`
4. Defina `NEXT_PUBLIC_APP_URL` com a URL final do site
5. Faça o deploy

## Rodando localmente

```bash
cp .env.example .env.local   # preencha com os valores do checklist acima
npm install
npm run dev
```

Abra `http://localhost:3000`.

## O que ainda exige trabalho contínuo seu (mesmo com tudo automatizado)

- Revisar/aprovar posts de conteúdo antes de publicar nas redes
- Responder os poucos tickets que a IA de suporte escalar para humano
- Olhar o dashboard da Polar 1x/semana para acompanhar MRR e cancelamentos
- Ajustar preço/features conforme o feedback dos primeiros usuários reais

Isso é o mínimo realista — nenhuma ferramenta remove 100% do trabalho de rodar um
negócio, mas o que está automatizado aqui (cobrança, ativação por e-mail, primeira
linha de suporte) é o que normalmente consome mais tempo no dia a dia.
