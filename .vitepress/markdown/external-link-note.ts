import type { MarkdownRenderer } from "vitepress";
import { NEW_TAB_NOTE } from "../shared";

// The same test VitePress's link plugin uses to open a link in a new tab.
const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;

/** Adds a visually hidden note to every Markdown link that VitePress opens in a new tab. */
export function externalLinkNote(md: MarkdownRenderer) {
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
          note.content = `<span class="visually-hidden">${NEW_TAB_NOTE}</span>`;
          block.children.splice(i, 0, note);
          i++;
        }
      }
    }
  });
}
