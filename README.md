# RottenSea.github.io

Personal website, served at [rottensea.github.io](https://rottensea.github.io).

It is built with [VitePress](https://vitepress.dev/) 1.6 and a custom theme on the personal-website system from [RottenSea/design-system](https://github.com/RottenSea/design-system). The source of the earlier Astro version is in this repository's history up to commit `2226353`.

## Writing

Posts are Markdown files in `content/blog/`. Images go in `content/blog/images/` and are referenced by relative paths such as `./images/2026051900.png`. A post with `draft: true` in its frontmatter shows up in `pnpm dev` but not in the built site. `content/blog/example/` holds templates and is never published.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Installs VitePress and the design system |
| `pnpm dev` | Starts a local server that reloads on changes |
| `pnpm build` | Builds the site into `.vitepress/dist/` |
| `pnpm preview` | Serves the built site. Restart it after each build, because it only serves files that existed when it started |

Pushing to `main` deploys the site to GitHub Pages through `.github/workflows/deploy.yml`.

- [GitHub](https://github.com/RottenSea)
