# API

As rotas respondem JSON em UTF-8. Nenhuma rota devolve tokens.

## `GET /api/activity`

Lê o snapshot persistido; a rota é dinâmica, sem cache do navegador. Em sucesso:

```json
{
  "quality": "complete",
  "snapshot": {
    "generatedAt": "2026-11-13T07:00:00.000Z",
    "from": "2025-11-14",
    "to": "2026-11-13",
    "quality": "complete",
    "accounts": [],
    "days": [],
    "metrics": { "total": 0, "activeDays": 0, "currentStreak": 0, "longestStreak": 0 }
  }
}
```

Qualidades: `complete`, `partial`, `stale`, `unavailable`. Com snapshot ausente, Redis sem configuração em produção ou falha de leitura, responde qualidade `unavailable`, `snapshot: null`, mensagem e status `200` (sem snapshot) ou `503` (storage não disponível/falhou). A rota não inicia coleta.

## `GET /api/organization`

Consulta somente repositórios públicos de `Dazum-Digital`, paginados a 100 por página e em cache do servidor por uma hora.

```json
{
  "organization": "Dazum-Digital",
  "repositories": [{
    "id": 17,
    "name": "nome-real",
    "fullName": "Dazum-Digital/nome-real",
    "description": null,
    "url": "https://github.com/Dazum-Digital/nome-real",
    "language": "TypeScript",
    "stars": 0,
    "forks": 0,
    "updatedAt": "2026-11-12T12:00:00Z",
    "topics": []
  }]
}
```

Falha na API pública retorna `503`, array vazio e mensagem. O endpoint interrompe com erro explícito se a paginação exceder 100 páginas; não retorna uma lista truncada como se estivesse completa.

## `GET /api/cron/sync`

Sincroniza as duas contas pessoais e persiste o resultado. Exige `Authorization: Bearer <CRON_SECRET>`. Responde `200` quando salva snapshot completo/parcial; `401` para segredo incorreto; `503` quando segredo/storage não está configurado ou nenhuma conta respondeu; `500` em erro de armazenamento/coleta inesperado. Configure o segredo apenas no provedor, não neste repositório.

## Rotas de metadata

- `GET /robots.txt`: permite páginas públicas e bloqueia `/api/` de crawlers.
- `GET /sitemap.xml`: lista páginas e detalhes existentes apenas se `SITE_URL` HTTPS estiver configurado; sem host válido responde sitemap vazio, sem inventar domínio.
