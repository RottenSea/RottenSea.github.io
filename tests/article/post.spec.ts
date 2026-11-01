// A post page: its table of contents, sharing, the comments, and old addresses.
import { expect, test } from "../fixtures";

test("the table of contents leads to its headings", async ({ page }) => {
  await page.goto("/blog/000001");
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
  await page.goto("/blog/000001");
  await page.getByRole("button", { name: "Copy link" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Link copied" })
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "https://article.rottenth.cafe/blog/000001"
  );
});

test("Share poster opens a dialog with the poster", async ({ page }) => {
  await page.goto("/blog/000001");
  await page.getByRole("button", { name: "Share poster" }).click();
  const dialog = page.getByRole("dialog", { name: "Share poster" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("canvas")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Download" })).toBeVisible();
});

test("a post that takes comments has the comment area at its end", async ({
  page
}) => {
  await page.goto("/blog/000001");
  const comments = page.locator("ds-comments");
  await comments.scrollIntoViewIfNeeded();
  await expect(
    comments.getByRole("heading", { name: "Comments" })
  ).toBeVisible();
});

test("an address from before posts were numbered leads to the post", async ({
  page
}) => {
  await page.goto("/blog/20260519");
  await expect(page).toHaveURL(/\/blog\/000001$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Vibe Coding"
  );
});

test("a page that does not exist gets the 404 page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
