// Devil's Footprints: Starlight's pages and its search.
import { expect, test } from "../fixtures";

test("the landing page leads to the start page, and the start page to a series", async ({
  page
}) => {
  await page.goto("/");
  await page.locator(".hero a[href='/start']").click();
  await expect(page).toHaveURL(/\/start$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "从这里开始"
  );
  await page.locator(".sl-markdown-content a[href='/system/windows']").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "安装干净稳定的 Windows"
  );
});

test("search finds a page of a series", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search" }).click();
  const dialog = page.getByRole("dialog", { name: "Search" });
  await dialog.getByRole("textbox", { name: "Search" }).fill("Ventoy");
  await expect(
    dialog.locator("a[href*='/system/windows/prepare']").first()
  ).toBeVisible();
});

test("robots.txt lets every crawler in and points to the sitemap", async ({
  request
}) => {
  const text = await (await request.get("/robots.txt")).text();
  expect(text).toContain("User-agent: *\nAllow: /");
  expect(text).toContain(
    "Sitemap: https://archive.rottenth.cafe/sitemap-index.xml"
  );
});
