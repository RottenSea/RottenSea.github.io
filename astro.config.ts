import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";
import { designSystem } from "./src/integrations/design-system";
import { rehypeExternalLinks } from "./src/plugins/rehype-external-links";

export default defineConfig({
  site: "https://rottenth.cafe",
  // Pages build to `about.html` rather than `about/index.html`, so URLs have no trailing slash:
  // /about, /blog/20260518. GitHub Pages and Cloudflare both serve that file at that URL.
  build: { format: "file" },
  trailingSlash: "never",
  // 4321, Astro's default, is the design-system docs site's.
  server: { port: 4173 },
  integrations: [mdx(), designSystem()],
  markdown: {
    // Astro 7 defaults to Sätteri. Unified runs the remark and rehype plugins the site uses.
    processor: unified({
      rehypePlugins: [rehypeExternalLinks],
      // Keep punctuation exactly as written: posts mix Chinese text with ASCII quotes and dashes.
      smartypants: false
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      // Both themes' colors go into CSS variables, and prose.css picks one with the page's
      // color-scheme, so a [data-theme] subtree shows the right one too.
      defaultColor: false
    }
  }
});
