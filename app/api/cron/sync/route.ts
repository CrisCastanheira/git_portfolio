import { handleCronSync } from "@/lib/sync/cron-handler";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleCronSync(request);
}
