import { type CollectionEntry, getCollection } from "astro:content";
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
  updated?: string;
  updatedDate?: string;
}

export function postDates({ data }: Post): PostDates {
  const published = toInstant(data.publishedAt ?? data.published);
  const updatedValue = data.updatedAt ?? data.updated;
  const updated = updatedValue && toInstant(updatedValue);
  return {
    published,
    publishedDate: formatDate(published),
    updated,
    updatedDate: updated && formatDate(updated)
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
