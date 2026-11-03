// A post page: its table of contents, sharing, and drafts. The example post at /blog/000000 is a
// draft, which still gets its page.
import { expect, test } from "../fixtures";

const EXAMPLE = "/blog/000000";

test("the table of contents leads to its headings", async ({ page }) => {
  await page.goto(EXAMPLE);
  const toc = page.locator(".ds-toc").first();
  const links = toc.locator("a");
  expect(await links.count()).toBeGreaterThan(2);
  const second = links.nth(1);
  const target = decodeURIComponent((await second.getAttribute("href")) ?? "");
  await second.click();
  await expect(page).toHaveURL(
    new RegExp(`${encodeURIComponent(target.slice(1))}$`)
  );
  await expect(page.locator(`[id="${target.slice(1)}"]`)).toBeInViewport();
});

test("Copy link copies the post's address and says so", async ({ page }) => {
  await page.goto(EXAMPLE);
  await page.getByRole("button", { name: "Copy link" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Link copied" })
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    `https://article.rottenth.cafe${EXAMPLE}`
  );
});

test("Share poster opens a dialog with the poster", async ({ page }) => {
  await page.goto(EXAMPLE);
  await page.getByRole("button", { name: "Share poster" }).click();
  const dialog = page.getByRole("dialog", { name: "Share poster" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("canvas")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Download" })).toBeVisible();
});

test("a draft opens from its link, kept out of search engines, search and the feeds", async ({
  page,
  request
}) => {
  await page.goto(EXAMPLE);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Markdown 与组件示例"
  );
  await expect(page.locator("meta[name='robots']")).toHaveAttribute(
    "content",
    "noindex"
  );
  await expect(page.locator("[data-pagefind-body]")).toHaveCount(0);
  // No previous or next: a draft is in no list.
  await expect(page.locator(".ds-post-nav a")).toHaveCount(0);
  for (const feed of ["/rss.xml", "/llms.txt", "/sitemap-0.xml"]) {
    expect(await (await request.get(feed)).text()).not.toContain(EXAMPLE);
  }
});

test("a page that does not exist gets the 404 page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
