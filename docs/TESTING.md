# Testes e qualidade

## Comandos

- `npm run test:run`: Vitest, testes de domínio, schemas, componentes e rotas.
- `npm run test:e2e`: jornadas Playwright com Chromium local.
- `npm run lint`: ESLint.
- `npm run typecheck`: TypeScript sem emissão.
- `npm run build`: build Next.js de produção local; não publica a aplicação.

Instale o browser em uma máquina nova com `npx playwright install chromium`. O teste E2E substitui chamadas a `/api/activity` e `/api/organization` por fixtures explícitas de teste. Essas fixtures nunca são incluídas no build como conteúdo nem salvas no storage real.

## Cobertura

Regras testadas incluem soma por data, datas UTC inclusivas e bissextas, sequências, indisponibilidade parcial, consultas GraphQL/REST separadas, paginação da organização, snapshots locais/Upstash, proteção do cron, schemas de conteúdo, tema, estado vazio, filtro de atividade, modo 2D/3D e acessibilidade da galeria.

## Limitações conhecidas

O ambiente de desenvolvimento desta implementação não tem os segredos nem a configuração de produção. Testes usam injeção/mocks e não comprovam que tokens ou serviços reais estão ativos. Playwright requer Chromium compatível; falha de instalação deve ser registrada, sem ocultar testes unitários.

Em 16/11/2026, `npm audit --omit=dev` retornou zero vulnerabilidades em dependências de runtime. O audit total sinalizou 7 advisories moderados em dependências transitivas somente de desenvolvimento ligadas ao ESLint/TypeScript ESLint (`minimatch`). A tentativa de simular uma atualização ficou sem resposta do registry; não foi aplicada atualização forçada. Reavalie quando houver release compatível; não force upgrade principal automaticamente.
