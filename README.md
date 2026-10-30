# rottenth.cafe

The sites on rottenth.cafe, one folder each in `sites/`, named for its address:

| Folder | Site | Address |
| --- | --- | --- |
| `sites/home` | Rainbow Stone, the way in to the other sites | `www.rottenth.cafe` |
| `sites/article` | The Key of Urala, the personal website | `article.rottenth.cafe` |
| `sites/archive` | Devil's Footprints, tutorials | `archive.rottenth.cafe` |

Each site is its own Astro project and its own README says how it is laid out and what its commands do. They are built on the systems from [RottenSea/design-system](https://github.com/RottenSea/design-system), whose docs are on GitHub Pages at `rottensea.github.io/design-system`.

Cloudflare Workers Builds builds each site from `main` and deploys it with Wrangler; the site's `wrangler.jsonc` names its Worker and its address, and `public/_headers` its response headers. The personal website used to be at [rottensea.github.io](https://rottensea.github.io); GitHub Pages now serves only redirect pages there, one for each of the site's pages, made by `scripts/pages-redirect.ts` in `.github/workflows/deploy.yml`. The repository keeps its name because GitHub Pages serves a repository named so at that address.

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

`pnpm --filter <folder name> <command>` runs any of a site's own commands from here, such as `pnpm --filter article preview`.

Biome's settings in `biome.json` are shared by every site. It formats the TypeScript files and the script parts of `.astro` files; it leaves the HTML in `.astro` files, Markdown, MDX and SVG files alone.
