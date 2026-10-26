import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { imageSize } from "image-size";
import type { MarkdownRenderer } from "vitepress";

const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;

/**
 * Writes width and height on every local Markdown image, read from the file itself.
 * The browser then reserves the image's space before it loads, so the text below does not jump.
 */
export function imageDimensions(md: MarkdownRenderer) {
  md.core.ruler.push("image_dimensions", (state) => {
    const file: string | undefined = state.env.path;
    if (!file) return;
    for (const block of state.tokens) {
      if (block.type !== "inline" || !block.children) continue;
      for (const token of block.children) {
        if (token.type !== "image" || token.attrGet("width")) continue;
        const src = token.attrGet("src");
        if (!src || EXTERNAL_URL_RE.test(src) || src.startsWith("/")) continue;
        try {
          const { width, height } = imageSize(readFileSync(resolve(dirname(file), decodeURIComponent(src))));
          token.attrSet("width", String(width));
          token.attrSet("height", String(height));
        } catch {
          // A missing or unreadable image keeps its plain tag, and the build reports the broken path.
        }
      }
    }
  });
}
