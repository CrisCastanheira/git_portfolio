import type { MetadataRoute } from "next";
import { loadAcademicWorks, loadProjects } from "@/lib/content/loaders";

function siteOrigin(): string | null {
  const configured = process.env.SITE_URL?.trim();
  if (!configured) return null;
  try {
    const url = new URL(configured);
    return url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  if (!origin) return [];

  const [projects, works] = await Promise.all([loadProjects(), loadAcademicWorks()]);
  const pages = ["", "/projetos", "/certificados", "/trabalhos", "/sobre", "/contato"];
  return [
    ...pages.map((page) => ({ url: `${origin}${page}` })),
    ...projects.map((project) => ({ url: `${origin}/projetos/${project.slug}` })),
    ...works.map((work) => ({ url: `${origin}/trabalhos/${work.slug}` })),
  ];
}
