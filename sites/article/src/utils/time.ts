// Used both at build time and in the browser, so nothing here may import Node modules.
import {
  fromDate,
  parseAbsolute,
  Time,
  toCalendarDate,
  toCalendarDateTime,
  toZoned
} from "@internationalized/date";

/** Post times are stored and shown in UTC, so a post's date reads the same in every time zone. */
export const SITE_TIME_ZONE = "UTC";

/** A frontmatter date without a time means 11:00 on that day in UTC+8. */
export const AUTHOR_TIME_ZONE = "Asia/Shanghai";
const DEFAULT_TIME = new Time(11);

/**
 * A frontmatter date as an ISO instant in UTC. YAML reads a bare date as midnight UTC, which
 * becomes 11:00 UTC+8. Only the written text tells a bare date from a time that is midnight UTC,
 * such as 08:00+08:00, so the caller says which it was.
 */
export function toInstant(date: Date, bareDate: boolean): string {
  const utc = fromDate(date, SITE_TIME_ZONE);
  if (!bareDate) return utc.toAbsoluteString();
  return toZoned(
    toCalendarDateTime(toCalendarDate(utc), DEFAULT_TIME),
    AUTHOR_TIME_ZONE
  ).toAbsoluteString();
}

/** The YYYY-MM-DD of an instant in SITE_TIME_ZONE. */
export function formatDate(instant: string): string {
  return toCalendarDate(parseAbsolute(instant, SITE_TIME_ZONE)).toString();
}
