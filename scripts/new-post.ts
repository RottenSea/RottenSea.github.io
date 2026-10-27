// Creates a new draft post: pnpm new-post [folder]
// The folder defaults to today's date in UTC+8, such as 20261027, which is also the post's URL.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai"
}).format(new Date());
const folder = process.argv[2] ?? today.replaceAll("-", "");

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folder)) {
  console.error(
    `"${folder}" is not a valid folder name: use lowercase letters, digits and single hyphens.`
  );
  process.exit(1);
}

const dir = join("src", "content", "blog", folder);
if (existsSync(dir)) {
  console.error(`${dir} already exists.`);
  process.exit(1);
}

// Every field the schema in src/content.config.ts accepts. Optional ones are commented out.
const template = `---
title: ""
description: ""
lang: zh
published: ${today}
# updated: ${today}
# publishedAt: ${today}T09:30:00+08:00
tags: []
# category: ""
# image: ./cover.png
# revision: 1
# pinned: true
# comment: true
# permalink: a-readable-url
draft: true
---

`;

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "index.mdx"), template);
console.log(
  `Created ${join(dir, "index.mdx")}. Images for the post go in the same folder.`
);
