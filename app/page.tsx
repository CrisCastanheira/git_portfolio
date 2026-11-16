import Link from "next/link";
import { ArrowDownRight, ArrowRight, GitBranch, Layers3 } from "lucide-react";
import { ActivityPanel } from "@/components/activity/activity-panel";
import { ContentCollection } from "@/components/content/content-collection";
import { loadCertificates, loadProjects } from "@/lib/content/loaders";

export default async function HomePage() {
  const [projects, certificates] = await Promise.all([loadProjects(), loadCertificates()]);
  const featuredProjects = projects.filter((project) => project.featured && project.owner === "personal").slice(0, 3);
  const featuredCertificates = certificates.slice(0, 3);
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
          <span className="art-label label-top">CONTRIBUIÇÕES PÚBLICAS</span>
          <span className="art-label label-bottom">CONTAS PESSOAIS · GITHUB</span>
          <span className="art-coordinate">PORTFÓLIO<br />EM EVOLUÇÃO</span>
          <ArrowDownRight className="art-arrow" size={28} />
        </div>
      </section>

      <section className="home-activity page-container" id="atividade" aria-labelledby="home-activity-title">
        <div className="home-section-heading">
          <div><p className="eyebrow">Atividade / GitHub</p><h2 id="home-activity-title">Uma visão integrada.</h2></div>
          <p>Contribuições públicas agregadas das contas pessoais, com a cobertura da coleta sempre visível.</p>
        </div>
        <ActivityPanel />
      </section>

      <section className="home-content page-container" aria-label="Destaques do portfólio">
        <div className="home-section-heading">
          <div><p className="eyebrow">Seleção / Portfólio</p><h2>Trabalho em destaque.</h2></div>
          <Link className="button button-quiet" href="/projetos">Ver todos os projetos <ArrowRight aria-hidden="true" size={15} /></Link>
        </div>
        {featuredProjects.length ? (
          <ContentCollection items={featuredProjects.map((project) => ({ title: project.title, summary: project.summary, href: `/projetos/${project.slug}`, group: "Projeto pessoal", date: project.createdAt, tags: project.tags }))} emptyMessage="" />
        ) : <p className="empty-state">Nenhum projeto foi marcado como destaque. Projetos reais aparecem aqui quando forem cadastrados.</p>}
      </section>

      <section className="home-content page-container" aria-label="Certificados recentes">
        <div className="home-section-heading">
          <div><p className="eyebrow">Formação / Certificados</p><h2>Aprendizado documentado.</h2></div>
          <Link className="button button-quiet" href="/certificados">Ver certificados <ArrowRight aria-hidden="true" size={15} /></Link>
        </div>
        {featuredCertificates.length ? (
          <ContentCollection items={featuredCertificates.map((certificate) => ({ title: certificate.title, summary: certificate.summary, href: certificate.credentialUrl, external: Boolean(certificate.credentialUrl), group: certificate.issuer, date: certificate.issuedAt, tags: certificate.tags }))} emptyMessage="" />
        ) : <p className="empty-state">Nenhum certificado foi informado até agora.</p>}
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
        <Link className="section-card" href="/projetos">
          <span className="card-number">03 / Organização</span>
          <h2>Projetos em colaboração.</h2>
          <p>Os repositórios da organização são consultados pela API pública e mantidos separados da atividade pessoal.</p>
          <span className="card-link">Ver repositórios <ArrowRight aria-hidden="true" size={15} /></span>
        </Link>
      </section>
      <div className="home-note page-container">Os conteúdos profissionais serão adicionados a partir de informações fornecidas pelo titular.</div>
    </div>
  );
}
