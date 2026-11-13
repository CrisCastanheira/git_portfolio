import "server-only";
import { PortfolioSnapshotSchema } from "@/lib/activity/schemas";
import type { PortfolioSnapshot } from "@/lib/activity/types";
import type { SnapshotStore } from "@/lib/storage/snapshot-store";

const KEY = "github-unificado:portfolio-snapshot:v1";

export class UpstashSnapshotStore implements SnapshotStore {
  constructor(
    private readonly url: string,
    private readonly token: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {
    if (!url.trim() || !token.trim()) throw new Error("A URL e o token REST do Upstash são obrigatórios.");
  }

  async getLatest(): Promise<PortfolioSnapshot | null> {
    const result = await this.command(["GET", KEY]);
    if (result === null || result === undefined) return null;
    if (typeof result !== "string") throw new Error("O snapshot do Redis tem formato inválido.");
    return PortfolioSnapshotSchema.parse(JSON.parse(result));
  }

  async putLatest(snapshot: PortfolioSnapshot): Promise<void> {
    const valid = PortfolioSnapshotSchema.parse(snapshot);
    await this.command(["SET", KEY, JSON.stringify(valid)]);
  }

  private async command(command: string[]): Promise<unknown> {
    const response = await this.fetcher(this.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Upstash Redis respondeu HTTP ${response.status}.`);
    const payload = await response.json() as { result?: unknown; error?: string };
    if (payload.error) throw new Error(`Upstash Redis: ${payload.error}`);
    return payload.result;
  }
}
