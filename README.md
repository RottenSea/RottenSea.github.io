# rottenth.cafe

The sites on rottenth.cafe, one folder each in `sites/`, named for its address:

| Folder | Site | Address |
| --- | --- | --- |
| `sites/home` | Rainbow Stone, the way in to the other sites | `www.rottenth.cafe` |
| `sites/article` | The Key of Urala, the personal website | `article.rottenth.cafe` |
| `sites/archive` | Devil's Footprints, tutorials | `archive.rottenth.cafe` |

Each site is its own Astro project and its own README says how it is laid out and what its commands do. They are built on the systems from [RottenSea/design-system](https://github.com/RottenSea/design-system), whose docs are on GitHub Pages at `rottensea.github.io/design-system`.

The posts' comments and view counts come from a [Twikoo](https://twikoo.js.org) comment service at `comment.rottenth.cafe`, in `workers/comment`. Twikoo does not publish its Cloudflare backend, so `workers/comment/build.ts` fetches Twikoo's source at a fixed release into `workers/comment/.twikoo/` and builds it there; the comments, the counts and Twikoo's settings are in a D1 database.

Cloudflare Workers Builds builds each site, and the comment service, from `main` and deploys it with Wrangler; the site's `wrangler.jsonc` names its Worker and its address, and `public/_headers` its response headers. The personal website used to be at [rottensea.github.io](https://rottensea.github.io); GitHub Pages now serves only redirect pages there, made by `scripts/pages-redirect.ts` in `.github/workflows/deploy.yml`. Its home page goes to www.rottenth.cafe and every other page to the same path on article.rottenth.cafe. The repository keeps its name because GitHub Pages serves a repository named so at that address.

## Commands

The repository is a [pnpm](https://pnpm.io/) workspace. From the root:

| Command | What it does |
| --- | --- |
| `pnpm install` | Installs every site's dependencies |
| `pnpm check` | Runs Biome's format and lint checks over the repository, then type checks every site |
| `pnpm format` | Formats and fixes what Biome can fix |
| `pnpm build` | Builds every site |
| `pnpm dev:home` | Starts Rainbow Stone's local server, on port 4174 |
| `pnpm dev:article` | Starts the personal website's local server, on port 4173 |
| `pnpm dev:archive` | Starts Devil's Footprints' local server, on port 4175 |
| `pnpm new-post` | Creates a draft post on the personal website |
| `pnpm test` | Tests the three sites' last builds in a real browser: accessibility with axe, and what the pages do. Build first (`pnpm build`); it uses the Chrome installed on this computer and runs here only, not in CI |
| `pnpm build:comment` | Builds the comment service; the first time, it fetches and builds Twikoo, which takes some minutes |
| `pnpm dev:comment` | Runs the comment service at `http://localhost:8787`, with a database of its own in `workers/comment/.wrangler/`; the personal website's local server uses it, so trying a post leaves nothing in the real comments |

`pnpm --filter <folder name> <command>` runs any of a site's own commands from here, such as `pnpm --filter article preview`.

The tests are in `tests/`, a folder for each site, with `playwright.config.ts` at the root. They start each site's `astro preview` themselves, block every request to the comment service so no real view count moves, and leave colour contrast out of the axe check: the design system keeps three low-contrast colour pairs on purpose.

Biome's settings in `biome.json` are shared by every site. It formats the TypeScript files and the script parts of `.astro` files; it leaves the HTML in `.astro` files, Markdown, MDX and SVG files alone.
