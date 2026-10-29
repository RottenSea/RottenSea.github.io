import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Each post is a folder with its images beside it: blog/000000/index.mdx. Folders are numbered in
// the order posts were created; `pnpm new-post` picks the next number.
// Only those index files are loaded, so any other file in blog/, such as the notes in _topics.md,
// never becomes a post.
const blog = defineCollection({
  loader: glob({
    pattern: "*/index.{md,mdx}",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.split("/")[0]
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        /** `en` or `zh`. The site's own text is English; this is the post's language. */
        lang: z.enum(["en", "zh"]),
        /**
         * When the post was published: a bare date means 11:00 UTC+8 that day, and a time with its
         * zone, such as 2026-05-18T21:30+08:00, orders posts published the same day.
         */
        publishedAt: z.coerce.date(),
        /**
         * When it was last changed, written the same way. Without it, the date of the last commit
         * that changed the post. The revision count always comes from the commits.
         */
        updatedAt: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        category: z.string().optional(),
        pinned: z.boolean().default(false),
        image: image().optional(),
        /** Comments are off unless a post turns them on. */
        comment: z.boolean().default(false),
        /**
         * Replaces the folder's number in the URL: `permalink: vibe-coding` gives /blog/vibe-coding.
         * Never digits alone, which could be another post's number.
         */
        permalink: z
          .string()
          .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "use lowercase letters, digits and single hyphens"
          )
          .regex(
            /\D/,
            "use at least one letter, since a number could be a post's"
          )
          .optional(),
        draft: z.boolean().default(false)
      })
      // Unknown keys are typos, such as `update` for `updatedAt`, so they fail the build.
      .strict()
});

export const collections = { blog };
