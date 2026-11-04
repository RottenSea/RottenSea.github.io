import type { APIContext } from "astro";
import { getPosts, postDates, postUrl } from "../utils/posts";
import { AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from "../utils/site";

/** llms.txt (llmstxt.org): the site, then every post with its `description`, newest first. */
export async function GET({ site }: APIContext) {
  const base = site ?? new URL("https://article.rottenth.cafe");
  const posts = (await getPosts()).toSorted((a, b) =>
    postDates(b).published.localeCompare(postDates(a).published)
  );
  const categories = [
    ...new Set(
      posts.flatMap((post) => (post.data.category ? [post.data.category] : []))
    )
  ];
  const lines = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION} ${AUTHOR} 的个人博客，文章分类：${categories.join("、")}。`,
    "",
    "## Posts",
    "",
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${new URL(postUrl(post), base).href}): ${post.data.description}`
    ),
    "",
    "## About",
    "",
    `- [About](${new URL("/about", base).href}): ${AUTHOR} 和这个网站`,
    `- [RSS](${new URL("/rss.xml", base).href}): 所有文章的全文`,
    ""
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
