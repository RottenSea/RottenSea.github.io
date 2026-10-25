import { readdirSync, readFileSync } from "node:fs";
import type { MarkdownRenderer, UserConfigFn } from "vitepress";

const srcDir = "content";

// Runs before the first paint so a saved theme never flashes the other one first.
// Without a saved choice there is no data-theme, and the CSS follows prefers-color-scheme.
const applySavedTheme = `try {
  const theme = localStorage.getItem("theme-preference");
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch {}`;

// VitePress opens external links in a new tab (same test as its link plugin), so each one
// gets a note for screen readers, as WCAG technique G201 advises.
const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;

function externalLinkNote(md: MarkdownRenderer) {
  md.core.ruler.push("external_link_note", (state) => {
    for (const block of state.tokens) {
      if (block.type !== "inline" || !block.children) continue;
      const opensNewTab: boolean[] = [];
      for (let i = 0; i < block.children.length; i++) {
        const token = block.children[i];
        if (token.type === "link_open") {
          const href = token.attrGet("href") ?? "";
          opensNewTab.push(EXTERNAL_URL_RE.test(href) && !token.attrGet("target") && !token.attrGet("download"));
        } else if (token.type === "link_close" && opensNewTab.pop()) {
          const note = new state.Token("html_inline", "", 0);
          note.content = '<span class="visually-hidden">（在新标签页打开）</span>';
          block.children.splice(i, 0, note);
          i++;
        }
      }
    }
  });
}

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
  head: [["script", {}, applySavedTheme]],
  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    config: externalLinkNote,
  },
});

export default config;
