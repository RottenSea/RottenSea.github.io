// What every test shares: pages that never reach the live comment service, and an axe check.
import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

/** A built site talks to the comment service at comment.rottenth.cafe. */
const COMMENT_SERVICE = "https://comment.rottenth.cafe/**";

export const test = base.extend({
  // A loaded post would otherwise add to its real view count.
  page: async ({ page }, use) => {
    await page.route(COMMENT_SERVICE, (route) => route.abort());
    await use(page);
  }
});

export { expect };

/**
 * axe under WCAG 2.2 A and AA. Colour contrast is skipped, since three low-contrast pairs are kept
 * on purpose, and so is Twikoo's markup. A covered Spoiler's text is invisible, which axe cannot
 * tell, so it is not counted against "label in name".
 */
export async function accessibilityProblems(
  page: Page,
  { exclude = [] as string[] } = {}
) {
  let axe = new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .disableRules(["color-contrast"])
    .exclude(".ds-comments .twikoo");
  for (const selector of exclude) axe = axe.exclude(selector);
  const { violations } = await axe.analyze();
  return violations
    .map(({ id, help, nodes }) => ({
      id,
      help,
      where: nodes
        .map((node) => node.target.join(" "))
        .filter(
          (target) =>
            !(
              id === "label-content-name-mismatch" &&
              target.includes(".ds-spoiler")
            )
        )
        .slice(0, 5)
    }))
    .filter(({ where }) => where.length > 0);
}
