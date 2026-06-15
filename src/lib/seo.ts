import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, AUTHOR_NAME } from "./constants";

interface BlogPostingData {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  tags?: string[];
  imageUrl?: string;
}

/**
 * Generate JSON-LD BlogPosting structured data for Google/Baidu rich results.
 */
export function generateBlogPostingJsonLd(data: BlogPostingData) {
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    url: data.url,
    datePublished: data.datePublished,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
  };

  if (data.dateModified && data.dateModified !== data.datePublished) {
    json.dateModified = data.dateModified;
  }
  if (data.tags && data.tags.length > 0) {
    json.keywords = data.tags.join(", ");
  }
  if (data.imageUrl) {
    json.image = data.imageUrl;
  }

  return JSON.stringify(json, null, 2);
}

/**
 * Generate JSON-LD WebSite structured data for the homepage.
 */
export function generateWebSiteJsonLd(query: string) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={${query}}`,
        },
        "query-input": `required name=${query}`,
      },
    },
    null,
    2
  );
}
