# RottenSea.github.io

Personal website, The Key of Urala, served at [rottensea.github.io](https://rottensea.github.io).

It is built with [Astro](https://astro.build/) 7 on the personal-website system from [RottenSea/design-system](https://github.com/RottenSea/design-system). The VitePress version that came before it is in this repository's history up to commit `52c6356`.

## Writing

Each post is a folder in `src/content/blog/` with an `index.mdx` and the post's images beside it, referenced as `./cover.png`. The folder name is the post's URL: `src/content/blog/vibe-coding/` becomes `/blog/vibe-coding`, unless the post sets `permalink`. New posts get a short English name; the first five posts keep their date names, such as `20260518`, so their URLs stay the same.

`pnpm new-post <name>` creates the folder with every frontmatter field in it, and fills in `published` and `publishedAt` with the current time in UTC+8. `publishedAt` orders posts published on the same day. The fields and their rules are in `src/content.config.ts`, and a post with an unknown or mistyped field fails the build.

A post with `draft: true` shows up in `pnpm dev` but not in the built site. Only `index.md` or `index.mdx` one folder down becomes a post, so a file such as `src/content/blog/_topics.md` stays a private note.

Posts are MDX, so `<`, `{` and `}` in ordinary text have to be escaped (`\<`, `\{`, `\}`), and HTML comments are written `{/* ... */}`. Code blocks and inline code are not affected.

## Layout

| Path | What it holds |
| --- | --- |
| `src/content/blog/` | Posts |
| `src/content.config.ts` | The post collection and its frontmatter schema |
| `src/pages/` | Routes: the home page, about, design, 404 and `blog/[slug]` |
| `src/layouts/` | `BaseLayout` is the page frame; `PageLayout` wraps MDX pages such as about |
| `src/assets/` | Images and icons that components import, such as the theme toggle's icons in `icons/` |
| `src/components/` | The site's own components, each with its own scoped styles |
| `src/styles/` | Global styles: Markdown content in `prose.css`, helpers in `utilities.css` |
| `src/plugins/` | rehype plugins for the Markdown processor |
| `src/integrations/` | Serves and copies the design system's specimen pages for `/design` |
| `src/utils/` | Dates, the post list, and site constants |
| `scripts/new-post.ts` | The `pnpm new-post` script |

Markdown runs through the unified processor (`@astrojs/markdown-remark`) rather than Astro 7's default, Sätteri, because the site's plugins are remark and rehype plugins.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Installs Astro and the design system |
| `pnpm dev` | Starts a local server on port 4173 that reloads on changes |
| `pnpm build` | Builds the site into `dist/` |
| `pnpm preview` | Serves the built site on port 4173 |
| `pnpm check` | Type checks the Astro files, then runs Biome's format and lint checks |
| `pnpm format` | Formats and fixes what Biome can fix |
| `pnpm new-post` | Creates a draft post |

Biome formats the TypeScript files and the script parts of `.astro` files; it leaves the HTML in `.astro` files, Markdown, MDX and the SVG files in `src/assets/` alone.

Pushing to `main` checks, builds and deploys the site to GitHub Pages through `.github/workflows/deploy.yml`.
