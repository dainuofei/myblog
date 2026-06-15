# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (localhost:4321)
pnpm build        # Production build to dist/
pnpm preview      # Preview production build locally
pnpm deploy       # Build + rsync to remote server (scripts/deploy.sh)
```

No test framework is configured — none of the above run tests.

## Architecture

This is a **personal blog** built with **[Astro](https://astro.build)** (v5) — a static site generator that ships zero JS by default. Posts are written in MDX (Markdown + JSX components) and stored as content collections under `src/content/posts/`. At build time Astro renders them into static HTML pages.

**Content model** (`src/content.config.ts`): Each post is a content collection entry with frontmatter: `title`, `date`, `updated` (optional), `tags[]`, `description` (optional), `draft` (bool, default false — draft posts are excluded at query time), `math` (bool, default false — enables KaTeX per-post).

**Routing**: File-based routing under `src/pages/`:
- `/` — latest `POSTS_PER_PAGE` (10) posts (`index.astro`)
- `/page/[page]` — paginated listing (`page/[page].astro`)
- `/posts/[slug]` — individual post (`posts/[...slug].astro`)
- `/tags` — all tags with counts (`tags/index.astro`)
- `/tags/[tag]` — posts filtered by tag (`tags/[tag].astro`)
- `/about` — static about page (`about.astro`)
- `/rss.xml` — RSS feed (`rss.xml.js`)

**Layout system**: Two layouts in `src/layouts/`:
- `BaseLayout.astro` — HTML shell (lang="zh-CN"): meta tags, Open Graph, theme anti-flicker inline script, Header, Footer, slot for page content. Imported by all pages.
- `PostLayout.astro` — wraps a single post with `BaseLayout`, renders the MDX body via `post.render()`, computes reading time, displays frontmatter metadata (date, updated, tags).

**Components** (`src/components/`): `Header` (sticky nav with links + ThemeToggle), `Footer`, `PostCard` (post excerpt for listing pages), `Pagination` (prev/next with base URL pattern), `ThemeToggle` (dark/light via `localStorage` + Tailwind `class` strategy).

**Dark mode**: Tailwind `darkMode: "class"`. `BaseLayout` runs an inline `<script is:inline>` before paint to add the `dark` class based on localStorage or system preference (no flash). `ThemeToggle` toggles the class and persists to localStorage.

**Markdown pipeline** (`astro.config.mjs`):
1. `remark-math` — parses `$...$` / `$$...$$` math in Markdown
2. `rehype-pretty-code` — Shiki code highlighting with `github-dark` theme
3. `rehype-katex` — renders math to HTML+CSS at build time (zero JS)

**Styling**: Tailwind CSS with `@tailwindcss/typography` plugin configured for 75ch max-width prose. KaTeX color overrides for dark mode in `src/styles/global.css`.

**Deployment**: `scripts/deploy.sh` builds locally then rsyncs `dist/` to a remote server behind Caddy (`Caddyfile`). Edit `SERVER` and `REMOTE_PATH` in the script to match your server.

**Path aliases**: `@/*` maps to `src/*` (tsconfig paths + Astro/Vite handles resolution).

**Key utilities** (`src/lib/`):
- `formatDate(date)` — locale-formatted dates (zh-CN)
- `readingTime(text)` — estimates reading time, handling both Chinese characters (400/min) and English words (200/min)
- `slugify(text)` — URL-safe slug from text
- `constants.ts` — site-wide config: title, description, URL, author name, posts per page
