// Shared by the config, which runs in Node, and the theme, which also runs in the browser,
// so nothing here may import Node modules.
import {
  fromDate,
  parseAbsolute,
  Time,
  toCalendarDate,
  toCalendarDateTime,
  toZoned,
} from "@internationalized/date";

/** localStorage key for the theme the reader picked. */
export const THEME_STORAGE_KEY = "theme-preference";

/** Read by screen readers after a link that opens in a new tab (WCAG technique G201). */
export const NEW_TAB_NOTE = "（在新标签页打开）";

/** Post times are stored and shown in UTC, so a post's date reads the same in every time zone. */
export const SITE_TIME_ZONE = "UTC";

/** A frontmatter date without a time means 11:00 on that day in UTC+8. */
const AUTHOR_TIME_ZONE = "Asia/Shanghai";
const DEFAULT_TIME = new Time(11);

/** A post is a draft only when its frontmatter has `draft: true`, the boolean. */
export function isDraft(frontmatter: Record<string, unknown>): boolean {
  return frontmatter.draft === true;
}

/**
 * Turns a frontmatter date into an instant, written as an ISO 8601 string in UTC, or "" when
 * there is none. YAML reads a bare date such as `2026-05-18` as midnight UTC, so midnight UTC is
 * taken to mean "no time given" and becomes 11:00 UTC+8 that day, which is 03:00 UTC.
 * A value with its own time, such as `2026-05-18T21:30+08:00`, keeps that time.
 */
export function toInstant(value: unknown): string {
  if (!value) return "";
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return "";
  const utc = fromDate(date, SITE_TIME_ZONE);
  const isBareDate = utc.hour === 0 && utc.minute === 0 && utc.second === 0 && utc.millisecond === 0;
  if (!isBareDate) return utc.toAbsoluteString();
  return toZoned(toCalendarDateTime(toCalendarDate(utc), DEFAULT_TIME), AUTHOR_TIME_ZONE).toAbsoluteString();
}

/** Formats a frontmatter date as its YYYY-MM-DD in SITE_TIME_ZONE, or "" when there is none. */
export function formatDate(value: unknown): string {
  const instant = toInstant(value);
  return instant ? toCalendarDate(parseAbsolute(instant, SITE_TIME_ZONE)).toString() : "";
}
