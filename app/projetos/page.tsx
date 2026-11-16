import type { Metadata } from "next";
import { ContentCollection } from "@/components/content/content-collection";
import { OrganizationRepositories } from "@/components/content/organization-repositories";
import { loadProjects } from "@/lib/content/loaders";

export const metadata: Metadata = { title: "Projetos" };

export default async function ProjectsPage() {
  const projects = (await loadProjects()).filter((project) => project.owner === "personal");
  return (
    <div className="section-page page-container">
      <p className="eyebrow">Portfólio / Projetos</p>
      <h1 className="section-title">Projetos e repositórios.</h1>
      <p className="section-lead">Projetos cadastrados pelo titular e repositórios públicos da organização aparecem em áreas distintas.</p>
      <section className="content-section" aria-labelledby="personal-projects-title">
        <div className="subsection-heading"><span className="card-number">01 / Conteúdo do portfólio</span><h2 id="personal-projects-title">Projetos pessoais</h2></div>
        <ContentCollection
          emptyMessage="Nenhum projeto pessoal foi cadastrado ainda. O conteúdo será exibido quando houver informações verificadas."
          items={projects.map((project) => ({
            title: project.title,
            summary: project.summary,
            href: `/projetos/${project.slug}`,
            group: "Pessoal",
            date: project.createdAt,
            tags: project.tags,
          }))}
        />
      </section>
      <section className="content-section" aria-labelledby="organization-projects-title">
        <div className="subsection-heading"><span className="card-number">02 / Dazum-Digital</span><h2 id="organization-projects-title">Repositórios públicos da organização</h2></div>
        <OrganizationRepositories />
      </section>
    </div>
  );
}
