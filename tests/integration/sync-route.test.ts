import { describe, expect, it, vi } from "vitest";
import { handleCronSync } from "@/lib/sync/cron-handler";
import type { PortfolioSnapshot } from "@/lib/activity/types";
import type { SnapshotStore } from "@/lib/storage/snapshot-store";

const emptySnapshot: PortfolioSnapshot = {
  generatedAt: "2026-11-13T12:00:00.000Z",
  from: "2025-11-14",
  to: "2026-11-13",
  quality: "complete",
  accounts: [],
  days: [],
  metrics: { total: 0, activeDays: 0, currentStreak: 0, longestStreak: 0 },
};

function createStore(): SnapshotStore {
  return { getLatest: vi.fn().mockResolvedValue(null), putLatest: vi.fn().mockResolvedValue(undefined) };
}

describe("protected sync endpoint", () => {
  it("rejects an absent cron secret and does not synchronize", async () => {
    const sync = vi.fn();
    const response = await handleCronSync(new Request("https://example.test/api/cron/sync"), {
      env: {}, storeFactory: () => createStore(), sync,
    });
    expect(response.status).toBe(503);
    expect(sync).not.toHaveBeenCalled();
  });

  it("rejects an incorrect bearer token", async () => {
    const sync = vi.fn();
    const response = await handleCronSync(new Request("https://example.test/api/cron/sync", {
      headers: { Authorization: "Bearer wrong" },
    }), { env: { CRON_SECRET: "right" }, storeFactory: () => createStore(), sync });
    expect(response.status).toBe(401);
    expect(sync).not.toHaveBeenCalled();
  });

  it("synchronizes only with the correct bearer token and configured store", async () => {
    const store = createStore();
    const sync = vi.fn().mockResolvedValue(emptySnapshot);
    const response = await handleCronSync(new Request("https://example.test/api/cron/sync", {
      headers: { Authorization: "Bearer right" },
    }), { env: { CRON_SECRET: "right" }, storeFactory: () => store, sync });
    expect(response.status).toBe(200);
    expect(sync).toHaveBeenCalledOnce();
    expect(await response.json()).toMatchObject({ success: true, quality: "complete" });
  });
});
