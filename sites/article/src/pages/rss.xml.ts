import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { getContainerRenderer } from "@astrojs/mdx/container-renderer";
import rss from "@astrojs/rss";
import { components } from "@rottensea/ds-personal-website/components";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import sanitizeHtml from "sanitize-html";
import { getPosts, postDates, postUrl } from "../utils/posts";
import { SITE_DESCRIPTION, SITE_TITLE } from "../utils/site";

/**
 * The feed, RSS 2.0 with each post in full (round AH2). Every post is rendered as its page
 * renders it, with the design system's components, then cut down to what a feed reader shows:
 * no scripts, styles or classes; no buttons, heading anchors, code-block bars or text meant only
 * for screen readers; every link and image address made absolute. Components without their CSS
 * fall back to plain HTML: a callout is a few paragraphs, a code group is its blocks one after
 * another, a diagram is its source.
 */

/** Parts of a component that mean nothing without its CSS and scripts. */
const DROP = [
  "ds-heading__anchor",
  "ds-visually-hidden",
  "ds-code__bar",
  "ds-code__fold",
  "katex-html"
];

function clean(html: string, page: URL) {
  const absolute = (value?: string) => {
    if (!value) return value;
    try {
      return new URL(value, page).href;
    } catch {
      return value;
    }
  };
  // The first pass keeps class, which exclusiveFilter needs to see; the second drops it, along
  // with the blank lines left where scripts and styles were.
  const kept = sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "figure",
      "figcaption",
      "details",
      "summary",
      "del",
      "ins",
      "kbd",
      "mark",
      "sup",
      "sub",
      "math",
      "semantics",
      "mrow",
      "mi",
      "mo",
      "mn",
      "ms",
      "mtext",
      "msup",
      "msub",
      "msubsup",
      "mfrac",
      "msqrt",
      "mroot",
      "mover",
      "munder",
      "munderover",
      "mtable",
      "mtr",
      "mtd",
      "mspace"
    ],
    allowedAttributes: {
      "*": ["class"],
      a: ["href", "title"],
      img: ["src", "alt", "width", "height"],
      th: ["align", "colspan", "rowspan"],
      td: ["align", "colspan", "rowspan"],
      math: ["display"]
    },
    // The text inside these goes too, not only the tag.
    nonTextTags: [
      "script",
      "style",
      "textarea",
      "option",
      "noscript",
      "button",
      "template",
      "annotation"
    ],
    exclusiveFilter: (frame) => {
      const classes = String(frame.attribs.class ?? "").split(/\s+/);
      return DROP.some((name) => classes.includes(name));
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, href: absolute(attribs.href) ?? "" }
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, src: absolute(attribs.src) ?? "" }
      })
    }
  });
  return sanitizeHtml(kept, {
    allowedTags: false,
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "width", "height"],
      th: ["align", "colspan", "rowspan"],
      td: ["align", "colspan", "rowspan"],
      math: ["display"]
    }
  }).replace(/\n{3,}/g, "\n\n");
}

export async function GET(context: APIContext) {
  const site = context.site ?? new URL("https://rottenth.cafe");
  const container = await AstroContainer.create({
    renderers: await loadRenderers([getContainerRenderer()])
  });
  // Newest first, whatever is pinned on the home page.
  const posts = (await getPosts()).toSorted((a, b) =>
    postDates(b).published.localeCompare(postDates(a).published)
  );
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const link = new URL(postUrl(post), site);
      const html = await container.renderToString(Content, {
        props: { components }
      });
      return {
        title: post.data.title,
        description: post.data.description,
        link: link.href,
        pubDate: new Date(postDates(post).published),
        categories: [
          ...(post.data.category ? [post.data.category] : []),
          ...post.data.tags
        ],
        content: clean(html, link)
      };
    })
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    items,
    customData: "<language>zh-cn</language>"
  });
}
