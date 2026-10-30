import type { APIContext } from "astro";

/** Every crawler is welcome (round AH4); the sitemap lists the pages. */
export const GET = ({ site }: APIContext) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap-index.xml", site)}\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    }
  );
