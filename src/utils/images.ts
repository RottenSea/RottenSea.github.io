import { readFileSync } from "node:fs";
import { join } from "node:path";
import logo from "@rottensea/ds-personal-website/assets/logo-colored.svg?raw";
import opentype from "opentype.js";
import sharp from "sharp";
import { SITE_TITLE } from "./site";

// The site's icons and its default share image, made at build time from the design system's
// logo. Colours are the light theme's tokens: cream-50 for the canvas, ink-900 for the name,
// ink-500 for muted text, coral-500 for the rule.
const CANVAS = "#faf9f5";
const INK = "#141413";
const MUTED = "#6c6a64";
const CORAL = "#d97757";

export { logo };

/** The logo as a square PNG, transparent around it. */
export const logoPng = (size: number) =>
  sharp(Buffer.from(logo)).resize(size, size).png().toBuffer();

/**
 * The icon "Add to Home Screen" uses. iOS fills a transparent icon with black and rounds the
 * corners itself, so the logo sits on the canvas colour with room around it.
 */
export async function touchIcon(size: number) {
  const inner = Math.round(size * 0.8);
  return sharp({
    create: { width: size, height: size, channels: 3, background: CANVAS }
  })
    .composite([{ input: await logoPng(inner), gravity: "center" }])
    .png()
    .toBuffer();
}

/** A font from a @fontsource package, read from node_modules when the site builds. */
function font(file: string) {
  const [, pkg] = file.match(/^(.+?)-latin/) ?? [];
  const buffer = readFileSync(
    join(
      process.cwd(),
      "node_modules",
      "@fontsource",
      pkg,
      "files",
      `${file}.woff`
    )
  );
  return opentype.parse(
    buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    )
  );
}

/**
 * SVG path data for a line of text. opentype.js 2.0's own toPathData() writes NaN for some
 * points when it shortens the data, which cut the address off after "rott"; the commands
 * themselves are sound, so they are written out here as they are.
 */
function outline(
  face: opentype.Font,
  text: string,
  x: number,
  y: number,
  size: number
) {
  return face
    .getPath(text, x, y, size)
    .commands.map((command) => {
      if (command.type === "Z") return "Z";
      const points =
        command.type === "C"
          ? [
              command.x1,
              command.y1,
              command.x2,
              command.y2,
              command.x,
              command.y
            ]
          : command.type === "Q"
            ? [command.x1, command.y1, command.x, command.y]
            : [command.x, command.y];
      return command.type + points.map((value) => value.toFixed(2)).join(" ");
    })
    .join("");
}

/**
 * The share image for a page without a cover of its own, 1200 by 630: the logo at the left, and
 * the site's name in the display serif over a short coral rule and the address. The text is
 * turned into outlines here, so the image does not depend on the fonts the build machine has.
 */
export async function defaultShareImage(address: string) {
  const width = 1200;
  const height = 630;
  const logoSize = 300;
  const left = 120 + logoSize + 72;
  const serif = font("noto-serif-latin-400-normal");
  const sans = font("manrope-latin-500-normal");
  const name = outline(serif, SITE_TITLE, left, 300, 72);
  const url = outline(sans, address, left, 404, 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="${CANVAS}"/>
  <path d="${name}" fill="${INK}"/>
  <rect x="${left}" y="336" width="64" height="4" fill="${CORAL}"/>
  <path d="${url}" fill="${MUTED}"/>
</svg>`;
  return sharp(Buffer.from(svg))
    .composite([
      {
        input: await logoPng(logoSize),
        left: 120,
        top: (height - logoSize) / 2
      }
    ])
    .png()
    .toBuffer();
}

/**
 * The largest 1200:630 box, at most 1200 wide, that fits inside an image of this size: what a
 * share card shows of a cover, with nothing enlarged.
 */
export function cardSize(width: number, height: number) {
  const ratio = 1200 / 630;
  const cardWidth = Math.min(1200, width, Math.floor(height * ratio));
  return { width: cardWidth, height: Math.round(cardWidth / ratio) };
}

/** A PNG as a static file's response. */
export const png = (body: Buffer) =>
  new Response(new Uint8Array(body), {
    headers: { "Content-Type": "image/png" }
  });
