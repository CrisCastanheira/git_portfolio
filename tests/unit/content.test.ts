import { describe, expect, it } from "vitest";
import {
  loadCertificates,
  loadProjects,
  loadAcademicWorks,
  parseCertificateCollection,
  parseProjectCollection,
  parseAcademicWorkCollection,
} from "@/lib/content/loaders";

describe("file-backed content", () => {
  it("accepts empty professional collections and current empty content files", async () => {
    expect(parseProjectCollection([])).toEqual([]);
    expect(parseCertificateCollection([])).toEqual([]);
    expect(parseAcademicWorkCollection([])).toEqual([]);
    await expect(loadProjects()).resolves.toEqual([]);
    await expect(loadCertificates()).resolves.toEqual([]);
    await expect(loadAcademicWorks()).resolves.toEqual([]);
  });

  it("rejects duplicate project slugs", () => {
    const duplicate = [
      { title: "Projeto A", slug: "projeto-a", summary: "Resumo", owner: "personal" },
      { title: "Projeto B", slug: "projeto-a", summary: "Resumo", owner: "organization" },
    ];
    expect(() => parseProjectCollection(duplicate)).toThrow(/slug duplicado/i);
  });

  it("rejects unsafe external links and gallery paths", () => {
    expect(() => parseProjectCollection([{
      title: "Projeto", slug: "projeto", summary: "Resumo", owner: "personal", repositoryUrl: "javascript:alert(1)",
    }])).toThrow();
    expect(() => parseAcademicWorkCollection([{
      title: "Trabalho", slug: "trabalho", summary: "Resumo", gallery: [{ src: "//external.test/x.png", alt: "Capa" }],
    }])).toThrow();
  });

  it("allows optional media and presentation metadata", () => {
    expect(parseProjectCollection([{
      title: "Projeto", slug: "projeto", summary: "Resumo verificável", owner: "personal",
    }])).toHaveLength(1);
  });
});
