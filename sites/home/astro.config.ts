import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.rottenth.cafe",
  // The same URL shape as the personal website: no trailing slash, /404 rather than /404/.
  // The CSS goes into the page, so the first paint needs only the HTML (as on the personal website).
  build: { format: "file", inlineStylesheets: "always" },
  trailingSlash: "never",
  // 4174 is the personal website's and 4321 the design-system docs site's.
  server: { port: 4173 }
});
