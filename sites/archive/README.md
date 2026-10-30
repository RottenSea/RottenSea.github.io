# Devil's Footprints

Tutorials, at `archive.rottenth.cafe`. It is a [Starlight](https://starlight.astro.build/) site in the personal-website system's fonts, colours, radii and shadows; the sidebar, search, previous and next links and the table of contents are Starlight's own.

The tutorials are written in Chinese and the interface is in English. The site's language is `zh-CN`, so pages say they are Chinese and Pagefind splits Chinese words for search; `src/content/i18n/zh-CN.json` gives every string Starlight shows (its own, Pagefind's and the code blocks') in English.

| Path | What it holds |
| --- | --- |
| `src/content/docs/index.mdx` | The front page |
| `src/content/docs/tutorials/` | The tutorials, one file each; the sidebar lists them in `sidebar.order` |
| `src/styles/theme.css` | Starlight's colour, font and shadow variables set to the system's tokens, and its asides drawn as the system's admonitions |
| `src/components/Head.astro` | Starlight's head with the system's `Fonts` |
| `src/pages/favicon.svg.ts` | The design system's logo as the tab icon |

`src/content/docs/tutorials/write-a-tutorial.mdx` is the sample tutorial and says how to write one.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts a local server on port 4175; search works only in a build |
| `pnpm build` | Builds the site and its search index into `dist/` |
| `pnpm preview` | Serves the built site on port 4175 |
| `pnpm check` | Type checks the Astro files |

Run them here, or from the repository's root with `pnpm --filter archive <command>`.
