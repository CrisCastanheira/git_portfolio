import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ImageGallery } from "@/components/content/image-gallery";
import { findAcademicWork } from "@/lib/content/loaders";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await findAcademicWork(slug);
  return work ? { title: work.title, description: work.summary } : { title: "Trabalho não encontrado" };
}

export default async function AcademicWorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const work = await findAcademicWork(slug);
  if (!work) notFound();
  return (
    <article className="section-page detail-page page-container">
      <Link className="back-link" href="/trabalhos"><ArrowLeft aria-hidden="true" size={16} /> Voltar para trabalhos</Link>
      <p className="eyebrow">Trabalho acadêmico{work.year ? ` / ${work.year}` : ""}</p>
      <h1 className="section-title">{work.title}</h1>
      <p className="section-lead">{work.summary}</p>
      {work.institution && <p className="detail-meta">{work.institution}</p>}
      {!!work.authors.length && <p className="detail-meta">Autoria: {work.authors.join(", ")}</p>}
      {work.description && <div className="prose-content"><p>{work.description}</p></div>}
      {work.url && <a className="button button-primary" href={work.url} rel="noreferrer" target="_blank">Abrir referência <ArrowUpRight size={15} /></a>}
      <section className="content-section" aria-labelledby="gallery-title">
        <div className="subsection-heading"><span className="card-number">Galeria</span><h2 id="gallery-title">Materiais do trabalho</h2></div>
        <ImageGallery items={work.gallery} />
      </section>
    </article>
  );
}
