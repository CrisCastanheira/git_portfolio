import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
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
  return parseProjectCollection(await readJson("projects.json", z.array(ProjectSchema)));
}

export async function loadCertificates(): Promise<Certificate[]> {
  return parseCertificateCollection(await readJson("certificates.json", z.array(CertificateSchema)));
}

export async function loadAcademicWorks(): Promise<AcademicWork[]> {
  return parseAcademicWorkCollection(await readJson("works.json", z.array(AcademicWorkSchema)));
}

export async function loadProfile(): Promise<Profile> {
  return readJson("profile.json", ProfileSchema);
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
