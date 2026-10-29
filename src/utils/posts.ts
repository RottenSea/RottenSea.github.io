import { type CollectionEntry, getCollection } from "astro:content";
import { fileHistory } from "./git";
import { formatDate, toInstant } from "./time";

export type Post = CollectionEntry<"blog">;

/** The last part of a post's URL: its `permalink`, or else its folder name. */
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

export function postDates({ data, filePath }: Post): PostDates {
  const published = toInstant(data.publishedAt);
  const { revisions, lastChanged } = filePath
    ? fileHistory(filePath)
    : { revisions: 0, lastChanged: undefined };
  const updated = data.updatedAt
    ? toInstant(data.updatedAt)
    : new Date(lastChanged ?? Date.now()).toISOString();
  return {
    published,
    publishedDate: formatDate(published),
    updated,
    updatedDate: formatDate(updated),
    revisions
  };
}

/**
 * Every post, pinned ones first, then newest first. Drafts show up in `astro dev` only.
 * Fails the build when two posts would get the same URL.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection(
    "blog",
    ({ data }) => import.meta.env.DEV || !data.draft
  );
  const seen = new Map<string, string>();
  for (const post of posts) {
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
