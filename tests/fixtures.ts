// What every test shares: pages that never reach the live comment service, and an axe check.
import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

/** A built site talks to the comment service at comment.rottenth.cafe. */
const COMMENT_SERVICE = "https://comment.rottenth.cafe/**";

export const test = base.extend({
  // A test that loaded a post would otherwise add to its real view count. The comments and the
  // count stay empty instead, as when the service does not answer.
  page: async ({ page }, use) => {
    await page.route(COMMENT_SERVICE, (route) => route.abort());
    await use(page);
  }
});

export { expect };

/**
 * The page's accessibility problems, as axe finds them under WCAG 2.2 A and AA. Colour contrast is
 * left out: three low-contrast pairs from the design handoff are kept on purpose. So is Twikoo's
 * comment area, whose markup is Twikoo's own. A site can leave out more with `exclude`.
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
  return violations.map(({ id, help, nodes }) => ({
    id,
    help,
    where: nodes.map((node) => node.target.join(" ")).slice(0, 5)
  }));
}
