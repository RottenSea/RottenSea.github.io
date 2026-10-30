# The Key of Urala

The personal website, served at [rottensea.github.io](https://rottensea.github.io) until it moves to `article.rottenth.cafe`.

It is built with [Astro](https://astro.build/) 7 on the personal-website system from [RottenSea/design-system](https://github.com/RottenSea/design-system). The VitePress version that came before it is in this repository's history up to commit `52c6356`; until the sites moved into `sites/`, this site was the whole repository.

## Writing

Each post is a folder in `src/content/blog/` with an `index.mdx` and the post's images beside it, referenced as `./cover.png`. Folders are six-digit numbers in the order posts were created, from `000000`, and the number is the post's URL: `src/content/blog/000006/` becomes `/blog/000006`, unless the post sets `permalink`, which needs at least one letter. The first five posts were named by date before; `astro.config.ts` redirects those URLs.

`pnpm new-post` creates the next numbered folder with every frontmatter field in it, and `pnpm new-post <name>` also sets `permalink` to the name. A deleted post's number is not used again, since the script also counts folders in the git history. Both fill in `publishedAt` with the current time in UTC+8, which orders posts published on the same day. `publishedAt` can also be a bare date, meaning 11:00 UTC+8 that day. The fields and their rules are in `src/content.config.ts`, and a post with an unknown or mistyped field fails the build.

A post's revision count is the number of commits that changed its `index.mdx`, read from git when the site is built, and its update date is that of the last of them unless the post sets `updatedAt`. The build needs the full history: a shallow clone gives every post one revision, and the build warns about it.

A post with `draft: true` shows up in `pnpm dev` but not in the built site. Only `index.md` or `index.mdx` one folder down becomes a post, so `src/content/blog/_quotes.md` is never published. It holds the quotes the home page shows one of at random: a line per quote, starting with `- `, with ` — ` before its source.

Posts are MDX, so `<`, `{` and `}` in ordinary text have to be escaped (`\<`, `\{`, `\}`), and HTML comments are written `{/* ... */}`. Code blocks and inline code are not affected.

## Layout

| Path | What it holds |
| --- | --- |
| `src/content/blog/` | Posts |
| `src/content.config.ts` | The post collection and its frontmatter schema |
| `src/pages/` | Routes: the home page, about, 404 and `blog/[slug]`; and files made at build time: the feed (`rss.xml`, every post in full), `llms.txt`, `robots.txt`, the icons and the default share image (`og.png`) |
| `src/layouts/` | `BaseLayout` is the page frame; `AboutLayout` lays out about.mdx with the avatar and the author's other sites |
| `src/components/` | The site's own components; the page shell (nav, footer, search, display settings) comes from the design system |
| `src/styles/` | `prose.css`, the running-text styles the design system leaves to the site |
| `src/utils/` | Dates, the post list, reading time, the home page's quotes, site constants, and `images.ts`, which draws the icons and share image from the design system's logo with `sharp` |
| `src/scripts/` | `home.ts` filters and pages the home page's posts and counts the uptime; `search.ts` answers the nav's search from the Pagefind index |
| `scripts/new-post.ts` | The `pnpm new-post` script |
| `pagefind.yml` | Pagefind's settings: one Chinese index of the posts, without screen-reader text |

Markdown runs through the unified processor (`@astrojs/markdown-remark`) rather than Astro 7's default, Sätteri, because the design system's plugins are remark and rehype plugins. They turn directives such as `:::tip` into the design system's components, typeset math, and add heading anchors and the new-tab mark on links to other sites; the post page passes the design system's `components` map so code fences, tables and images become its components too.

## Commands

Run these in this folder, or from the repository's root with `pnpm --filter article <command>`. `pnpm install`, `pnpm format` and Biome's checks run from the root for every site.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts a local server on port 4173 that reloads on changes |
| `pnpm build` | Builds the site into `dist/`, then indexes the posts for search with Pagefind; `pnpm dev` has no index |
| `pnpm preview` | Serves the built site on port 4173 |
| `pnpm check` | Type checks the Astro files |
| `pnpm new-post` | Creates a draft post |

Pushing to `main` checks the repository, then builds this site and deploys it to GitHub Pages through `.github/workflows/deploy.yml`.
