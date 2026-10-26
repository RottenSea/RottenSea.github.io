import { readdirSync, readFileSync } from "node:fs";
import matter from "gray-matter";
import type { UserConfigFn } from "vitepress";
import { externalLinkNote } from "./markdown/external-link-note";
import { imageDimensions } from "./markdown/image-dimensions";
import { isDraft, THEME_STORAGE_KEY } from "./shared";

const srcDir = "content";

// Runs before the first paint so a saved theme never flashes the other one first.
// Without a saved choice there is no data-theme, and the CSS follows prefers-color-scheme.
const applySavedTheme = `try {
  const theme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch {}`;

// Posts with `draft: true` in their frontmatter, as paths relative to srcDir.
// They stay visible in `vitepress dev` and are left out of `vitepress build`.
function draftPosts(): string[] {
  return readdirSync(`${srcDir}/blog`)
    .filter((file) => file.endsWith(".md"))
    .filter((file) => isDraft(matter(readFileSync(`${srcDir}/blog/${file}`, "utf8")).data))
    .map((file) => `blog/${file}`);
}

const config: UserConfigFn<Record<string, never>> = ({ command }) => ({
  lang: "zh-CN",
  title: "RottenTh's cafe corner",
  srcDir,
  cleanUrls: true,
  // Templates for writing posts; never published.
  srcExclude: ["blog/example/**", ...(command === "build" ? draftPosts() : [])],
  // The custom theme follows data-theme and prefers-color-scheme itself.
  appearance: false,
  head: [
    ["script", {}, applySavedTheme],
    // The design system's fonts.css loads font CSS from Google Fonts and jsDelivr, and the font
    // files from fonts.gstatic.com and jsDelivr. Connecting early saves a round trip each. Font
    // files are fetched with CORS, which uses a separate connection, so jsDelivr needs both kinds.
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    ["link", { rel: "preconnect", href: "https://cdn.jsdelivr.net" }],
    ["link", { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossorigin: "" }],
  ],
  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    image: { lazyLoading: true },
    config(md) {
      md.use(externalLinkNote);
      md.use(imageDimensions);
    },
  },
});

export default config;
