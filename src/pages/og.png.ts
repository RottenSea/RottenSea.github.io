import type { APIContext } from "astro";
import { defaultShareImage, png } from "../utils/images";

/** The share image for pages without a cover. */
export const GET = async ({ site }: APIContext) =>
  png(await defaultShareImage(site?.host ?? "rottenth.cafe"));
