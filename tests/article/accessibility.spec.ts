import { accessibilityProblems, expect, test } from "../fixtures";

// The home page, the about page, the 404 page, and posts with code, tables, math and pictures.
const pages = [
  "/",
  "/about",
  "/404",
  "/blog/000000",
  "/blog/000001",
  "/blog/000003",
  "/blog/000004"
];

for (const path of pages) {
  test(`${path} has no accessibility problems`, async ({ page }) => {
    await page.goto(path);
    expect(await accessibilityProblems(page)).toEqual([]);
  });
}
