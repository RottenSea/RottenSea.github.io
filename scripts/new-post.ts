// Creates a new draft post: pnpm new-post [name]
// Its folder is the next number after the highest one in src/content/blog or in its git history,
// six digits, so a deleted post's number is never used again. The URL is /blog/<number>, or
// /blog/<name> when a name is given: the name goes into the post's `permalink`.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BLOG = join("src", "content", "blog");
const name = process.argv[2];

if (name !== undefined) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || !/\D/.test(name)) {
    console.error(
      `"${name}" is not a valid name: use lowercase letters, digits and single hyphens, with at least one letter.`
    );
    process.exit(1);
  }
}

const folders = readdirSync(BLOG, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
// The folders of every path under src/content/blog that a commit touched: deleted posts' too.
let committed: string[] = [];
try {
  committed = execFileSync(
    "git",
    // git prints and takes paths with forward slashes on every system.
    ["log", "--all", "--name-only", "--format=", "--", "src/content/blog"],
    { encoding: "utf8" }
  )
    .split("\n")
    .map((path) => path.split("/")[3] ?? "");
} catch {
  console.warn("git could not be run, so only the folders here were counted.");
}
const numbers = [...folders, ...committed]
  .filter((folder) => /^\d{6}$/.test(folder))
  .map(Number);
const id = String(numbers.length ? Math.max(...numbers) + 1 : 0).padStart(
  6,
  "0"
);
const dir = join(BLOG, id);
if (existsSync(dir)) {
  console.error(`${dir} already exists.`);
  process.exit(1);
}

// The current moment in UTC+8, the author's time zone. `publishedAt` keeps the time, which
// orders posts published on the same day.
const parts = Object.fromEntries(
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  })
    .formatToParts(new Date())
    .map(({ type, value }) => [type, value])
);
const date = `${parts.year}-${parts.month}-${parts.day}`;
const time = `${parts.hour}:${parts.minute}:${parts.second}`;

// Every field the schema in src/content.config.ts accepts. Optional ones are commented out.
const template = `---
title: ""
description: ""
lang: zh
publishedAt: ${date}T${time}+08:00
# updatedAt: ${date}T${time}+08:00
tags: []
# category: ""
# image: ./cover.png
# pinned: true
# comment: true
${name ? `permalink: ${name}` : "# permalink: another-url"}
draft: true
---

`;

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "index.mdx"), template);
console.log(
  `Created ${join(dir, "index.mdx")}, at /blog/${name ?? id}. Images for the post go in the same folder.`
);
