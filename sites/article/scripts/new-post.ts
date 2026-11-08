// pnpm new-post [name]: a draft in the next folder number after those in src/content/blog and its
// history since HISTORY_START, so a deleted post's number is never reused. The name becomes
// `permalink`.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HISTORY_START } from "../src/utils/history.ts";

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
// Folders any commit after HISTORY_START touched, on local and remote branches. Not --all: other
// refs, such as a tool's checkpoints, can hold older commits that are not HISTORY_START's
// descendants.
let committed: string[] = [];
try {
  committed = execFileSync(
    "git",
    [
      "log",
      "--branches",
      "--remotes",
      `^${HISTORY_START}`,
      "--name-only",
      "--format=",
      "--",
      ":(top)sites/article/src/content/blog"
    ],
    { encoding: "utf8" }
  )
    .split("\n")
    .map((path) => path.match(/content\/blog\/([^/]+)\//)?.[1] ?? "");
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

// Now in UTC, to the second; the time orders posts published on the same day.
const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

// Every field the schema in src/content.config.ts accepts. Optional ones are commented out.
const template = `---
title: ""
description: ""
lang: zh
publishedAt: ${now}
# updatedAt: ${now}
tags: []
category:
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
