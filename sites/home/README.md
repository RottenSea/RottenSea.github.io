# Rainbow Stone

The way in to the other sites, at `www.rottenth.cafe`: one screen with the name, a link to the personal website and one to the tutorials, and the design system's `DotGlobe` turning under them. It follows the reader's light or dark setting and has no switch of its own.

The design is the handoff's `Rainbow Stone.dc.html`, without its About dialog. The page is `src/pages/index.astro`; `src/pages/favicon.svg.ts` serves the design system's logo as the tab icon.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts a local server on port 4174 |
| `pnpm build` | Builds the site into `dist/` |
| `pnpm preview` | Serves the built site on port 4174 |
| `pnpm check` | Type checks the Astro files |

Run them here, or from the repository's root with `pnpm --filter home <command>`.
