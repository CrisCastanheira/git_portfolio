import { z } from "zod";

const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug deve usar letras minúsculas, números e hífens.");
const ExternalUrlSchema = z.string().url().refine((value) => new URL(value).protocol === "https:", "Use um link HTTPS.");
const MediaPathSchema = z.string().refine((value) =>
  value.startsWith("/media/") && !value.startsWith("//") && !value.split("/").includes(".."),
"A mídia deve estar em um caminho local dentro de /media/.");

export const GalleryItemSchema = z.object({
  src: MediaPathSchema,
  alt: z.string().min(1),
  caption: z.string().optional(),
});

export const ProjectSchema = z.object({
  title: z.string().min(1),
  slug: SlugSchema,
  summary: z.string().min(1),
  description: z.string().optional(),
  owner: z.enum(["personal", "organization"]),
  tags: z.array(z.string().min(1)).default([]),
  repositoryUrl: ExternalUrlSchema.optional(),
  demoUrl: ExternalUrlSchema.optional(),
  featured: z.boolean().default(false),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gallery: z.array(GalleryItemSchema).default([]),
}).strict();

export const CertificateSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  issuedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  summary: z.string().optional(),
  credentialUrl: ExternalUrlSchema.optional(),
  image: MediaPathSchema.optional(),
  tags: z.array(z.string().min(1)).default([]),
}).strict();

export const AcademicWorkSchema = z.object({
  title: z.string().min(1),
  slug: SlugSchema,
  summary: z.string().min(1),
  description: z.string().optional(),
  institution: z.string().optional(),
  authors: z.array(z.string().min(1)).default([]),
  year: z.number().int().min(1900).max(2200).optional(),
  url: ExternalUrlSchema.optional(),
  gallery: z.array(GalleryItemSchema).default([]),
  tags: z.array(z.string().min(1)).default([]),
}).strict();

export const ProfileSchema = z.object({
  displayName: z.string().min(1).optional(),
  headline: z.string().min(1).optional(),
  introduction: z.string().min(1).optional(),
  biography: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatar: MediaPathSchema.optional(),
  socialLinks: z.array(z.object({ label: z.string().min(1), url: ExternalUrlSchema }).strict()).default([]),
}).strict();

export const SkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
}).strict();

export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
export type AcademicWork = z.infer<typeof AcademicWorkSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Skill = z.infer<typeof SkillSchema>;
