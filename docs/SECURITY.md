# Segurança e privacidade

- Tokens são lidos em módulos `server-only`; a interface recebe apenas snapshots e estados de qualidade.
- `GITHUB_TOKEN` autentica apenas consultas GraphQL das contas pessoais. A lista da organização é endpoint público separado, sem reutilizar token.
- Não há OAuth/login, escrita no GitHub, coleta de e-mail ou leitura de repositórios privados.
- Snapshot local é atômico e restrito a dev/teste. Produção usa Upstash Redis REST configurado por segredos externos.
- A rota de sincronização rejeita segredo ausente e `Bearer` incorreto antes de consultar GitHub.
- Entradas de conteúdo usam schemas estritos: links HTTPS, slugs normalizados, mídia local dentro de `public/media` e arquivos existentes.
- Não são enviados dados a analytics ou logging de terceiros configurados por padrão. Erros inesperados de renderização são reportados ao console local/host.
- Dados pessoais (nome, biografia, contatos, certificados, imagens) só podem ser cadastrados após confirmação do titular. As coleções vazias do repositório são intencionais.
- Configure segredo de alta entropia, rotação e acesso mínimo no provedor. Nunca commit valores reais nem os inclua em capturas ou relatórios de build.

## Auditoria de dependências

Em 16/11/2026, `npm audit --omit=dev` retornou zero vulnerabilidades em dependências de runtime. O audit completo reportou 7 advisories moderados em dependências de desenvolvimento transitivas de ESLint/TypeScript ESLint via `minimatch`. Uma simulação de correção ficou sem resposta do registry e não alterou o lockfile. Não foi usado `npm audit fix --force`, que pode quebrar compatibilidade; reavalie quando houver release compatível.
