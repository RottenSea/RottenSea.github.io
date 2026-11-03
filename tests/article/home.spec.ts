// The home page's list: filtering by category, tag and calendar day, and the empty state. The
// filter tests take their category, tag, day and title from whatever posts are published, and
// skip when there are none.
import { accessibilityProblems, expect, test } from "../fixtures";

type Page = import("@playwright/test").Page;

const posts = (page: Page) => page.locator("[data-post]");
const visiblePosts = (page: Page) => page.locator("[data-post]:not([hidden])");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

/** Skips the test when no post is published. */
async function needPosts(page: Page) {
  test.skip((await posts(page).count()) === 0, "no post is published");
}

test("lists the published posts, drafts left out", async ({ page }) => {
  await expect(page.getByText("Markdown 与组件示例")).toHaveCount(0);
  await expect(page.locator("a[href='/blog/000000']")).toHaveCount(0);
});

test("a category filters the list, and pressing it again clears it", async ({
  page
}) => {
  await needPosts(page);
  const all = await posts(page).count();
  const category = page.locator(".home-categories button[data-value]").first();
  const value = await category.getAttribute("data-value");
  await category.click();
  await expect(category).toHaveAttribute("aria-pressed", "true");
  for (const post of await visiblePosts(page).all()) {
    await expect(post).toHaveAttribute("data-category", value ?? "");
  }
  await category.click();
  await expect(visiblePosts(page)).toHaveCount(Math.min(all, 10));
});

test("a day in the calendar shows that day's posts, and Clear shows them all again", async ({
  page
}) => {
  await needPosts(page);
  const calendar = page.locator(".home-calendar");
  const clear = page.getByRole("button", { name: "Clear" });
  await expect(clear).toBeHidden();
  // The calendar opens on the reader's month; step back to a month with a post.
  const previous = calendar.getByRole("button", { name: "Previous month" });
  const day = calendar.locator("button[data-date]").first();
  for (let step = 0; step < 36 && !(await day.isVisible()); step++)
    await previous.click();
  await day.click();
  const shown = await visiblePosts(page).count();
  expect(shown).toBeGreaterThan(0);
  await expect(clear).toBeVisible();
  await clear.click();
  await expect(clear).toBeHidden();
  await expect(calendar.locator("[aria-pressed='true']")).toHaveCount(0);
  expect(await visiblePosts(page).count()).toBeGreaterThanOrEqual(shown);
});

test("a filter that matches nothing says so", async ({ page }) => {
  await needPosts(page);
  const categories = page.locator(".home-categories button[data-value]");
  const tags = page.locator(".home-tags button[data-value]");
  // Look for a category and a tag no post has together.
  for (const category of await categories.all()) {
    await category.click();
    for (const tag of await tags.all()) {
      await tag.click();
      if ((await visiblePosts(page).count()) === 0) {
        await expect(page.locator(".home-empty")).toBeVisible();
        return;
      }
      await tag.click();
    }
    await category.click();
  }
  test.skip(true, "every category and tag go together in some post");
});

test("search opens with / and finds a post", async ({ page }) => {
  await needPosts(page);
  const title = (
    await posts(page).first().locator("h2, h3").first().innerText()
  ).trim();
  await page.keyboard.press("/");
  const search = page.getByRole("dialog", { name: "Search" });
  await expect(search).toBeVisible();
  await search.getByRole("combobox", { name: "Search" }).fill(title);
  const result = search.getByRole("option").first();
  await expect(result).toContainText(title);
});

test("the display settings change the theme and motion, and remember them", async ({
  page
}) => {
  await page.getByRole("button", { name: "Display settings" }).click();
  const settings = page.getByRole("dialog", { name: "Display settings" });
  await settings.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await settings.getByRole("switch", { name: /Reduce motion/ }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduce-motion",
    "true"
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduce-motion",
    "true"
  );
});

test("the open search and settings have no accessibility problems", async ({
  page
}) => {
  await page.keyboard.press("/");
  await expect(page.getByRole("combobox", { name: "Search" })).toBeVisible();
  expect(await accessibilityProblems(page)).toEqual([]);
  await page.getByRole("button", { name: "Close search" }).click();
  await page.getByRole("button", { name: "Display settings" }).click();
  await expect(
    page.getByRole("dialog", { name: "Display settings" })
  ).toBeVisible();
  expect(await accessibilityProblems(page)).toEqual([]);
});
