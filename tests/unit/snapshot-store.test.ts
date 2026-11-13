import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalSnapshotStore } from "@/lib/storage/local-snapshot-store";
import { UpstashSnapshotStore } from "@/lib/storage/upstash-snapshot-store";
import { createSnapshotStore } from "@/lib/storage/snapshot-store";
import type { PortfolioSnapshot } from "@/lib/activity/types";

const temporaryDirectories: string[] = [];
async function createTemporaryPath() {
  const directory = await mkdtemp(join(tmpdir(), "github-unificado-"));
  temporaryDirectories.push(directory);
  return join(directory, "snapshot.json");
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

const snapshot: PortfolioSnapshot = {
  generatedAt: "2026-11-13T12:00:00.000Z",
  from: "2025-11-14",
  to: "2026-11-13",
  quality: "complete",
  accounts: [
    { login: "CrisCastanheira", status: "available", days: [{ date: "2026-11-12", count: 2 }] },
    { login: "CristianoDazum", status: "available", days: [{ date: "2026-11-12", count: 1 }] },
  ],
  days: [{ date: "2026-11-12", count: 3 }],
  metrics: { total: 3, activeDays: 1, currentStreak: 1, longestStreak: 1 },
};

describe("snapshot stores", () => {
  it("returns null before first write and stores a valid snapshot", async () => {
    const store = new LocalSnapshotStore(await createTemporaryPath());
    expect(await store.getLatest()).toBeNull();
    await store.putLatest(snapshot);
    expect(await store.getLatest()).toEqual(snapshot);
  });

  it("uses Upstash REST command requests with its server token", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ result: null }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ result: "OK" }), { status: 200 }));
    const store = new UpstashSnapshotStore("https://redis.example", "server-secret", fetcher);
    expect(await store.getLatest()).toBeNull();
    await store.putLatest(snapshot);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(new Headers(fetcher.mock.calls[0]?.[1]?.headers).get("authorization")).toBe("Bearer server-secret");
  });

  it("never selects local filesystem storage in production without Redis", () => {
    expect(createSnapshotStore({ NODE_ENV: "production" })).toBeNull();
  });
});
