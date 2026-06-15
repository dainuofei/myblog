export function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Strip markdown syntax to get plain text for word counting.
 * Handles: headings, bold/italic, links, images, code blocks, inline code,
 * blockquotes, lists, horizontal rules, HTML tags, and frontmatter.
 */
function stripMarkdown(md: string): string {
  return (
    md
      // Remove YAML frontmatter
      .replace(/^---[\s\S]*?---\n?/m, "")
      // Remove code blocks (fenced)
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`{1,2}[^`]+`{1,2}/g, "")
      // Remove images
      .replace(/!\[.*?\]\(.*?\)/g, "")
      // Remove links, keep text
      .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
      // Remove headings markers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic markers
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
      .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
      // Remove blockquote markers
      .replace(/^>\s?/gm, "")
      // Remove list markers
      .replace(/^[\s]*[-*+]\s/gm, "")
      .replace(/^[\s]*\d+\.\s/gm, "")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, "")
      // Remove HTML tags
      .replace(/<[^>]+>/g, "")
      // Remove dollar signs from math (but keep content)
      .replace(/\$\$?/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

export function readingTime(text: string): number {
  const chineseCharsPerMinute = 400;
  const wordsPerMinute = 200;

  const plain = stripMarkdown(text);

  // Count Chinese characters
  const chineseChars = (plain.match(/[一-鿿]/g) || []).length;
  // Count English words (non-Chinese character sequences)
  const englishText = plain.replace(/[一-鿿]/g, " ");
  const englishWords = englishText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const chineseTime = chineseChars / chineseCharsPerMinute;
  const englishTime = englishWords / wordsPerMinute;

  return Math.max(1, Math.ceil(chineseTime + englishTime));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}
