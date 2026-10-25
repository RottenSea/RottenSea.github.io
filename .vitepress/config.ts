import { readdirSync, readFileSync } from "node:fs";
import type { UserConfigFn } from "vitepress";

const srcDir = "content";

// Posts with `draft: true` in their frontmatter, as paths relative to srcDir.
// They stay visible in `vitepress dev` and are left out of `vitepress build`.
function draftPosts(): string[] {
  return readdirSync(`${srcDir}/blog`)
    .filter((file) => file.endsWith(".md"))
    .filter((file) => /^---[\s\S]*?^draft:\s*true\s*$[\s\S]*?^---/m.test(readFileSync(`${srcDir}/blog/${file}`, "utf8")))
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
  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
  },
});

export default config;
