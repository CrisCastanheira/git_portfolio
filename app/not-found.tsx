import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-page page-container" aria-labelledby="not-found-title">
      <p className="eyebrow">404 / Página não encontrada</p>
      <h1 className="section-title" id="not-found-title">Este caminho não existe.</h1>
      <p className="section-lead">O endereço pode ter mudado ou ainda não foi cadastrado no portfólio.</p>
      <Link className="button button-primary" href="/">Voltar ao início</Link>
    </section>
  );
}
