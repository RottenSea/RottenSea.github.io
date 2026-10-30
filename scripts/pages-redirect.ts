// GitHub Pages at rottensea.github.io, where the personal website used to be, only sends readers
// on to the sites at rottenth.cafe. Usage: node scripts/pages-redirect.ts <the site's dist> <output>
//
// Its home page goes to www.rottenth.cafe, the way in to all the sites. Every other page the
// personal website builds gets a page at the same path that redirects to the same path at
// article.rottenth.cafe, so an old link still lands on its post: a meta refresh, which search engines treat as a permanent
// redirect, a canonical link, and a script that keeps the query and fragment. Its 404 page does
// the same for any other path, from the address bar. Nothing else is copied: no feed, no images.
import {
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import { dirname, join, relative } from "node:path";

const ORIGIN = "https://article.rottenth.cafe";
const HOME = "https://www.rottenth.cafe/";
const [dist, out] = process.argv.slice(2);
if (!dist || !out)
  throw new Error("Usage: node scripts/pages-redirect.ts <dist> <out>");

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const escapeAttribute = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

const page = (target: string | null) => {
  // A known page goes to its own address; the 404 page works its target out in the browser.
  const href = target ? escapeAttribute(target) : ORIGIN;
  const head = target
    ? `<link rel="canonical" href="${href}" />
    <meta http-equiv="refresh" content="0; url=${href}" />
    <script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>`
    : `<script>location.replace(${JSON.stringify(ORIGIN)} + location.pathname + location.search + location.hash);</script>`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Moved to rottenth.cafe</title>
    ${head}
  </head>
  <body>
    <p>This page has moved to <a href="${href}">${href}</a>.</p>
  </body>
</html>
`;
};

rmSync(out, { recursive: true, force: true });
let count = 0;
for (const file of walk(dist)) {
  if (!file.endsWith(".html")) continue;
  const path = relative(dist, file).replaceAll("\\", "/");
  // about.html is /about, as the site's URLs have no extension.
  const target =
    path === "404.html"
      ? null
      : path === "index.html"
        ? HOME
        : `${ORIGIN}/${path.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "")}`;
  mkdirSync(dirname(join(out, path)), { recursive: true });
  writeFileSync(join(out, path), page(target));
  count++;
}
console.log(`Wrote ${count} redirect pages to ${out}.`);
