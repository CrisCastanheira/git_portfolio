import { NextResponse } from "next/server";
import { markSnapshotStaleIfOutdated } from "@/lib/activity/freshness";
import { createSnapshotStore } from "@/lib/storage/snapshot-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = createSnapshotStore();
  if (!store) {
    return NextResponse.json({
      quality: "unavailable",
      snapshot: null,
      message: "Armazenamento persistente não configurado neste ambiente.",
    }, { status: 503 });
  }
  try {
    const snapshot = await store.getLatest();
    if (!snapshot) {
      return NextResponse.json({
        quality: "unavailable",
        snapshot: null,
        message: "Ainda não há uma sincronização válida. Configure o token e execute a rota de sincronização.",
      });
    }
    const currentSnapshot = markSnapshotStaleIfOutdated(snapshot);
    return NextResponse.json({ quality: currentSnapshot.quality, snapshot: currentSnapshot });
  } catch {
    return NextResponse.json({ quality: "unavailable", snapshot: null, message: "Não foi possível ler o snapshot." }, { status: 503 });
  }
}
