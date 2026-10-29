// Creates a new draft post: pnpm new-post <name>
// The name is the post's folder and its URL, such as vibe-coding for /blog/vibe-coding. It is
// required, so two posts published on the same day never share a URL.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const name = process.argv[2];

if (!name) {
  console.error(
    "Give the post a name: pnpm new-post <name>, such as pnpm new-post vibe-coding."
  );
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
  console.error(
    `"${name}" is not a valid name: use lowercase letters, digits and single hyphens.`
  );
  process.exit(1);
}

const dir = join("src", "content", "blog", name);
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
# permalink: another-url
draft: true
---

`;

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "index.mdx"), template);
console.log(
  `Created ${join(dir, "index.mdx")}. Images for the post go in the same folder.`
);
