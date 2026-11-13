# GitHub Unificado — Design de implementação

## Intenção

Entregar um portfólio profissional em português brasileiro que apresente a identidade configurada pelo titular, atividades públicas de duas contas pessoais, repositórios públicos da organização em seção independente e conteúdo profissional mantido em arquivos. O calendário deve preservar o Contribution Skyline 2D/3D do Anexo A sem transformar dados ausentes em zeros ou demonstrações em resultados reais.

## Objetivos

- App Next.js responsivo com navegação para Início, Projetos, Certificados, Trabalhos, Sobre e Contato.
- GraphQL server-side para `CrisCastanheira` e `CristianoDazum`; API REST pública separada para `Dazum-Digital`.
- Consolidação diária por `YYYY-MM-DD`, métricas, filtros e rótulo metodológico de contribuições agregadas.
- Conteúdo tipado e validado em arquivos JSON/TypeScript, sem conteúdo pessoal inventado.
- Sincronização diária preparada, snapshot persistente em produção quando o Redis REST for configurado, e armazenamento local apenas para desenvolvimento/testes.
- Testes automatizados e documentação suficiente para continuar adicionando conteúdo e configurar serviços externos.

## Fora de escopo

- CMS/painel administrativo, banco de dados relacional e coleta de contribuições privadas no MVP.
- Deploy em Produção, alteração da `main` ou publicação de conteúdo biográfico não fornecido.
- Preencher o portfólio com projetos, certificados, imagens, e-mail, LinkedIn ou resultados que não foram fornecidos.

## Abordagens consideradas

1. **Next.js App Router full-stack (escolhida):** páginas e endpoints no mesmo projeto, integração e credenciais no servidor, conteúdo versionado em arquivos e cron da Vercel. Corresponde à stack exigida e suporta Preview e rotas dinâmicas.
2. **Frontend estático com API separada:** reduz o runtime do site, mas duplica deploy, configuração e segurança sem benefício para o escopo atual.
3. **CMS e banco desde o início:** facilita edição por interface, mas contraria a preferência por arquivos e adiciona custo e credenciais antes da necessidade.

## Arquitetura e escolhas

- Next.js App Router, React, TypeScript, Tailwind CSS v4, componentes em convenção shadcn (`components/ui`), Zod e Vitest/Testing Library/Playwright.
- Tokens visuais próprios, verde como acento, tema claro/escuro persistido no navegador, navegação por teclado e suporte a movimento reduzido.
- Contas pessoais centralizadas em `lib/github/accounts.ts`. O token `GITHUB_TOKEN` é opcional para a aplicação local, nunca vai ao cliente, e a documentação exige um token sem o escopo `read:user` para manter a coleta pública. A GraphQL API não oferece um argumento para excluir contagens privadas; a proteção depende do escopo mínimo do token.
- `Dazum-Digital` usa somente endpoints públicos REST de organização/repositórios e nunca participa da soma pessoal.
- `PortfolioSnapshot` mantém status por conta e qualidade `complete | partial | stale | unavailable`. Somente contas consultadas com sucesso entram no total; ausência/falha não equivale a zero.
- Interface `SnapshotStore`: arquivo local em desenvolvimento, Upstash Redis REST em produção. Sem configuração Redis, rotas reportam indisponibilidade; não há fallback para filesystem efêmero da hospedagem.
- Coleções vazias e mensagens úteis substituem conteúdo não informado. Dados fictícios, se necessários em testes, ficam em fixtures nomeadas como tais.
- O componente original será integrado em `components/ui/contribution-skyline.tsx`; `data` sempre será passado pela aplicação e a geração automática ficará desativada em produção.

## Limitações conhecidas no início

Não há conteúdo local, token GraphQL, configuração Redis, `CRON_SECRET`, conta Vercel ou domínio configurados. A implementação deve funcionar em estados vazios e expor precisamente o que falta. A POC real do GraphQL e a sincronização persistente só podem ser validadas após configuração das credenciais; os contratos serão validados com fixtures de API e testes locais.

## Fontes normativas

- Documento 1, Documento 2 e `Prompt_Mestre_Implementacao_GitHub_Unificado.txt`, fornecidos pelo usuário.
- Prompt Mestre completo anexado nesta conversa.
- A implementação respeita as instruções diretas do usuário sobre branch, commits, ausência de deploy em Produção e preservação de dados.
