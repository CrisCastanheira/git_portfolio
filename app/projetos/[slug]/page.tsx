import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ImageGallery } from "@/components/content/image-gallery";
import { findProject } from "@/lib/content/loaders";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await findProject(slug);
  return project ? { title: project.title, description: project.summary } : { title: "Projeto não encontrado" };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await findProject(slug);
  if (!project) notFound();
  return (
    <article className="section-page detail-page page-container">
      <Link className="back-link" href="/projetos"><ArrowLeft aria-hidden="true" size={16} /> Voltar para projetos</Link>
      <p className="eyebrow">Projeto / {project.owner === "organization" ? "Organização" : "Pessoal"}</p>
      <h1 className="section-title">{project.title}</h1>
      <p className="section-lead">{project.summary}</p>
      {project.description && <div className="prose-content"><p>{project.description}</p></div>}
      {!!project.tags.length && <p className="detail-tags">{project.tags.join(" · ")}</p>}
      <div className="detail-actions">
        {project.repositoryUrl && <a className="button button-primary" href={project.repositoryUrl} rel="noreferrer" target="_blank">Repositório <ArrowUpRight size={15} /></a>}
        {project.demoUrl && <a className="button button-quiet" href={project.demoUrl} rel="noreferrer" target="_blank">Demonstração <ArrowUpRight size={15} /></a>}
      </div>
      <section className="content-section" aria-labelledby="gallery-title">
        <div className="subsection-heading"><span className="card-number">Galeria</span><h2 id="gallery-title">Imagens do projeto</h2></div>
        <ImageGallery items={project.gallery} />
      </section>
    </article>
  );
}
