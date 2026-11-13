"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, GitBranch, Star } from "lucide-react";
import type { OrganizationRepository } from "@/lib/github/organization";

type OrganizationResponse = { organization: string; repositories: OrganizationRepository[]; error?: string };

export function OrganizationRepositories() {
  const [repositories, setRepositories] = useState<OrganizationRepository[]>([]);
  const [status, setStatus] = useState<"loading" | "loaded" | "empty" | "error">("loading");

  useEffect(() => {
    let mounted = true;
    fetch("/api/organization")
      .then(async (response) => {
        const payload = await response.json() as OrganizationResponse;
        if (!response.ok) throw new Error(payload.error ?? "Não foi possível consultar a organização.");
        if (mounted) {
          setRepositories(payload.repositories);
          setStatus(payload.repositories.length ? "loaded" : "empty");
        }
      })
      .catch(() => { if (mounted) setStatus("error"); });
    return () => { mounted = false; };
  }, []);

  if (status === "loading") return <p className="empty-state">Consultando repositórios públicos da organização…</p>;
  if (status === "error") return <p className="empty-state">Não foi possível carregar os repositórios agora. A integração usa a API pública da organização.</p>;
  if (status === "empty") return <p className="empty-state">A organização não possui repositórios públicos disponíveis para exibição.</p>;

  return (
    <div className="org-grid">
      {repositories.map((repository) => (
        <a className="org-card" href={repository.url} key={repository.id} rel="noreferrer" target="_blank">
          <span className="content-card-meta"><GitBranch aria-hidden="true" size={13} /> {repository.fullName}</span>
          <h3>{repository.name}</h3>
          <p>{repository.description ?? "Sem descrição pública cadastrada."}</p>
          <span className="org-card-stats">
            {repository.language && <span>{repository.language}</span>}
            <span><Star aria-hidden="true" size={13} /> {repository.stars}</span>
            <ArrowUpRight aria-hidden="true" size={14} />
          </span>
        </a>
      ))}
    </div>
  );
}
