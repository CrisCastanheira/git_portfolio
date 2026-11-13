import type { Metadata } from "next";
import { ContentCollection } from "@/components/content/content-collection";
import { loadAcademicWorks } from "@/lib/content/loaders";

export const metadata: Metadata = { title: "Trabalhos" };

export default async function AcademicWorksPage() {
  const works = await loadAcademicWorks();
  return (
    <div className="section-page page-container">
      <p className="eyebrow">Portfólio / Produção acadêmica</p>
      <h1 className="section-title">Trabalhos.</h1>
      <p className="section-lead">Pesquisas e trabalhos poderão ser apresentados com autoria, instituição e materiais complementares.</p>
      <ContentCollection
        emptyMessage="Nenhum trabalho foi cadastrado ainda."
        items={works.map((work) => ({
          title: work.title,
          summary: work.summary,
          href: `/trabalhos/${work.slug}`,
          group: work.institution ?? "Trabalho acadêmico",
          date: work.year?.toString(),
          tags: work.tags,
        }))}
      />
    </div>
  );
}
