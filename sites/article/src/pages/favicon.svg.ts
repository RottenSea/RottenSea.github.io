import { logo } from "../utils/images";

/** The tab icon: the design system's logo as it is. */
export const GET = () =>
  new Response(logo, { headers: { "Content-Type": "image/svg+xml" } });
