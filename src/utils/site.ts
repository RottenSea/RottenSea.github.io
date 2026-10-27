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

/** Links in the site header. `matches` decides which one is marked as the current page. */
export const NAV = [
  {
    label: "blog",
    href: "/",
    matches: (path: string) => path === "/" || path.startsWith("/blog/")
  },
  {
    label: "about",
    href: "/about",
    matches: (path: string) => path === "/about"
  }
];
