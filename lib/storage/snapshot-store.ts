import "server-only";
import type { PortfolioSnapshot } from "@/lib/activity/types";
import { LocalSnapshotStore } from "@/lib/storage/local-snapshot-store";
import { UpstashSnapshotStore } from "@/lib/storage/upstash-snapshot-store";

export interface SnapshotStore {
  getLatest(): Promise<PortfolioSnapshot | null>;
  putLatest(snapshot: PortfolioSnapshot): Promise<void>;
}

export function createSnapshotStore(
  env: Record<string, string | undefined> = process.env,
  fetcher: typeof fetch = fetch,
): SnapshotStore | null {
  const url = env.UPSTASH_REDIS_REST_URL?.trim();
  const token = env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (url && token) return new UpstashSnapshotStore(url, token, fetcher);
  if (env.NODE_ENV === "production") return null;
  return new LocalSnapshotStore();
}
