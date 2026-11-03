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
  // Pages build to `about.html` rather than `about/index.html`, so URLs have no trailing slash:
  // /about, /blog/000000. GitHub Pages and Cloudflare both serve that file at that URL.
  build: { format: "file" },
  trailingSlash: "never",
  // Every image gets several widths and a `sizes` that follows its own width, so a phone loads a
  // smaller file. The design system's components size the images; Astro adds no styles of its own.
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
      // A "#" link beside each heading, links to other sites open in a new tab with a note for
      // screen readers, and each task list checkbox is named by its task. `site` tells the second
      // plugin which links stay on this site.
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
      // Both themes' colors go into CSS variables; the design system's CodeBlock picks one with
      // the page's color-scheme, so a [data-theme] subtree shows the right one too.
      defaultColor: false,
      // A fence's title, highlighted lines and Shiki's [!code ...] notations.
      transformers: shikiTransformers()
    }
  }
});
