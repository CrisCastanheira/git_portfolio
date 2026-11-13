import type { Metadata } from "next";
import { loadProfile, loadSkills } from "@/lib/content/loaders";

export const metadata: Metadata = { title: "Sobre" };

export default async function AboutPage() {
  const [profile, skills] = await Promise.all([loadProfile(), loadSkills()]);
  return (
    <div className="section-page page-container">
      <p className="eyebrow">Portfólio / Perfil</p>
      <h1 className="section-title">{profile.displayName ?? "Sobre"}.</h1>
      {profile.headline && <p className="section-lead">{profile.headline}</p>}
      {profile.introduction && <p className="section-lead">{profile.introduction}</p>}
      {profile.biography
        ? <div className="prose-content"><p>{profile.biography}</p></div>
        : <p className="empty-state">O perfil ainda não possui uma biografia cadastrada.</p>}
      {skills.length > 0 && (
        <section className="content-section" aria-labelledby="skills-title">
          <div className="subsection-heading"><span className="card-number">Competências</span><h2 id="skills-title">Conhecimentos</h2></div>
          <ul className="skill-list">{skills.map((skill) => <li key={`${skill.category ?? "geral"}-${skill.name}`}><strong>{skill.name}</strong>{skill.category && <span>{skill.category}</span>}{skill.description && <p>{skill.description}</p>}</li>)}</ul>
        </section>
      )}
    </div>
  );
}
