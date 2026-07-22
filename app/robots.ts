import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    host: "https://www.gomirissa.com",
    sitemap: "https://www.gomirissa.com/sitemap.xml",
  };
}
