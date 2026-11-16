import "server-only";
import { access, readFile, stat } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { z } from "zod";
import {
  AcademicWorkSchema,
  CertificateSchema,
  ProfileSchema,
  ProjectSchema,
  SkillSchema,
  type AcademicWork,
  type Certificate,
  type Profile,
  type Project,
  type Skill,
} from "@/lib/content/schemas";

function parseCollection<T>(value: unknown, schema: z.ZodType<T>): T[] {
  return z.array(schema).parse(value);
}

async function readJson<T>(filename: string, schema: z.ZodType<T>): Promise<T> {
  const path = join(process.cwd(), "content", filename);
  const content = await readFile(path, "utf8");
  return schema.parse(JSON.parse(content));
}

async function ensureMediaFiles(paths: Array<string | undefined>): Promise<void> {
  const publicRoot = resolve(process.cwd(), "public");
  for (const path of paths.filter((value): value is string => Boolean(value))) {
    const absolutePath = resolve(publicRoot, path.slice(1));
    if (!absolutePath.startsWith(`${publicRoot}${sep}`)) throw new Error(`Caminho de mídia fora de public/: ${path}`);
    try {
      await access(absolutePath);
      if (!(await stat(absolutePath)).isFile()) throw new Error(`O caminho de mídia não é um arquivo: ${path}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("não é um arquivo")) throw error;
      throw new Error(`Arquivo de mídia não encontrado em public${path}.`);
    }
  }
}

export function parseProjectCollection(value: unknown): Project[] {
  const parsed = parseCollection(value, ProjectSchema);
  const slugs = new Set<string>();
  for (const item of parsed) {
    if (slugs.has(item.slug)) throw new Error(`Projetos: slug duplicado "${item.slug}".`);
    slugs.add(item.slug);
  }
  return parsed;
}

export function parseCertificateCollection(value: unknown): Certificate[] {
  return parseCollection(value, CertificateSchema);
}

export function parseAcademicWorkCollection(value: unknown): AcademicWork[] {
  const parsed = parseCollection(value, AcademicWorkSchema);
  const slugs = new Set<string>();
  for (const item of parsed) {
    if (slugs.has(item.slug)) throw new Error(`Trabalhos: slug duplicado "${item.slug}".`);
    slugs.add(item.slug);
  }
  return parsed;
}

export async function loadProjects(): Promise<Project[]> {
  const projects = parseProjectCollection(await readJson("projects.json", z.array(ProjectSchema)));
  await ensureMediaFiles(projects.flatMap((project) => project.gallery.map((image) => image.src)));
  return projects;
}

export async function loadCertificates(): Promise<Certificate[]> {
  const certificates = parseCertificateCollection(await readJson("certificates.json", z.array(CertificateSchema)));
  await ensureMediaFiles(certificates.map((certificate) => certificate.image));
  return certificates;
}

export async function loadAcademicWorks(): Promise<AcademicWork[]> {
  const works = parseAcademicWorkCollection(await readJson("works.json", z.array(AcademicWorkSchema)));
  await ensureMediaFiles(works.flatMap((work) => work.gallery.map((image) => image.src)));
  return works;
}

export async function loadProfile(): Promise<Profile> {
  const profile = await readJson("profile.json", ProfileSchema);
  await ensureMediaFiles([profile.avatar]);
  return profile;
}

export async function loadSkills(): Promise<Skill[]> {
  return readJson("skills.json", z.array(SkillSchema));
}

export async function findProject(slug: string): Promise<Project | undefined> {
  return (await loadProjects()).find((project) => project.slug === slug);
}

export async function findAcademicWork(slug: string): Promise<AcademicWork | undefined> {
  return (await loadAcademicWorks()).find((work) => work.slug === slug);
}
