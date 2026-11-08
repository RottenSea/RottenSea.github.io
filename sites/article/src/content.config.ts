import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// A post is blog/<number>/index.mdx; only those files load, so other files in blog/ are not posts.
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
        /** A bare date means 04:00 UTC; a time, written in UTC, orders posts of the same day. */
        publishedAt: z.coerce.date(),
        /** Defaults to the last commit that changed the post. */
        updatedAt: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        /** `pnpm new-post` leaves it empty, which YAML reads as null: no category. */
        category: z
          .string()
          .nullish()
          .transform((category) => category ?? undefined),
        pinned: z.boolean().default(false),
        image: image().optional(),
        /** Comments are off unless a post turns them on. */
        comment: z.boolean().default(false),
        /** Replaces the folder's number in the URL; never digits alone. */
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
