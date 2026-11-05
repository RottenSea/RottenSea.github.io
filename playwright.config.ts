// Tests of the three built sites in a real browser: accessibility with axe, and what the pages do.
// They run on this computer only (`pnpm test`), against each site's `astro preview` of its last
// build, in the Chrome installed here, so no browser has to be downloaded.
import { defineConfig } from "@playwright/test";

const sites = [
  { name: "home", port: 4173 },
  { name: "article", port: 4174 },
  { name: "archive", port: 4175 }
];

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    channel: "chrome",
    // The copy-link test reads the clipboard.
    permissions: ["clipboard-read", "clipboard-write"]
  },
  projects: sites.map(({ name, port }) => ({
    name,
    testMatch: `${name}/*.spec.ts`,
    use: { baseURL: `http://localhost:${port}` }
  })),
  webServer: sites.map(({ name, port }) => ({
    command: `pnpm --filter ${name} preview`,
    port,
    reuseExistingServer: true
  }))
});
