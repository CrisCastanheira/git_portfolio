import type { Metadata } from "next";
import { ContentCollection } from "@/components/content/content-collection";
import { loadCertificates } from "@/lib/content/loaders";

export const metadata: Metadata = { title: "Certificados" };

export default async function CertificatesPage() {
  const certificates = await loadCertificates();
  return (
    <div className="section-page page-container">
      <p className="eyebrow">Portfólio / Formação</p>
      <h1 className="section-title">Certificados.</h1>
      <p className="section-lead">Registros de formação poderão ser adicionados com emissor, data e referência verificável.</p>
      <ContentCollection
        emptyMessage="Nenhum certificado foi cadastrado ainda."
        items={certificates.map((certificate) => ({
          title: certificate.title,
          summary: certificate.summary,
          href: certificate.credentialUrl,
          external: Boolean(certificate.credentialUrl),
          group: certificate.issuer,
          date: certificate.issuedAt,
          tags: certificate.tags,
        }))}
      />
    </div>
  );
}
