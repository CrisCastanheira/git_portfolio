import Link from "next/link";
import { ArrowDownRight, ArrowRight, GitBranch, Layers3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero page-container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Portfólio GitHub Unificado</p>
          <h1 id="hero-title">Código, projetos e<br /><span>trajetória em um só lugar.</span></h1>
          <p className="hero-description">
            Um espaço para acompanhar projetos, trabalhos e contribuições públicas
            das contas GitHub de Cristiano Castanheira.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/projetos">Explorar projetos <ArrowRight aria-hidden="true" size={16} /></Link>
            <Link className="button button-quiet" href="/sobre">Conhecer o portfólio</Link>
          </div>
          <div className="hero-accounts" aria-label="Contas GitHub incluídas">
            <span className="account-icon"><GitBranch aria-hidden="true" size={16} /></span>
            <span>CrisCastanheira</span><span className="account-divider" aria-hidden="true">/</span><span>CristianoDazum</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-grid" />
          <div className="art-center"><GitBranch size={50} strokeWidth={1.3} /></div>
          <span className="art-label label-top">PUBLIC CONTRIBUTIONS</span>
          <span className="art-label label-bottom">OPEN SOURCE · 2026</span>
          <span className="art-coordinate">23° 33&apos; S<br />46° 38&apos; W</span>
          <ArrowDownRight className="art-arrow" size={28} />
        </div>
      </section>

      <section className="intro-strip page-container" aria-label="Sobre o projeto">
        <p><span className="strip-index">01</span> UM PORTFÓLIO EM EVOLUÇÃO</p>
        <p>Dados públicos, conteúdo real e espaço para o que vem a seguir.</p>
        <Layers3 aria-hidden="true" size={19} />
      </section>

      <section className="home-sections page-container" aria-label="Seções do portfólio">
        <Link className="section-card" href="/projetos">
          <span className="card-number">01 / Projetos</span>
          <h2>Ideias que viraram código.</h2>
          <p>Projetos pessoais e repositórios públicos da organização em áreas separadas.</p>
          <span className="card-link">Ver projetos <ArrowRight aria-hidden="true" size={15} /></span>
        </Link>
        <Link className="section-card" href="/trabalhos">
          <span className="card-number">02 / Trabalhos</span>
          <h2>Pesquisa e produção acadêmica.</h2>
          <p>Um espaço para trabalhos com contexto, autoria e materiais complementares.</p>
          <span className="card-link">Ver trabalhos <ArrowRight aria-hidden="true" size={15} /></span>
        </Link>
        <Link className="section-card" href="/">
          <span className="card-number">03 / Atividade</span>
          <h2>Uma visão integrada.</h2>
          <p>O calendário público das contas conectadas será apresentado com clareza sobre sua cobertura.</p>
          <span className="card-link">Ver atividade <ArrowRight aria-hidden="true" size={15} /></span>
        </Link>
      </section>
      <div className="home-note page-container">Os conteúdos profissionais serão adicionados a partir de informações fornecidas pelo titular.</div>
    </div>
  );
}
