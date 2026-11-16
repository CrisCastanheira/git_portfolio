import "server-only";
import { aggregateContributions } from "@/lib/activity/aggregate";
import { addUtcDays } from "@/lib/activity/dates";
import { calculateMetrics } from "@/lib/activity/metrics";
import type { AccountActivity, PortfolioSnapshot } from "@/lib/activity/types";
import { getGithubToken, fetchAccountContributions } from "@/lib/github/graphql";
import { PERSONAL_GITHUB_ACCOUNTS } from "@/lib/github/accounts";
import type { SnapshotStore } from "@/lib/storage/snapshot-store";

type SyncAccount = { login: string };
type Fetcher = (input: { login: string; from: string; to: string; token: string }) => Promise<AccountActivity>;

export async function syncPortfolio(input: {
  store: SnapshotStore;
  accounts?: readonly SyncAccount[];
  fetcher?: Fetcher;
  token?: string;
  now?: Date;
  maxRetries?: number;
  retryDelayMs?: number;
}): Promise<PortfolioSnapshot> {
  const now = input.now ?? new Date();
  const to = now.toISOString().slice(0, 10);
  const from = addUtcDays(to, -364);
  const token = input.token ?? getGithubToken() ?? "";
  const accounts = input.accounts ?? PERSONAL_GITHUB_ACCOUNTS;
  const fetcher = input.fetcher ?? fetchAccountContributions;
  const maxRetries = Math.max(0, Math.min(2, Math.floor(input.maxRetries ?? 1)));
  const retryDelayMs = Math.max(0, input.retryDelayMs ?? 150);

  const results = await Promise.all(accounts.map(async ({ login }) => {
    let result: AccountActivity = { login, status: "unavailable", days: [], message: "Consulta não concluída." };
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        result = await fetcher({ login, from, to, token });
      } catch (error) {
        result = {
          login,
          status: "unavailable",
          days: [],
          message: error instanceof Error ? error.message : "Falha desconhecida na coleta.",
        };
      }
      if (result.status === "available" || attempt === maxRetries) return result;
      if (retryDelayMs > 0) await new Promise((resolve) => setTimeout(resolve, retryDelayMs * (attempt + 1)));
    }
    return result;
  }));

  const aggregated = aggregateContributions(results);
  if (aggregated.quality === "unavailable") {
    const previous = await input.store.getLatest();
    if (previous) {
      const stale = { ...previous, quality: "stale" as const };
      await input.store.putLatest(stale);
      return stale;
    }
    return {
      generatedAt: now.toISOString(),
      from,
      to,
      quality: "unavailable",
      accounts: results,
      days: [],
      metrics: null,
    };
  }

  const snapshot: PortfolioSnapshot = {
    generatedAt: now.toISOString(),
    from,
    to,
    quality: aggregated.quality,
    accounts: aggregated.accounts,
    days: aggregated.days,
    metrics: calculateMetrics(aggregated.days, to),
  };
  await input.store.putLatest(snapshot);
  return snapshot;
}
