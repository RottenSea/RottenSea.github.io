// Devil's Footprints: Starlight's pages and its search.
import { expect, test } from "../fixtures";

test("the landing page leads to a tutorial", async ({ page }) => {
  await page.goto("/");
  await page.locator(".hero a[href='/tutorials/write-a-tutorial']").click();
  await expect(page).toHaveURL(/\/tutorials\/write-a-tutorial$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "在这里写一篇教程"
  );
});

test("search finds a tutorial", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search" }).click();
  const dialog = page.getByRole("dialog", { name: "Search" });
  await dialog.getByRole("textbox", { name: "Search" }).fill("教程");
  await expect(
    dialog.locator("a[href*='/tutorials/write-a-tutorial']").first()
  ).toBeVisible();
});
