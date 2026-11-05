import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://archive.rottenth.cafe",
  // No trailing slash, and inlined CSS, as on the other two sites.
  build: { format: "file", inlineStylesheets: "always" },
  trailingSlash: "never",
  // 4173 is Rainbow Stone's, 4174 the personal website's and 4321 the design-system docs site's.
  server: { port: 4175 },
  integrations: [
    starlight({
      title: "Devil's Footprints",
      favicon: "/favicon.svg",
      // zh-CN for screen readers and Pagefind; src/content/i18n/zh-CN.json keeps the interface in English.
      locales: { root: { label: "简体中文", lang: "zh-CN" } },
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
      // A series lists its pages in their sidebar.order.
      sidebar: [
        { label: "Start here", link: "/start" },
        {
          label: "System",
          items: [
            {
              label: "Windows",
              items: [{ autogenerate: { directory: "system/windows" } }]
            }
          ]
        }
      ]
    })
  ]
});
