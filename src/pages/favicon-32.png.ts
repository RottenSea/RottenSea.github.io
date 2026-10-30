import { logoPng, png } from "../utils/images";

/** The tab icon for browsers that do not take an SVG one, such as Safari before 26. */
export const GET = async () => png(await logoPng(32));
