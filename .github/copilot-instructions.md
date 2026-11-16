# Instruções para agentes de código

- Leia o `AGENTS.md` da raiz e guias pertinentes em `node_modules/next/dist/docs/` antes de alterar convenções Next.js.
- Preserve a branch da tarefa e arquivos existentes. Nunca publique em `main` ou faça deploy sem autorização explícita.
- Mantenha interface pt-BR, acessível por teclado e responsiva; respeite `prefers-reduced-motion`.
- Não invente conteúdo profissional, credenciais, dados GitHub ou resultados de teste. Mantenha coleções vazias quando não houver informação confirmada.
- Tokens GitHub e Redis só no servidor. Preserve separação entre contas pessoais e organização.
- Não troque storage de produção por filesystem efêmero nem inclua dados privados no cliente.
- Para mudanças de lógica, acrescente teste determinístico e execute os comandos aplicáveis de `docs/TESTING.md`.
