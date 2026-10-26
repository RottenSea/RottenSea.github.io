// Shared by the config, which runs in Node, and the theme, which also runs in the browser,
// so nothing here may import Node modules.

/** localStorage key for the theme the reader picked. */
export const THEME_STORAGE_KEY = "theme-preference";

/** Read by screen readers after a link that opens in a new tab (WCAG technique G201). */
export const NEW_TAB_NOTE = "（在新标签页打开）";

/** Dates are shown as calendar days in this time zone, whatever the reader's own is. */
export const TIME_ZONE = "Asia/Shanghai";

/** A post is a draft only when its frontmatter has `draft: true`, the boolean. */
export function isDraft(frontmatter: Record<string, unknown>): boolean {
  return frontmatter.draft === true;
}

const dayParts = new Intl.DateTimeFormat("en", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Formats a frontmatter date as YYYY-MM-DD in TIME_ZONE, or "" when there is none.
 * YAML reads `2026-05-18` as midnight UTC, which is still the same day in Asia/Shanghai.
 */
export function formatDate(value: unknown): string {
  if (!value) return "";
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return "";
  const parts = Object.fromEntries(dayParts.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
