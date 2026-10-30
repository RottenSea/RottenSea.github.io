import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.rottenth.cafe",
  // The same URL shape as the personal website: no trailing slash, /404 rather than /404/.
  build: { format: "file" },
  trailingSlash: "never",
  // 4173 is the personal website's and 4321 the design-system docs site's.
  server: { port: 4174 }
});
