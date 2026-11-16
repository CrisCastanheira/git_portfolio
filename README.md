# GitHub Unificado

Portfólio profissional em português brasileiro com projetos, certificados, trabalhos acadêmicos e uma visualização da atividade pública de duas contas pessoais do GitHub. A organização `Dazum-Digital` aparece em uma seção separada, consultada pela API pública do GitHub.

O projeto não inclui biografia, projetos, certificados ou métricas fictícias. Os arquivos de conteúdo começam vazios e as contribuições só aparecem depois de uma sincronização real. Veja [como adicionar conteúdo](docs/COMO-ADICIONAR-CONTEUDO.md), [configuração](docs/DEPLOY.md) e [limites de segurança](docs/SECURITY.md).

## Desenvolvimento local

Requisitos: Node.js `>=20.19.0` e npm. No Windows PowerShell:

```powershell
npm ci
Copy-Item .env.example .env.local
# Preencha as variáveis necessárias em .env.local
npm run dev
```

Sem `GITHUB_TOKEN` e sem snapshot, as páginas continuam navegáveis e a área de atividade explica que a sincronização ainda não ocorreu. Em desenvolvimento, os snapshots são gravados em `.next/cache/github-unificado/`; não use esse armazenamento em produção.

## Verificações

```powershell
npm run test:run
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

Playwright requer o Chromium instalado (`npx playwright install chromium`). Mais detalhes e limitações conhecidas estão em [TESTING.md](docs/TESTING.md).

## Estrutura

- `app/`: páginas, metadados SEO e rotas da API.
- `components/`: navegação, filtros, Skyline Contribution, atividade e galerias.
- `content/`: coleções JSON do titular, validadas antes da renderização.
- `lib/`: regras de atividade, clientes do GitHub, sincronização e storage.
- `public/media/`: mídias locais opcionalmente referenciadas pelo conteúdo.
- `docs/`: arquitetura, contratos de API, operação, conteúdo e segurança.

## Integrações e limites

As contas pessoais `CrisCastanheira` e `CristianoDazum` são consultadas via GraphQL com `GITHUB_TOKEN` somente no servidor. A organização `Dazum-Digital` é consultada via REST público, sem compartilhar o token ou as métricas pessoais. A configuração de produção, segredos e banco Redis pertencem ao titular do deploy; veja [DEPLOY.md](docs/DEPLOY.md). Nenhum deploy ou publicação é executado por este repositório.
