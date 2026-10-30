import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://archive.rottenth.cafe",
  // The same URL shape as the other two sites: no trailing slash, /404 rather than /404/.
  build: { format: "file" },
  trailingSlash: "never",
  // 4173 is the personal website's, 4174 Rainbow Stone's and 4321 the design-system docs site's.
  server: { port: 4175 },
  integrations: [
    starlight({
      title: "Devil's Footprints",
      favicon: "/favicon.svg",
      // The tutorials are written in Chinese, so the pages say so: screen readers read them in
      // Chinese and Pagefind splits Chinese words. The interface stays in English through
      // src/content/i18n/zh-CN.json, which puts back every string Starlight would show in Chinese.
      locales: { root: { label: "简体中文", lang: "zh-CN" } },
      // The personal-website system's fonts; the system's colours, radii and shadows in Starlight's
      // terms.
      components: { Head: "./src/components/Head.astro" },
      customCss: [
        "@rottensea/ds-personal-website/tokens.css",
        "./src/styles/theme.css"
      ],
      expressiveCode: {
        styleOverrides: {
          borderRadius: "var(--radius-md)",
          codeFontFamily: "var(--font-mono)",
          uiFontFamily: "var(--font-sans)"
        }
      },
      sidebar: [
        {
          label: "Tutorials",
          items: [{ autogenerate: { directory: "tutorials" } }]
        }
      ]
    })
  ]
});
