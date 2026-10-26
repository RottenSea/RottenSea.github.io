# RottenSea.github.io

Personal website, served at [rottensea.github.io](https://rottensea.github.io).

It is built with [VitePress](https://vitepress.dev/) 1.6 and a custom theme on the personal-website system from [RottenSea/design-system](https://github.com/RottenSea/design-system). The source of the earlier Astro version is in this repository's history up to commit `2226353`.

## Writing

Posts are Markdown files in `content/blog/`. Images go in `content/blog/images/` and are referenced by relative paths such as `./images/2026051900.png`. A post with `draft: true` in its frontmatter shows up in `pnpm dev` but not in the built site. `content/blog/example/` holds templates and is never published.

## Layout

The layout follows VitePress's [custom theme guide](https://vitepress.dev/guide/custom-theme) and the official [Vue blog](https://github.com/vuejs/blog), with the Markdown kept in `content/` through the `srcDir` option.

| Path | What it holds |
| --- | --- |
| `content/` | Pages and posts. Each Markdown file becomes a page at the same path |
| `.vitepress/config.ts` | Site config |
| `.vitepress/shared.ts` | Constants and helpers used by both the config and the theme |
| `.vitepress/markdown/` | markdown-it plugins the config adds |
| `.vitepress/theme/index.ts` | Theme entry: loads the design system and the styles, registers global components |
| `.vitepress/theme/Layout.vue` | The page frame. Picks the home, page, post or 404 component |
| `.vitepress/theme/components/` | Vue components, each with its own scoped styles |
| `.vitepress/theme/styles/` | Global styles: Markdown content in `prose.css`, helpers in `utilities.css` |
| `.vitepress/theme/posts.data.ts` | Build-time list of posts for the home page |

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Installs VitePress and the design system |
| `pnpm dev` | Starts a local server that reloads on changes |
| `pnpm build` | Builds the site into `.vitepress/dist/` |
| `pnpm preview` | Serves the built site. Restart it after each build, because it only serves files that existed when it started |

Pushing to `main` deploys the site to GitHub Pages through `.github/workflows/deploy.yml`.

- [GitHub](https://github.com/RottenSea)
