import type { PortfolioSnapshot } from "@/lib/activity/types";

export const SNAPSHOT_STALE_AFTER_MS = 36 * 60 * 60 * 1000;

export function markSnapshotStaleIfOutdated(
  snapshot: PortfolioSnapshot,
  now = new Date(),
  staleAfterMs = SNAPSHOT_STALE_AFTER_MS,
): PortfolioSnapshot {
  if (snapshot.quality === "unavailable") return snapshot;
  const generatedAt = Date.parse(snapshot.generatedAt);
  if (!Number.isFinite(generatedAt) || now.getTime() - generatedAt <= staleAfterMs) return snapshot;
  return { ...snapshot, quality: "stale" };
}
