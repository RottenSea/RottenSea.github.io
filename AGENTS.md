# Agent notes for this repo

The personal website, The Key of Urala, built with Astro 7. The README covers the layout and the commands; these notes cover what the config does not explain and what has gone wrong before.

## Working here

- Commit each change without asking, and keep history: no amending or rewriting pushed commits. Ask before pushing, because a push to `main` deploys the site.
- The design system comes from its GitHub Release tarball URL in `package.json`. Keep it that way in every commit; a `link:` to a local checkout builds here and breaks in CI.
- Write repo prose without the owner's name ("the site", not "RottenSea's site"). Repo URLs and the `@rottensea/` package scope are identifiers and stay.

## Posts

- A post is `src/content/blog/<name>/index.mdx`, and `<name>` is its URL. New posts get a short English name from `pnpm new-post <name>`; the first five keep their date names so their URLs stay.
- The collection loads only `*/index.{md,mdx}`. That pattern, not the underscore, keeps `src/content/blog/_topics.md` out: Astro 5 removed the rule that skipped files starting with `_`.
- Posts are MDX. In prose, `<`, `{` and `}` need a backslash and HTML comments are written `{/* */}`. Code blocks are safe.
- A bare frontmatter date means 11:00 UTC+8 that day (03:00 UTC), so its UTC date matches the date written. Dates are stored and shown in UTC; `publishedAt` must fall on `published`'s day in UTC+8, which the schema checks.

## Markdown

- Astro 7's default processor is Sätteri. The site uses unified (`@astrojs/markdown-remark`) because every plugin it uses or plans is a remark or rehype plugin.
- `smartypants` is off. With it on, Astro turns ASCII quotes, `--` and `...` into curly quotes and dashes, which changes the punctuation in Chinese posts.

## Build output

`build.format: "file"` keeps URLs without a trailing slash. During a build, `Astro.url.pathname` is then the file's path (`/about.html`, `/index.html`), while `astro dev` gives `/about`. Use `pagePath()` from `src/utils/site.ts` wherever a URL is compared or printed, as the canonical link and the nav do.

## Biome

- Formatting matches the owner's Prettier settings: `attributePosition: "multiline"` and `trailingCommas: "none"`.
- Biome's full `.astro` support is experimental and mangles templates (unindented `<style>`, split inline elements, unstable output), so it is off. Biome sees only the frontmatter and `<script>` of `.astro` files, which is why the unused-variable rules are off for them.
- Markdown and SVG files are excluded: Biome pads Markdown tables and asks for a `<title>` in the decorative Lucide icons.

## The /design page

Specimen iframes are sized from the `<html>` element's `getBoundingClientRect().height`. `scrollHeight` never reports less than the iframe's own height, so a frame sized from it can grow but never shrink. The frames are fitted again when their fonts finish loading.

## Checking in the browser pane

- A hidden pane runs no `requestAnimationFrame`, no ResizeObserver callbacks and no CSS transitions. A script that awaits a frame hangs, and layout-dependent results are stale.
- The pane reports `prefers-reduced-motion: reduce`. The design system then gives every element a 1ms transition on every property, so a computed style read right after a change is the old value. Read it after a timeout, or check what the script wrote (for example `element.style.height`).
- `pnpm preview` serves `dist/`; rebuild before checking a change there.
