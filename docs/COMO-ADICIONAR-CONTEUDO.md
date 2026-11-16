# Como adicionar conteúdo

O conteúdo profissional fica nos JSON versionados em `content/`. As coleções iniciam vazias intencionalmente. Não use exemplos fictícios como dados publicados. Em caso de dúvida, confirme título, datas, links e direitos de uso com o titular.

## Projetos — `content/projects.json`

Lista JSON. Campos obrigatórios: `title`, `slug`, `summary`, `owner` (`personal` ou `organization`). Campos opcionais: `description`, `tags`, `repositoryUrl`, `demoUrl`, `featured`, `createdAt`, `gallery`.

```json
[
  {
    "title": "Título confirmado",
    "slug": "titulo-confirmado",
    "summary": "Resumo verificado do projeto.",
    "owner": "personal",
    "tags": [],
    "repositoryUrl": "https://github.com/conta/repositorio",
    "featured": false,
    "gallery": []
  }
]
```

O trecho é apenas modelo de formato: substituir todos os valores antes de cadastrar. Slugs devem ser únicos e usar minúsculas, números e hífens. Repositórios públicos da organização são carregados da API; não replique métricas manuais deles neste JSON.

## Certificados — `content/certificates.json`

Cada item precisa de `title` e `issuer`. Pode incluir `issuedAt` (`AAAA-MM-DD`), `summary`, `credentialUrl` HTTPS, `image` local e `tags`.

## Trabalhos acadêmicos — `content/works.json`

Cada item precisa de `title`, `slug` e `summary`. Pode incluir `description`, `institution`, `authors`, `year`, `url` HTTPS, `gallery` e `tags`.

## Perfil e competências

`content/profile.json`: `displayName`, `headline`, `introduction`, `biography`, `email`, `avatar` local e `socialLinks` (`label`, `url` HTTPS). `content/skills.json`: lista de `name`, com `category` e `description` opcionais.

O perfil começa `{}` e habilidades `[]`; isso gera páginas com estado vazio, sem inventar biografia ou e-mail. O conteúdo da interface deve continuar em pt-BR.

## Imagens e galerias

Coloque arquivos autorizados em `public/media/`. Use caminho com barra inicial como `/media/projeto/captura.png`, alt text em português e legenda opcional. O loader valida arquivo existente, restringe caminhos a `public/media` e rejeita links remotos. Mantenha dimensões e tamanho adequados e evite publicar dados privados em capturas de tela.

Antes de enviar conteúdo, valide com `npm run test:run`, `npm run lint`, `npm run typecheck` e `npm run build`.
