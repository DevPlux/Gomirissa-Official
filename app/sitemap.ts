// app/sitemap.ts

import type { MetadataRoute } from "next";

const siteUrl = "https://www.gomirissa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
