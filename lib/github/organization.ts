type Fetcher = typeof fetch;

export type OrganizationRepository = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
};

const PAGE_SIZE = 100;
const MAX_PAGES = 100;

export async function fetchOrganizationRepositories(
  login: string,
  fetcher: Fetcher = fetch,
): Promise<OrganizationRepository[]> {
  const repositories: OrganizationRepository[] = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const url = new URL(`https://api.github.com/orgs/${encodeURIComponent(login)}/repos`);
    url.searchParams.set("type", "public");
    url.searchParams.set("sort", "updated");
    url.searchParams.set("direction", "desc");
    url.searchParams.set("per_page", String(PAGE_SIZE));
    url.searchParams.set("page", String(page));
    const response = await fetcher(url.toString(), {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`GitHub REST respondeu HTTP ${response.status} para a organização ${login}.`);
    const payload = await response.json() as unknown;
    if (!Array.isArray(payload)) throw new Error("Resposta de repositórios da organização inválida.");
    repositories.push(...payload.flatMap((entry): OrganizationRepository[] => {
      if (!entry || typeof entry !== "object") return [];
      const repo = entry as Record<string, unknown>;
      if (repo.private === true || typeof repo.id !== "number" || typeof repo.name !== "string" ||
        typeof repo.full_name !== "string" || typeof repo.html_url !== "string" || typeof repo.updated_at !== "string") return [];
      return [{
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: typeof repo.description === "string" ? repo.description : null,
        url: repo.html_url,
        language: typeof repo.language === "string" ? repo.language : null,
        stars: typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0,
        forks: typeof repo.forks_count === "number" ? repo.forks_count : 0,
        updatedAt: repo.updated_at,
        topics: Array.isArray(repo.topics) ? repo.topics.filter((topic): topic is string => typeof topic === "string") : [],
      }];
    }));
    if (payload.length < PAGE_SIZE) return repositories;
  }
  throw new Error(`A organização ${login} excedeu o limite seguro de ${MAX_PAGES * PAGE_SIZE} repositórios por consulta.`);
}
