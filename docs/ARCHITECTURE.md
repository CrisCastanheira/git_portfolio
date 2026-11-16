# Arquitetura

## Aplicação

Next.js App Router entrega páginas server-rendered em pt-BR e componentes interativos no navegador. A interface inclui navegação responsiva, tema claro/escuro, páginas de portfólio tipadas, filtros, galerias com teclado, estados vazios e a Contribution Skyline 2D/3D do Anexo A. Respeita `prefers-reduced-motion`; não inclui Three.js.

## Atividade

- `CrisCastanheira` e `CristianoDazum`: coleta GraphQL de contribuições públicas, autenticação server-side por `GITHUB_TOKEN`.
- `Dazum-Digital`: lista de repositórios públicos via REST sem credencial e sem agregação aos dados das contas pessoais.
- Coleta pessoal usa intervalo UTC inclusivo de 365 datas, datas ISO e tratamento de conta indisponível como ausência, nunca zero presumido.
- Agregação e métricas são regras puras: totais, dias ativos, sequência atual até ontem e maior sequência.
- Filtros de conta/período recalculam, juntos, gráfico, estatísticas e qualidade da resposta.

## Sincronização e armazenamento

`GET /api/cron/sync` valida `Authorization: Bearer <CRON_SECRET>`, coleta as contas em paralelo com uma nova tentativa limitada e preserva o último snapshot válido em falha total. Qualidade `complete`, `partial`, `stale` ou `unavailable` sempre acompanha os dados. `GET /api/activity` serve o snapshot, marca com `stale` dados com mais de 36 horas e não dispara consulta ao GitHub em cada visualização.

`SnapshotStore` tem adaptador local atômico para desenvolvimento e adaptador HTTP REST do Upstash para produção. Sem Redis configurado em `NODE_ENV=production`, o sistema falha de forma explícita em vez de gravar no disco efêmero da função.

## Conteúdo e mídia

JSON de `content/` é validado por schemas estritos Zod. Coleções vazias são válidas. Projetos, certificados, trabalhos e perfil só são exibidos após cadastro real. URLs externas exigem HTTPS; mídia só pode apontar para arquivo local existente dentro de `public/media/`.

## Fluxo

```mermaid
flowchart LR
  Cron[Agendador protegido] --> Sync[Coletor server-side]
  Sync --> GraphQL[GitHub GraphQL pessoal]
  Sync --> Store[SnapshotStore]
  REST[GitHub REST público] --> OrgAPI[/api/organization]
  Browser[Navegador] --> ActivityAPI[/api/activity]
  ActivityAPI --> Store
  Browser --> UI[Skyline e filtros]
  Content[JSON validado] --> Pages[Páginas do portfólio]
```

Rotas e contratos estão descritos em [API.md](API.md); instalação externa em [DEPLOY.md](DEPLOY.md).
