import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { authorDate, writtenDate } from "./utils/time";

// Each post is a folder with its images beside it: blog/20260518/index.mdx.
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
        /** A bare date means 11:00 UTC+8 that day. */
        published: z.coerce.date(),
        updated: z.coerce.date().optional(),
        /** The exact moment, with its time zone, for ordering posts published the same day. */
        publishedAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
        revision: z.number().int().positive().optional(),
        tags: z.array(z.string()).default([]),
        category: z.string().optional(),
        pinned: z.boolean().default(false),
        image: image().optional(),
        /** Comments are off unless a post turns them on. */
        comment: z.boolean().default(false),
        /** Replaces the folder name in the URL: `permalink: vibe-coding` gives /blog/vibe-coding. */
        permalink: z
          .string()
          .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "use lowercase letters, digits and single hyphens"
          )
          .optional(),
        draft: z.boolean().default(false)
      })
      // Unknown keys are typos, such as `update` for `updated`, so they fail the build.
      .strict()
      .superRefine((data, ctx) => {
        const pairs = [
          ["publishedAt", data.publishedAt, data.published],
          ["updatedAt", data.updatedAt, data.updated]
        ] as const;
        for (const [key, exact, day] of pairs) {
          if (!exact) continue;
          if (!day) {
            ctx.addIssue({
              code: "custom",
              path: [key],
              message: `${key} needs the matching date field too`
            });
          } else if (authorDate(exact) !== writtenDate(day)) {
            ctx.addIssue({
              code: "custom",
              path: [key],
              message: `${key} falls on ${authorDate(exact)} in UTC+8, not on ${writtenDate(day)}`
            });
          }
        }
      })
});

export const collections = { blog };
