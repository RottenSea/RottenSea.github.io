import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import {
  rehypeDsExternalLinks,
  rehypeDsHeadingAnchors,
  remarkDsDirectives,
  shikiTransformers
} from "@rottensea/ds-personal-website/markdown";
import { defineConfig } from "astro/config";

const site = "https://article.rottenth.cafe";

export default defineConfig({
  site,
  // Pages build to `about.html` rather than `about/index.html`, so URLs have no trailing slash:
  // /about, /blog/000000. GitHub Pages and Cloudflare both serve that file at that URL.
  build: { format: "file" },
  trailingSlash: "never",
  // The first five posts were named by date before posts were numbered.
  redirects: {
    "/blog/20260518": "/blog/000000",
    "/blog/20260519": "/blog/000001",
    "/blog/20260520": "/blog/000002",
    "/blog/20260616": "/blog/000003",
    "/blog/20260617": "/blog/000004"
  },
  // 4321, Astro's default, is the design-system docs site's.
  server: { port: 4173 },
  // The sitemap lists every page but the 404 one; drafts are never built for production.
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith("/404") })],
  markdown: {
    // Astro 7 defaults to Sätteri. Unified runs the design system's remark and rehype plugins.
    processor: unified({
      // Directives such as :::tip become the design system's components, and $...$ becomes math.
      remarkPlugins: [remarkDsDirectives],
      // A "#" link beside each heading, and links to other sites open in a new tab with a note
      // for screen readers. `site` tells the second plugin which links stay on this site.
      rehypePlugins: [
        rehypeDsHeadingAnchors,
        [rehypeDsExternalLinks, { site }]
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
