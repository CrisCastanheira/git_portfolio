# GitHub Unificado — Plano de implementação

> **Para execução:** seguir `superpowers:executing-plans` e `superpowers:test-driven-development` tarefa por tarefa. Atualizar o ledger após cada commit.

**Objetivo:** construir e documentar o portfólio GitHub Unificado com Skyline 2D/3D, integrações públicas segregadas e conteúdo expansível.

**Arquitetura:** Next.js App Router atende páginas e Route Handlers. Serviços server-only consultam GraphQL para contas pessoais, REST para a organização e persistem snapshots por uma interface local/Upstash. Conteúdo profissional é carregado de arquivos validados.

**Stack:** Next.js 16.4.6, React 19.3.1, TypeScript, Tailwind CSS 4.3.5, Zod 4.6.7, Vitest 5.1.0, Testing Library e Playwright 1.65.0; versões resolvidas no registry em 2026-11-13.

**Especificação:** `docs/superpowers/specs/2026-11-13-github-unificado-design.md`, além dos três documentos oficiais recebidos e do Prompt Mestre completo anexado.

## Restrições globais

- “Todo o conteúdo da interface deverá estar em português brasileiro.”
- “Inicialmente, coletar apenas contribuições públicas.”
- “Não misturar essas métricas com o calendário pessoal.”
- “Não disponibilizar tokens no navegador.”
- “Não utilizar dados fictícios como reais.”
- “Não alterar datas retornadas pela API indevidamente.”
- “Preservar o último snapshot válido.”
- “Não utilizar o sistema de arquivos local efêmero da hospedagem como armazenamento persistente em produção.”
- “Não faça merge na `main` nem publique em produção sem aprovação explícita.”
- Usar o componente do Anexo A e preservar 2D/3D, toque/mouse, teclado, paletas e reduced motion; não adicionar Three.js.
- Não inventar biografia, projetos, certificados, contatos ou resultados; coleções vazias devem ser válidas.

## Foco de revisão

1. Uma conta falha durante a coleta: a outra continua visível e a qualidade fica `partial`; testar em Task 2/3.
2. Período contém 29 de fevereiro, limites inclusivos e datas UTC: nenhum dia desloca; testar em Task 2.
3. Dados ausentes ou snapshot inexistente: gráfico vazio explícito e nunca ano simulado; testar em Task 2/5.
4. Configuração de produção sem Redis/cron: não grava em filesystem efêmero nem executa sincronização sem segredo; testar em Task 3.
5. Conteúdo malformado, links externos ou galeria sem imagens: validação/estado vazio seguro e navegação acessível; testar em Task 4/5.

## Arquivos e responsabilidades

- `app/`: rotas, layout, metadados e Route Handlers.
- `components/layout`, `components/activity`, `components/content`, `components/ui`: navegação/temas, filtros e visualização, galerias e componentes reutilizáveis; Skyline original em `components/ui/contribution-skyline.tsx`.
- `lib/activity`, `lib/github`, `lib/sync`, `lib/storage`, `lib/content`: regras puras, integração server-side, sincronização, persistência e validação/carregamento de conteúdo.
- `content/`: perfil, projetos, certificados, trabalhos e habilidades configuráveis, sem registros fictícios.
- `tests/unit`, `tests/integration`, `tests/e2e`: contratos de regras, adaptadores e jornadas de usuário.
- `docs/`: arquitetura, API, operação, segurança, testes e manutenção de conteúdo.

---

### Task 1: Fundação e navegação

**Arquivos:** `package.json`, lockfile, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, componentes de layout/tema e teste de fumaça.

**Interfaces:** produz layout pt-BR, tokens de tema, navegação compartilhada e shell inicial.

- [ ] Escrever teste de navegação acessível, atributo `lang="pt-BR"` e alternância de tema.
- [ ] Rodar `npm run test:run -- tests/unit/site-shell.test.tsx`; esperado: falha por ausência do shell.
- [ ] Implementar setup Next/Tailwind e shell mínimo para tornar o teste verde.
- [ ] Rodar o teste e `npm run build`; ambos devem concluir sem erros.
- [ ] Commit: `feat: bootstrap portfolio shell`.

### Task 2: Domínio de atividade e fontes GitHub

**Arquivos:** `lib/activity/{types,dates,aggregate,metrics}.ts`, `lib/github/{accounts,graphql,organization}.ts`, `app/api/{activity,organization}/route.ts`, testes unitários e de integração.

