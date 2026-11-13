import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { loadProfile } from "@/lib/content/loaders";

export const metadata: Metadata = { title: "Contato" };

export default async function ContactPage() {
  const profile = await loadProfile();
  return (
    <div className="section-page page-container">
      <p className="eyebrow">Portfólio / Contato</p>
      <h1 className="section-title">Vamos conversar.</h1>
      <p className="section-lead">Os canais de contato serão exibidos quando forem informados pelo titular.</p>
      {profile.email ? (
        <a className="contact-link" href={`mailto:${profile.email}`}><Mail aria-hidden="true" size={18} /> {profile.email} <ArrowUpRight aria-hidden="true" size={15} /></a>
      ) : <p className="empty-state">Nenhum e-mail de contato foi cadastrado.</p>}
      {!!profile.socialLinks.length && <ul className="social-links">{profile.socialLinks.map((link) => <li key={link.label}><a href={link.url} rel="noreferrer" target="_blank">{link.label} <ArrowUpRight size={14} /></a></li>)}</ul>}
    </div>
  );
}
