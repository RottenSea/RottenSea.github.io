export const SITE_TITLE = "The Key of Urala";

/** The site in one line: pages without their own description, the feed and llms.txt use it. */
export const SITE_DESCRIPTION = "欢迎来到 RottenTh 的咖啡角~";

/** Who writes the posts: the copyright card and the about page use it. */
export const AUTHOR = "RottenTh";

/** localStorage key for the theme the reader picked. */
export const THEME_STORAGE_KEY = "theme-preference";

/** localStorage key for the reader's Reduce motion setting. */
export const MOTION_STORAGE_KEY = "reduce-motion";

/** Read by screen readers after a link that opens in a new tab (WCAG technique G201). */
export const NEW_TAB_NOTE = " (opens in a new tab)";

/**
 * A page's public URL path. With `build.format: "file"`, Astro.url.pathname is the built file's
 * path during a build (/about.html, /index.html) but the clean path in `astro dev` (/about, /).
 */
export function pagePath(url: URL): string {
  const path = url.pathname.replace(/\.html$/, "").replace(/\/index$/, "/");
  return path || "/";
}

/** Links in the site's nav. `matches` decides which one is marked as the current page. */
export const NAV = [
  {
    label: "Blog",
    href: "/",
    matches: (path: string) => path === "/" || path.startsWith("/blog/")
  },
  {
    label: "About",
    href: "/about",
    matches: (path: string) => path === "/about"
  }
];

/** The author's pages on other sites: the about page and the footer list them. */
export const SOCIAL = [
  { label: "GitHub", href: "https://github.com/RottenSea" },
  { label: "Bluesky", href: "https://bsky.app/profile/rottenth.bsky.social" }
];

/** The footer's link columns: the site's pages, and the author's other sites with the feed. */
export const FOOTER_COLUMNS = [
  { title: "Site", links: NAV.map(({ label, href }) => ({ label, href })) },
  { title: "Elsewhere", links: [...SOCIAL, { label: "RSS", href: "/rss.xml" }] }
];

/**
 * The home page with its list filtered to one category or tag. The home page reads the query once,
 * filters, scrolls past the quote to the list, and puts its address back to `/`.
 */
export const filterUrl = (key: "category" | "tag", value: string) =>
  `/?${new URLSearchParams({ [key]: value })}`;

/** The licence posts are published under. */
export const POST_LICENSE = {
  name: "CC BY-NC-SA 4.0",
  href: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
};
