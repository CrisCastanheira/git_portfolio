import { NextResponse } from "next/server";
import { ORGANIZATION_GITHUB_LOGIN } from "@/lib/github/accounts";
import { fetchOrganizationRepositories } from "@/lib/github/organization";

export const revalidate = 3600;

export async function GET() {
  try {
    const repositories = await fetchOrganizationRepositories(ORGANIZATION_GITHUB_LOGIN);
    return NextResponse.json({ organization: ORGANIZATION_GITHUB_LOGIN, repositories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao consultar repositórios públicos.";
    return NextResponse.json({ organization: ORGANIZATION_GITHUB_LOGIN, repositories: [], error: message }, { status: 503 });
  }
}
