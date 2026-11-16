"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // O Next não envia erros a serviços externos sem configuração explícita.
    console.error("Erro de renderização do portfólio", error.digest ?? error.name);
  }, [error]);

  return (
    <section className="section-page page-container" aria-labelledby="error-title">
      <p className="eyebrow">Falha / Erro inesperado</p>
      <h1 className="section-title" id="error-title">Não foi possível carregar esta página.</h1>
      <p className="section-lead">Tente novamente. Se a falha continuar, os dados conectados podem estar temporariamente indisponíveis.</p>
      <button className="button button-primary" onClick={reset}>Tentar novamente</button>
    </section>
  );
}
