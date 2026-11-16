import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const configured = process.env.SITE_URL?.trim();
  let sitemap: string | undefined;
  try {
    const url = configured ? new URL(configured) : null;
    if (url?.protocol === "https:") sitemap = `${url.origin}/sitemap.xml`;
  } catch {
    sitemap = undefined;
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(sitemap ? { sitemap } : {}),
  };
}
