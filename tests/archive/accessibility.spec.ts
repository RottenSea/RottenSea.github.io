import { accessibilityProblems, expect, test } from "../fixtures";

// Starlight's search button is named "Search" and shows "Search" with its shortcut, Ctrl K, which
// axe reads as a name that leaves out visible text. The shortcut is a hint, not part of the name.
const exclude = ["button[data-open-modal]"];

for (const path of ["/", "/tutorials/write-a-tutorial", "/404"]) {
  test(`${path} has no accessibility problems`, async ({ page }) => {
    await page.goto(path);
    expect(await accessibilityProblems(page, { exclude })).toEqual([]);
  });
}
