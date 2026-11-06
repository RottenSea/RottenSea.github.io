import { accessibilityProblems, expect, test } from "../fixtures";

// Starlight's search button is named "Search" and shows "Search" with its shortcut, Ctrl K, which
// axe reads as a name that leaves out visible text. The shortcut is a hint, not part of the name.
const exclude = ["button[data-open-modal]"];

// The longest pages of each series, with the most tables and key labels. axe takes 13 to 17 seconds
// on each of the Windows series' settings and WinUtil pages alone, more than 30 while the other
// tests run beside it.
test.describe.configure({ timeout: 60_000 });

for (const path of [
  "/",
  "/start",
  "/system/windows/settings",
  "/system/windows/winutil",
  "/system/linux/install",
  "/system/linux/desktop",
  "/404"
]) {
  test(`${path} has no accessibility problems`, async ({ page }) => {
    await page.goto(path);
    expect(await accessibilityProblems(page, { exclude })).toEqual([]);
  });
}
