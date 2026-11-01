// Rainbow Stone, the way in: one page that leads to the other two sites.
import { expect, test } from "../fixtures";

test("the page leads to the personal website and the tutorials", async ({
  page
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Rainbow Stone"
  );
  await expect(
    page.locator("a[href='https://article.rottenth.cafe']")
  ).toBeVisible();
  await expect(
    page.locator("a[href='https://archive.rottenth.cafe']")
  ).toBeVisible();
});
