"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, RefreshCw } from "lucide-react";
import { ContributionSkyline } from "@/components/activity/contribution-skyline-card";
import { selectActivity, type ActivityPeriod } from "@/lib/activity/select";
import type { PortfolioSnapshot } from "@/lib/activity/types";
import { PERSONAL_GITHUB_ACCOUNTS } from "@/lib/github/accounts";

type ActivityApiResponse = { quality: string; snapshot: PortfolioSnapshot | null; message?: string };
type LoadState = { status: "loading" } | { status: "unavailable"; message: string } | { status: "available"; snapshot: PortfolioSnapshot };

const qualityLabels = {
  complete: "Cobertura completa",
  partial: "Cobertura parcial",
  stale: "Último snapshot disponível",
  unavailable: "Dados indisponíveis",
} as const;

export function ActivityPanel() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [account, setAccount] = useState<string | "all">("all");
  const [periodDays, setPeriodDays] = useState<ActivityPeriod>(365);

  useEffect(() => {
    let mounted = true;
    fetch("/api/activity", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as ActivityApiResponse;
        if (!response.ok || !payload.snapshot) {
          throw new Error(payload.message ?? "Ainda não há dados de atividade sincronizados.");
        }
        if (mounted) setState({ status: "available", snapshot: payload.snapshot });
      })
      .catch((error: unknown) => {
        if (mounted) setState({
          status: "unavailable",
          message: error instanceof Error ? error.message : "Não foi possível carregar o snapshot.",
        });
      });
    return () => { mounted = false; };
  }, []);

  const selected = useMemo(() => state.status === "available"
    ? selectActivity(state.snapshot, { account, periodDays })
    : null, [account, periodDays, state]);

  return (
    <section className="activity-panel" aria-labelledby="activity-panel-title">
      <div className="activity-panel-header">
        <div>
          <p className="eyebrow"><Activity aria-hidden="true" size={14} /> Atividade GitHub</p>
          <h3 id="activity-panel-title">Contribuições públicas, reunidas.</h3>
        </div>
        {state.status === "available" && selected && (
          <span className={`quality-badge quality-${selected.quality}`} role="status">
            <span aria-hidden="true" className="quality-indicator" />{qualityLabels[selected.quality]}
          </span>
        )}
      </div>

      {state.status === "loading" && <p className="empty-state" role="status">Carregando o último snapshot…</p>}
      {state.status === "unavailable" && (
        <div className="activity-unavailable" role="status">
          <RefreshCw aria-hidden="true" size={18} />
          <div><strong>Atividade ainda não sincronizada.</strong><p>{state.message}</p></div>
        </div>
      )}
      {state.status === "available" && selected?.quality === "unavailable" && (
        <div className="activity-unavailable" role="status">
          <RefreshCw aria-hidden="true" size={18} />
          <div><strong>Esta conta não possui dados disponíveis.</strong><p>A conta não foi consultada com sucesso na última sincronização.</p></div>
        </div>
      )}
      {state.status === "available" && selected && selected.quality !== "unavailable" && (
        <>
          <div className="activity-controls" aria-label="Filtros da atividade GitHub">
            <label><span>Conta</span><select value={account} onChange={(event) => setAccount(event.target.value)}>
              <option value="all">Todas as contas pessoais</option>
              {PERSONAL_GITHUB_ACCOUNTS.map(({ login }) => <option key={login} value={login}>{login}</option>)}
            </select></label>
            <label><span>Período</span><select value={periodDays} onChange={(event) => setPeriodDays(Number(event.target.value) as ActivityPeriod)}>
              <option value={30}>Últimos 30 dias</option>
              <option value={90}>Últimos 90 dias</option>
              <option value={365}>Últimos 12 meses</option>
            </select></label>
          </div>
          <div className="activity-method-note">
            <span>Contribuições públicas agregadas</span>
            <span>Período: {new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${selected.from}T00:00:00.000Z`))} a {new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${selected.to}T00:00:00.000Z`))}</span>
            <span>Snapshot: {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "UTC" }).format(new Date(state.snapshot.generatedAt))} UTC</span>
          </div>
          <ContributionSkyline
            data={selected.days}
            endDate={selected.to}
            locale="pt-BR"
            title={`${new Intl.NumberFormat("pt-BR").format(selected.metrics?.total ?? 0)} contribuições no período`}
            unit="contribuição"
            unitPlural="contribuições"
            weekStart={1}
          />
          {selected.quality === "partial" && (
            <p className="activity-footnote">Uma das contas não respondeu. O gráfico soma apenas as contas consultadas com sucesso; as ausências não são tratadas como zero.</p>
          )}
          {selected.quality === "stale" && (
            <p className="activity-footnote">A sincronização mais recente falhou. Estes dados correspondem ao último snapshot válido.</p>
          )}
        </>
      )}
    </section>
  );
}
