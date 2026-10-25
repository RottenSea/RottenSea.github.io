import { createContentLoader } from "vitepress";

export interface Post {
  url: string;
  title: string;
  description: string;
  /** Publication date as YYYY-MM-DD. */
  date: string;
}

declare const data: Post[];
export { data };

// createContentLoader ignores srcExclude, so it drops the templates and, in a build, the drafts itself.
const isBuild = process.env.NODE_ENV === "production";

export default createContentLoader("blog/*.md", {
  transform(pages): Post[] {
    return pages
      .filter(({ frontmatter }) => !(isBuild && frontmatter.draft))
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title,
        description: frontmatter.description ?? "",
        date: new Date(frontmatter.date).toISOString().slice(0, 10),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  },
});
