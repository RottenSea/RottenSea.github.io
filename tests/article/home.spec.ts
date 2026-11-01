// The home page's list: filtering by category, tag and calendar day, and the empty state.
import { accessibilityProblems, expect, test } from "../fixtures";

const visiblePosts = (page: import("@playwright/test").Page) =>
  page.locator("[data-post]:not([hidden])");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("lists every published post, drafts left out", async ({ page }) => {
  await expect(visiblePosts(page)).toHaveCount(5);
  await expect(page.getByText("Markdown 与组件示例")).toHaveCount(0);
});

test("a category filters the list, and pressing it again clears it", async ({
  page
}) => {
  const ai = page.locator(".home-categories button[data-value='AI']");
  await ai.click();
  await expect(ai).toHaveAttribute("aria-pressed", "true");
  await expect(visiblePosts(page)).toHaveCount(3);
  for (const post of await visiblePosts(page).all()) {
    await expect(post).toHaveAttribute("data-category", "AI");
  }
  await ai.click();
  await expect(visiblePosts(page)).toHaveCount(5);
});

test("a category and a tag must both match, or the list says nothing matches", async ({
  page
}) => {
  await page.locator(".home-categories button[data-value='AI']").click();
  await page.locator(".home-tags button[data-value='blog']").click();
  await expect(visiblePosts(page)).toHaveCount(0);
  await expect(page.locator(".home-empty")).toBeVisible();
});

test("a day in the calendar shows that day's post", async ({ page }) => {
  const calendar = page.locator(".home-calendar");
  const previous = calendar.getByRole("button", { name: "Previous month" });
  const day = calendar.locator("button[data-date='2026-06-17']");
  // The calendar opens on the reader's month; step back to June 2026.
  for (let step = 0; step < 24 && !(await day.isVisible()); step++)
    await previous.click();
  await day.click();
  await expect(visiblePosts(page)).toHaveCount(1);
  await expect(visiblePosts(page)).toContainText("安装干净稳定的 Windows");
});

test("search opens with / and finds a post", async ({ page }) => {
  await page.keyboard.press("/");
  const search = page.getByRole("dialog", { name: "Search" });
  await expect(search).toBeVisible();
  await search.getByRole("combobox", { name: "Search" }).fill("Windows");
  const result = search.getByRole("option").first();
  await expect(result).toContainText("Windows");
  await result.click();
  await expect(page).toHaveURL(/\/blog\/000004/);
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
  await page.getByRole("combobox", { name: "Search" }).fill("Windows");
  await expect(page.getByRole("option").first()).toBeVisible();
  expect(await accessibilityProblems(page)).toEqual([]);
  await page.getByRole("button", { name: "Close search" }).click();
  await page.getByRole("button", { name: "Display settings" }).click();
  await expect(
    page.getByRole("dialog", { name: "Display settings" })
  ).toBeVisible();
  expect(await accessibilityProblems(page)).toEqual([]);
});
