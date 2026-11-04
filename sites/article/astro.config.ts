import { existsSync, readdirSync, readFileSync } from "node:fs";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import {
  rehypeDsExternalLinks,
  rehypeDsHeadingAnchors,
  rehypeDsTaskLists,
  remarkDsDirectives,
  shikiTransformers
} from "@rottensea/ds-personal-website/markdown";
import { defineConfig } from "astro/config";

const site = "https://article.rottenth.cafe";

// The URLs of the drafts, which get a page that only a link reaches. The config cannot read the
// content collection, so it reads `draft` and `permalink` from each post's frontmatter.
const BLOG = "src/content/blog";
const drafts = new Set(
  readdirSync(BLOG, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap(({ name }) => {
      const file = ["index.mdx", "index.md"]
        .map((index) => `${BLOG}/${name}/${index}`)
        .find((path) => existsSync(path));
      const front =
        file &&
        readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
      if (!front || !/^draft:\s*true\s*$/m.test(front)) return [];
      const permalink = front.match(/^permalink:\s*["']?([^"'\s]+)/m)?.[1];
      return [`${site}/blog/${permalink ?? name}`];
    })
);

export default defineConfig({
  site,
  // URLs without a trailing slash. CSS is inlined so the first paint needs only the HTML; until
  // then the browser shows a blank tab in its own colours.
  build: { format: "file", inlineStylesheets: "always" },
  trailingSlash: "never",
  // Several widths per image; the design system's components size them, so Astro adds no styles.
  image: { layout: "constrained" },
  // 4321, Astro's default, is the design-system docs site's.
  server: { port: 4173 },
  // The sitemap lists every page but the 404 one and the drafts.
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.endsWith("/404") && !drafts.has(page) })
  ],
  markdown: {
    // Astro 7 defaults to Sätteri. Unified runs the design system's remark and rehype plugins.
    processor: unified({
      // Directives such as :::tip become the design system's components, and $...$ becomes math.
      remarkPlugins: [remarkDsDirectives],
      // `site` tells the external-links plugin which links stay on this site.
      rehypePlugins: [
        rehypeDsHeadingAnchors,
        [rehypeDsExternalLinks, { site }],
        rehypeDsTaskLists
      ],
      // Keep punctuation exactly as written: posts mix Chinese text with ASCII quotes and dashes.
      smartypants: false
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      // Both themes' colours go into CSS variables, and CodeBlock picks one.
      defaultColor: false,
      // A fence's title, highlighted lines and Shiki's [!code ...] notations.
      transformers: shikiTransformers()
    }
  }
});