**Interfaces:** `aggregateContributions(accounts)`, `calculateMetrics(days, asOf)` e `fetchAccountContributions({login, from, to, token})`; org usa `fetchOrganizationRepositories(login)` separado.

- [ ] Escrever testes para soma por data, filtros, datas inclusivas/leap day, streak até ontem, erro parcial e conta ausente.
- [ ] Rodar `npm run test:run -- tests/unit/activity.test.ts tests/integration/github-sources.test.ts`; esperado: falha pela implementação ausente.
- [ ] Implementar normalização GraphQL com token server-only e sem `read:user`; implementar REST público para repositórios da organização.
- [ ] Rodar os testes; sucessos incluem payloads completos e erros deixam estado explícito, sem fabricar zeros.
- [ ] Commit: `feat: add GitHub activity services`.

### Task 3: Snapshot, cache e sincronização protegida

**Arquivos:** `lib/storage/{snapshot-store,local-snapshot-store,upstash-snapshot-store}.ts`, `lib/sync/sync-portfolio.ts`, `app/api/cron/sync/route.ts`, `vercel.json`, testes de armazenamento/cron/sync.

**Interfaces:** `SnapshotStore.getLatest()/putLatest(snapshot)`, `syncPortfolio({accounts, store, fetcher, now})`.

- [ ] Escrever testes para guardar/ler snapshot, segredo ausente/incorreto, falha parcial, último snapshot válido e retry limitado.
- [ ] Rodar os testes; esperado: falha por ausência de store/rota.
- [ ] Implementar filesystem somente em desenvolvimento/teste; Upstash REST sob env em produção; proteger cron por `CRON_SECRET`.
- [ ] Rodar `npm run test:run -- tests/unit/snapshot-store.test.ts tests/integration/sync-route.test.ts`; esperado: todos verdes.
- [ ] Commit: `feat: persist and sync portfolio snapshots`.

### Task 4: Conteúdo tipado e páginas profissionais

**Arquivos:** `lib/content/{schemas,loaders}.ts`, `content/**`, páginas `/projetos`, `/projetos/[slug]`, `/certificados`, `/trabalhos`, `/trabalhos/[slug]`, `/sobre`, `/contato`, galeria e testes.

**Interfaces:** schemas Zod para `Project`, `Certificate`, `AcademicWork`, `Profile`; loaders validam slugs, URLs e caminhos de mídia.

- [ ] Escrever testes para dados vazios, inválidos, slugs duplicados e campos opcionais de mídia.
- [ ] Rodar `npm run test:run -- tests/unit/content.test.ts`; esperado: falha até criar schemas/loaders.
- [ ] Implementar páginas dinâmicas, busca/filtros/ordenação e galeria acessível com modal, teclado e legendas.
- [ ] Rodar testes e validar estados vazios sem conteúdo inventado.
- [ ] Commit: `feat: add file-backed portfolio content`.

### Task 5: Skyline, homepage e experiência integrada

**Arquivos:** `components/ui/contribution-skyline.tsx`, `components/activity/**`, seções de projetos/certificados/organização, homepage, filtro e testes de componente.

**Interfaces:** a visualização recebe `ContributionDay[]` sempre explicitamente; seletores atualizam gráfico, estatísticas e qualidade simultaneamente.

- [x] Escrever testes para filtros e conteúdo do estado `unavailable`, além de fornecer `data=[]` sem acionar demo.
- [x] Rodar testes; esperado: falha por ausência da visualização integrada.
- [x] Integrar fielmente o componente do Anexo A e bloquear geração de demo em produção.
- [x] Rodar os testes; verificar que Skyline mantém modo 2D/3D, filtros e alertas de completude.
- [x] Commit: `feat: integrate contribution skyline and portfolio home`.

### Task 6: Operação, documentação, E2E e entrega

**Arquivos:** `.env.example`, `README.md`, `AGENTS.md`, `.github/copilot-instructions.md`, `docs/{ARCHITECTURE,API,COMO-ADICIONAR-CONTEUDO,TESTING,DEPLOY,SECURITY}.md`, sitemap/robots/favicon, Playwright e testes E2E.

- [x] Escrever jornadas E2E para navegação, filtros/2D-3D, listagem/detalhe/galeria e estados vazios.
- [x] Rodar `npm run test:e2e`: 2 passaram com Chromium.
- [x] Executar `npm run test:run` (30 testes), `npm run lint`, `npm run typecheck` e `npm run build`; corrigir erros observados.
- [x] Conferir conteúdo, metadados, env de exemplo e instruções de Preview sem publicar em Produção.
- [x] Commit: `docs: document operation and quality checks`.
