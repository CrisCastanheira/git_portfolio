import "server-only";
import type { AccountActivity, ContributionDay } from "@/lib/activity/types";
import { assertCalendarDate, toUtcEndOfDay, toUtcStartOfDay } from "@/lib/activity/dates";

type Fetcher = typeof fetch;
type AccountFetchInput = {
  login: string;
  from: string;
  to: string;
  token: string;
  fetcher?: Fetcher;
};

const QUERY = `query PublicContributions($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

export async function fetchAccountContributions(input: AccountFetchInput): Promise<AccountActivity> {
  const { login, from, to, token, fetcher = fetch } = input;
  assertCalendarDate(from);
  assertCalendarDate(to);
  if (!token.trim()) return { login, status: "unavailable", days: [], message: "GITHUB_TOKEN não configurado." };

  try {
    const response = await fetcher("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login, from: toUtcStartOfDay(from), to: toUtcEndOfDay(to) },
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`GitHub GraphQL respondeu HTTP ${response.status}.`);
    const payload = await response.json() as GraphqlPayload;
    if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join("; "));
    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) throw new Error(`A conta ${login} não retornou um calendário público.`);

    const days: ContributionDay[] = calendar.weeks.flatMap((week) => week.contributionDays.map((day) => ({
      date: assertCalendarDate(day.date),
      count: day.contributionCount,
    })));
    return { login, status: "available", days };
  } catch (error) {
    return {
      login,
      status: "unavailable",
      days: [],
      message: error instanceof Error ? error.message : "Falha desconhecida ao consultar GitHub GraphQL.",
    };
  }
}

type GraphqlPayload = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }>;
        };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
};

export function getGithubToken(): string | undefined {
  return process.env.GITHUB_TOKEN?.trim() || undefined;
}
