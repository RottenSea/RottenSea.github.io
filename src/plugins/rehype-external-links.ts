import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { NEW_TAB_NOTE } from "../utils/site";

/** A link to another site: one with a scheme such as https: or mailto:, or protocol-relative. */
const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;

/**
 * Opens links to other sites in a new tab, and adds a visually hidden note after the link text
 * so screen reader users know (WCAG technique G201). prose.css draws a visible arrow for everyone else.
 */
export function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      const href = String(node.properties.href ?? "");
      if (
        !EXTERNAL_URL_RE.test(href) ||
        node.properties.target ||
        node.properties.download
      )
        return;
      node.properties.target = "_blank";
      node.properties.rel = ["noreferrer"];
      node.children.push({
        type: "element",
        tagName: "span",
        properties: { className: ["visually-hidden"] },
        children: [{ type: "text", value: NEW_TAB_NOTE }]
      });
    });
  };
}
