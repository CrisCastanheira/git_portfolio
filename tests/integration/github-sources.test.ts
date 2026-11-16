import { describe, expect, it, vi } from "vitest";
import { fetchAccountContributions } from "@/lib/github/graphql";
import { fetchOrganizationRepositories } from "@/lib/github/organization";

describe("GitHub sources", () => {
  it("queries one personal account via GraphQL with server token and UTC range", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              weeks: [{ contributionDays: [{ date: "2024-02-29", contributionCount: 6 }] }],
            },
          },
        },
      },
    }), { status: 200, headers: { "content-type": "application/json" } }));

    const result = await fetchAccountContributions({
      login: "CrisCastanheira",
      from: "2024-02-28",
      to: "2024-03-01",
      token: "test-token",
      fetcher,
    });

    expect(result).toEqual({
      login: "CrisCastanheira",
      status: "available",
      days: [{ date: "2024-02-29", count: 6 }],
    });
    const [url, init] = fetcher.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.github.com/graphql");
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer test-token");
    expect(JSON.parse(String(init.body)).variables).toEqual({
      login: "CrisCastanheira",
      from: "2024-02-28T00:00:00.000Z",
      to: "2024-03-01T23:59:59.999Z",
    });
  });

  it("keeps the organization REST request separate and public", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify([{
      id: 17,
      name: "site-publico",
      full_name: "Dazum-Digital/site-publico",
      description: null,
      html_url: "https://github.com/Dazum-Digital/site-publico",
      language: "TypeScript",
      stargazers_count: 2,
      forks_count: 1,
      updated_at: "2026-11-12T12:00:00Z",
      topics: [],
    }]), { status: 200, headers: { "content-type": "application/json" } }));

    const repos = await fetchOrganizationRepositories("Dazum-Digital", fetcher);
    expect(repos).toEqual([{
      id: 17,
      name: "site-publico",
      fullName: "Dazum-Digital/site-publico",
      description: null,
      url: "https://github.com/Dazum-Digital/site-publico",
      language: "TypeScript",
      stars: 2,
      forks: 1,
      updatedAt: "2026-11-12T12:00:00Z",
      topics: [],
    }]);
    const [url, init] = fetcher.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/orgs/Dazum-Digital/repos?type=public");
    expect(new Headers(init.headers).has("authorization")).toBe(false);
  });

  it("paginates public organization repositories without skipping pages", async () => {
    const repository = (id: number) => ({
      id,
      name: `repo-${id}`,
      full_name: `Dazum-Digital/repo-${id}`,
      html_url: `https://github.com/Dazum-Digital/repo-${id}`,
      updated_at: "2026-11-12T12:00:00Z",
    });
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(Array.from({ length: 100 }, (_, i) => repository(i + 1))), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([repository(101)]), { status: 200 }));

    const repos = await fetchOrganizationRepositories("Dazum-Digital", fetcher);

    expect(repos).toHaveLength(101);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(String(fetcher.mock.calls[0]?.[0])).toContain("page=1");
    expect(String(fetcher.mock.calls[1]?.[0])).toContain("page=2");
  });
});
