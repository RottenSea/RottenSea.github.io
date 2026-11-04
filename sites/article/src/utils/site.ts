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

/** With `build.format: "file"`, Astro.url.pathname is /about.html in a build but /about in dev. */
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

/** The footer's link columns. */
export const FOOTER_COLUMNS = [
  {
    title: "Site",
    links: [
      ...NAV.map(({ label, href }) => ({ label, href })),
      { label: "RSS", href: "/rss.xml" }
    ]
  },
  {
    title: "Network",
    links: [
      { label: "Rainbow Stone", href: "https://www.rottenth.cafe" },
      { label: "Devil's Footprints", href: "https://archive.rottenth.cafe" }
    ]
  },
  { title: "Elsewhere", links: SOCIAL }
];

/** The home page filtered to one category or tag; the page reads the query once and drops it. */
export const filterUrl = (key: "category" | "tag", value: string) =>
  `/?${new URLSearchParams({ [key]: value })}`;

/** Twikoo for comments and view counts; in development the local copy from pnpm dev:comment. */
export const COMMENT_SERVER = import.meta.env.DEV
  ? "http://localhost:8787"
  : "https://comment.rottenth.cafe";

/** The licence posts are published under. */
export const POST_LICENSE = {
  name: "CC BY-NC-SA 4.0",
  href: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
};
