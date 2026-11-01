import { accessibilityProblems, expect, test } from "../fixtures";

test("the page has no accessibility problems", async ({ page }) => {
  await page.goto("/");
  expect(await accessibilityProblems(page)).toEqual([]);
});
