import { type CollectionEntry, getCollection } from "astro:content";
import { readFileSync } from "node:fs";
import { fileHistory } from "./git";
import { formatDate, toInstant } from "./time";

export type Post = CollectionEntry<"blog">;

/** A post's folder name: six digits, numbered in the order posts were created. */
export const POST_ID = /^\d{6}$/;

/** The last part of a post's URL: its `permalink`, or else its folder's number. */
export const postSlug = (post: Post) => post.data.permalink ?? post.id;

export const postUrl = (post: Post) => `/blog/${postSlug(post)}`;

export interface PostDates {
  /** Publication time as an ISO 8601 instant in UTC. */
  published: string;
  /** Publication date as YYYY-MM-DD in UTC. */
  publishedDate: string;
  /** `updatedAt`, or else the last commit that changed the post, or else now, for a new post. */
  updated: string;
  updatedDate: string;
  /** How many commits changed the post; 0 before its first. */
  revisions: number;
}

const bareDateKeys = new Map<string, Set<string>>();

/** The frontmatter keys of a post written as a date alone, such as `publishedAt: 2026-11-03`. */
function bareDates(filePath: string): Set<string> {
  let keys = bareDateKeys.get(filePath);
  if (!keys) {
    const front =
      readFileSync(filePath, "utf8").match(
        /^---\r?\n([\s\S]*?)\r?\n---/
      )?.[1] ?? "";
    keys = new Set(
      [
        ...front.matchAll(/^(\w+):\s*(["']?)\d{4}-\d{2}-\d{2}\2\s*(?:#.*)?$/gm)
      ].map(([, key]) => key)
    );
    bareDateKeys.set(filePath, keys);
  }
  return keys;
}

export function postDates({ data, filePath }: Post): PostDates {
  const bare = filePath ? bareDates(filePath) : new Set<string>();
  const published = toInstant(data.publishedAt, bare.has("publishedAt"));
  const { revisions, lastChanged } = filePath
    ? fileHistory(filePath)
    : { revisions: 0, lastChanged: undefined };
  const updated = data.updatedAt
    ? toInstant(data.updatedAt, bare.has("updatedAt"))
    : new Date(lastChanged ?? Date.now()).toISOString();
  return {
    published,
    publishedDate: formatDate(published),
    updated,
    updatedDate: formatDate(updated),
    revisions
  };
}

/** Listed posts, pinned first, then newest; drafts only in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  return (await getAllPosts()).filter(
    ({ data }) => import.meta.env.DEV || !data.draft
  );
}

/** Every post that gets a page, drafts too; fails on an unnumbered folder or a duplicate URL. */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection("blog");
  const seen = new Map<string, string>();
  for (const post of posts) {
    if (!POST_ID.test(post.id))
      throw new Error(
        `Post folder ${post.id} is not six digits; pnpm new-post names folders`
      );
    const slug = postSlug(post);
    const other = seen.get(slug);
    if (other)
      throw new Error(
        `Posts ${other} and ${post.id} both use the URL /blog/${slug}`
      );
    seen.set(slug, post.id);
  }
  return posts.sort(
    (a, b) =>
      Number(b.data.pinned) - Number(a.data.pinned) ||
      postDates(b).published.localeCompare(postDates(a).published)
  );
}
