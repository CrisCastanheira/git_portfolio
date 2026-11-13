import "server-only";
import type { PortfolioSnapshot } from "@/lib/activity/types";
import { PERSONAL_GITHUB_ACCOUNTS } from "@/lib/github/accounts";
import { createSnapshotStore } from "@/lib/storage/snapshot-store";
import type { SnapshotStore } from "@/lib/storage/snapshot-store";
import { syncPortfolio } from "@/lib/sync/sync-portfolio";

type HandlerDependencies = {
  env?: Record<string, string | undefined>;
  storeFactory?: (env: Record<string, string | undefined>) => SnapshotStore | null;
  sync?: (input: { store: SnapshotStore }) => Promise<PortfolioSnapshot>;
};

export async function handleCronSync(request: Request, dependencies: HandlerDependencies = {}): Promise<Response> {
  const env = dependencies.env ?? process.env;
  const secret = env.CRON_SECRET?.trim();
  if (!secret) return Response.json({ success: false, error: "CRON_SECRET não configurado." }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ success: false, error: "Credencial de sincronização inválida." }, { status: 401 });
  }

  const store = (dependencies.storeFactory ?? createSnapshotStore)(env);
  if (!store) return Response.json({ success: false, error: "Armazenamento persistente não configurado." }, { status: 503 });
  try {
    const snapshot = await (dependencies.sync ?? syncPortfolio)({ store });
    if (snapshot.quality === "unavailable") {
      return Response.json({ success: false, quality: snapshot.quality, accounts: PERSONAL_GITHUB_ACCOUNTS.map(({ login }) => login) }, { status: 503 });
    }
    return Response.json({ success: true, quality: snapshot.quality, generatedAt: snapshot.generatedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido durante a sincronização.";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
