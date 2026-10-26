import { createContentLoader } from "vitepress";
import { formatDate, isDraft } from "../shared";

export interface Post {
  url: string;
  title: string;
  description: string;
  /** Publication date as YYYY-MM-DD. */
  date: string;
}

declare const data: Post[];
export { data };

// createContentLoader ignores srcExclude, so it drops the drafts from a build itself.
// The pattern does not reach blog/example/, so the templates never get here.
const isBuild = process.env.NODE_ENV === "production";

export default createContentLoader("blog/*.md", {
  transform(pages): Post[] {
    return pages
      .filter(({ frontmatter }) => !(isBuild && isDraft(frontmatter)))
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title,
        description: frontmatter.description ?? "",
        date: formatDate(frontmatter.date),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  },
});
