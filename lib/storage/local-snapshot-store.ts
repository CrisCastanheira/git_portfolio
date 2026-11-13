import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { PortfolioSnapshotSchema } from "@/lib/activity/schemas";
import type { PortfolioSnapshot } from "@/lib/activity/types";
import type { SnapshotStore } from "@/lib/storage/snapshot-store";

export class LocalSnapshotStore implements SnapshotStore {
  private readonly filePath: string;

  constructor(filePath = resolve(process.cwd(), ".cache", "portfolio-snapshot.json")) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("O armazenamento local não pode ser usado em produção.");
    }
    this.filePath = filePath;
  }

  async getLatest(): Promise<PortfolioSnapshot | null> {
    try {
      const content = await readFile(this.filePath, "utf8");
      return PortfolioSnapshotSchema.parse(JSON.parse(content));
    } catch (error) {
      if (isMissingFile(error)) return null;
      throw error;
    }
  }

  async putLatest(snapshot: PortfolioSnapshot): Promise<void> {
    const valid = PortfolioSnapshotSchema.parse(snapshot);
    const directory = dirname(this.filePath);
    const temporaryPath = `${this.filePath}.${randomUUID()}.tmp`;
    await mkdir(directory, { recursive: true });
    try {
      await writeFile(temporaryPath, `${JSON.stringify(valid, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
      await rename(temporaryPath, this.filePath);
    } catch (error) {
      const { unlink } = await import("node:fs/promises");
      await unlink(temporaryPath).catch(() => undefined);
      throw error;
    }
  }
}

function isMissingFile(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}
