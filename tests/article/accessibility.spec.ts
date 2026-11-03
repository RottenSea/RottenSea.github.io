import { accessibilityProblems, expect, test } from "../fixtures";

// The home page, the about page, the 404 page, and the example post, which has every kind of
// content a post can have.
const pages = ["/", "/about", "/404", "/blog/000000"];

for (const path of pages) {
  test(`${path} has no accessibility problems`, async ({ page }) => {
    await page.goto(path);
    expect(await accessibilityProblems(page)).toEqual([]);
  });
}
