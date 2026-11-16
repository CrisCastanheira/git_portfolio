# Configuração de Preview e produção

Esta implementação não publica nem implanta. O deploy é uma ação do titular e deve primeiro ser feito como Preview após revisão da branch.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` em desenvolvimento ou cadastre as mesmas chaves no provedor de hospedagem. Não versione `.env.local` nem exponha variáveis como `NEXT_PUBLIC_*`.

- `SITE_URL`: origem HTTPS real do Preview/produção; habilita URL canônica do sitemap. Em Preview, use a URL real daquele ambiente.
- `GITHUB_TOKEN`: token de servidor para a consulta GraphQL das duas contas pessoais. Conceda somente o acesso necessário às contribuições públicas; nunca o envie ao cliente.
- `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`: endpoint e credencial REST de um Redis Upstash dedicado/persistente para snapshots de produção.
- `CRON_SECRET`: segredo de alta entropia compartilhado com o agendador para proteger a sincronização. Não reutilize `GITHUB_TOKEN`.

Valores não são incluídos neste repositório. Confirme antes do Preview que o endpoint Redis pertence ao projeto correto, que o token é válido e que a conta GitHub é acessível pelo token.

## Fluxo sugerido pelo titular

1. Configure Node `>=20.19.0`, instale com `npm ci` e execute [as verificações locais](TESTING.md).
2. Cadastre segredos em ambiente **Preview** do provedor e defina `SITE_URL` para a URL real de preview.
3. Construa o Preview sem domínio de produção, inspecione todas as páginas e os retornos `/api/activity`, `/api/organization` e `/robots.txt`.
4. Execute uma primeira sincronização autenticada ao endpoint `/api/cron/sync`, valide a qualidade e `generatedAt` do snapshot; não compartilhe a credencial na URL ou em logs.
5. Para ativar a coleta diária no Vercel, confirme que o projeto está vinculado ao repositório e que `CRON_SECRET` está cadastrado. `vercel.json` agenda uma chamada diária às 07:00 UTC. A documentação atual do Vercel descreve autenticação do Cron com `Authorization: Bearer` usando esse segredo: [Cron Jobs](https://vercel.com/docs/cron-jobs).
6. Produção, domínio próprio, DNS e publicação dependem de aprovação explícita do titular.

O `SnapshotStore` de filesystem atende somente dev/teste local. Em produção, Redis não configurado produz `503` claro e nunca cai silenciosamente para disco local. Antes de Preview, confirme que região, retenção, custos e política de backup do storage correspondem ao projeto.
