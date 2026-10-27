// Serves the design system's specimen pages at /ds/ so the /design page can show them in iframes.
// Each iframe loads the design system's own CSS, so the site's styles and the specimens stay apart.
import { cpSync, existsSync, readFileSync, statSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createRequire } from "node:module";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

/** URL path the design system's files are served under. */
export const DS_BASE = "/ds/";

/** Folders of the package the specimen pages need: the pages, their CSS, the built tokens, the logo. */
const FOLDERS = ["guidelines", "src", "dist", "assets"];

export const designSystemDir = dirname(
  createRequire(import.meta.url).resolve(
    "@rottensea/ds-personal-website/package.json"
  )
);

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2"
};

/** Dev-server middleware, mounted at DS_BASE. Serves only files inside FOLDERS. */
function serve(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const pathname = decodeURIComponent(
    new URL(req.url ?? "/", "http://localhost").pathname
  );
  const file = join(designSystemDir, pathname);
  const [folder] = relative(designSystemDir, file).split(sep);
  if (
    !FOLDERS.includes(folder) ||
    !existsSync(file) ||
    !statSync(file).isFile()
  )
    return next();
  res.setHeader(
    "Content-Type",
    TYPES[extname(file)] ?? "application/octet-stream"
  );
  res.end(readFileSync(file));
}

export function designSystem(): AstroIntegration {
  return {
    name: "design-system-specimens",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use(DS_BASE, serve);
      },
      "astro:build:done": ({ dir }) => {
        for (const folder of FOLDERS) {
          cpSync(
            join(designSystemDir, folder),
            join(fileURLToPath(dir), DS_BASE, folder),
            { recursive: true }
          );
        }
      }
    }
  };
}
