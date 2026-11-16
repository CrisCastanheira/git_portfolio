<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Projeto GitHub Unificado

- Leia `docs/ARCHITECTURE.md`, `docs/API.md` e a documentação da tarefa antes de alterar integrações.
- Interface, conteúdo e mensagens do produto devem estar em português brasileiro.
- Não preencha `content/` com dados inventados; preserve coleções vazias até receber conteúdo confirmado.
- Mantenha `GITHUB_TOKEN`, credenciais Upstash e `CRON_SECRET` no servidor. Nunca os prefixe com `NEXT_PUBLIC_`.
- A atividade das contas pessoais e os repositórios públicos da organização são fontes distintas; não agregue uma fonte à outra.
- Preserve estados `complete`, `partial`, `stale` e `unavailable`; ausência de uma conta nunca significa zero contribuições.
- Antes de mexer em páginas ou convenções do App Router, consulte a documentação instalada em `node_modules/next/dist/docs/`.
- Execute testes e validações pertinentes conforme `docs/TESTING.md`. Não informe sucesso sem observar o comando concluído.
