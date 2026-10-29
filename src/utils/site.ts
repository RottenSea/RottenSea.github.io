export const SITE_TITLE = "The Key of Urala";

/** Who writes the posts: the copyright card and the about page use it. */
export const AUTHOR = "RottenTh";

/** localStorage key for the theme the reader picked. */
export const THEME_STORAGE_KEY = "theme-preference";

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

/** The footer's link columns. RSS joins Elsewhere once the site has a feed. */
export const FOOTER_COLUMNS = [
  { title: "Site", links: NAV.map(({ label, href }) => ({ label, href })) },
  { title: "Elsewhere", links: SOCIAL }
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
