# Agent Instructions

## Tech Stack (do NOT add new tech stack without permission)

- **Framework:** Astro ^6.3.3
- **UI Library:** React ^19.2.6 via `@astrojs/react` ^5.0.5, installed and integrated but currently unused in `src/`
- **Integrations:** `@astrojs/partytown`, Astro Fonts API with local font providers, `sharp`
- **Runtime:** Node >=22.12.0
- **Package Manager:** pnpm
- **CSS:** Pure CSS with custom properties only — no Tailwind, no PostCSS, no Sass, no CSS-in-JS
- **Build:** Astro built-in (Vite)
- **Deploy:** GitHub Actions -> GitHub Pages

## Project Structure

```text
docs/                     Local Astro docs + project guidance
public/                   Public static assets
src/
├── assets/
│   ├── fonts/            Local font files loaded via Astro Fonts API
│   ├── icons/            SVG icons (cleaned, fill="currentColor")
│   └── images/           Static images referenced from content/pages
├── components/           Astro components (.astro), PascalCase filenames
│   ├── BlogCard.astro
│   ├── Footer.astro
│   └── Header.astro
├── content/              Content collections (astro:content)
│   └── blog/
│       ├── example/      Blog templates and examples
│       └── *.md, *.mdx   Blog posts, also used as an Obsidian vault
├── content.config.ts     Collection schema + glob loader
├── layouts/
│   └── Layout.astro      Full HTML shell, global CSS imports, theme bootstrap
├── pages/                File-based routing
│   ├── about.astro
│   ├── blog/
│   │   └── [slug].astro
│   └── index.astro
├── scripts/
│   └── uptime.js
└── styles/
    ├── global.css
    └── normalize.css
```

## Conventions

- **Path aliases:** `@/*` -> `./src/*`
- **Components:** Prefer Astro `.astro` files; only use React when Astro + small inline scripts are not enough
- **Filenames:** Components use PascalCase; other source files use kebab-case unless the content naming scheme requires dates/templates
- **CSS location:** Keep site CSS in `src/styles/global.css` and `src/styles/normalize.css`, imported only by `src/layouts/Layout.astro`
- **No scoped styles:** Do not add scoped `<style>` blocks to components or pages
- **Theme:** Follow `docs/claude-theme.md`; tokens live in CSS custom properties and theme switching is driven by `data-theme="light|dark"`
- **Theme bootstrap:** Respect the existing `localStorage` key `theme-preference`, `prefers-color-scheme` fallback, and `#theme-toggle` behavior in `Layout.astro`
- **Fonts:** Reuse the configured font CSS variables `--font-noto-serif-sc`, `--font-source-han-sans-sc`, and `--font-maple-mono`
- **Language:** The site shell is currently `lang="zh-CN"`; preserve that unless the user explicitly wants a locale change
- **Content:** Use Astro Content Collections with the schema in `src/content.config.ts`; blog entries are loaded from `**/*.{md,mdx}`
- **Frontmatter order:** `draft` -> `title` -> `description` -> `tags` -> `date` -> `update` -> `revision`
- **Routing:** File-based; keep `getStaticPaths()` for dynamic blog routes
- **Layout pattern:** `Layout.astro` owns the full document shell (`<html>`, `<head>`, `<body>`), imports global styles, loads fonts, and wraps pages with `Header` + `Footer`
- **Images:** Blog images belong in `src/assets/images/`, named as `{文档名}{两位顺序数字}.扩展名`, for example `2026051900.png`
- **Image references:** Use standard Markdown image syntax like `![alt](@/assets/images/2026051900.png)`; do not leave Obsidian `![[...]]` links in published content
- **Temporary pasted assets:** If images appear inside `src/content/blog/` (for example `Pasted image ...`), treat them as unprocessed and move them into `src/assets/images/`
- **Generated directories:** Do not edit `.astro/` or `dist/` unless explicitly requested
- **Commits:** Conventional commits (`feat:`, `fix:`, `chore:`). Do not commit without permission

## Workflow

- **Docs first:** Check `./docs/` for relevant Astro or project-specific guidance before making implementation decisions
- **No post-edit validation:** Do NOT run build, `npx`, or any verification commands after modifying files
- **New blog posts:** Copy `src/content/blog/example/example.md` as the default full template
- **Alternate templates:** `src/content/blog/example/Template.md` and `src/content/blog/example/Topic.md` are lightweight variants when the user asks for them
- **整理 blog 目录图片:** 扫描 `src/content/blog/` 下的所有图片文件，移动到 `src/assets/images/`，按 `{文档名}{两位顺序数字}.扩展名` 重命名，并将 Obsidian 格式 `![[file]]` 引用更新为标准 markdown `![alt](@/assets/images/文档名00.png)`

## Docs Reference

When implementing features or making design decisions, look up `./docs/` for reference documents and guidance before proceeding.

Always check `./docs/` for the relevant Astro documentation or project-specific guidance before writing code.
