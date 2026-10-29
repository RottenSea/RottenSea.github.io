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
 * Turns a frontmatter date into an instant, written as an ISO 8601 string in UTC.
 * YAML reads a bare date such as `2026-05-18` as midnight UTC, so midnight UTC is taken to mean
 * "no time given" and becomes 11:00 UTC+8 that day, which is 03:00 UTC.
 * A value with its own time, such as `2026-05-18T21:30+08:00`, keeps that time.
 */
export function toInstant(date: Date): string {
  const utc = fromDate(date, SITE_TIME_ZONE);
  const isBareDate =
    utc.hour === 0 &&
    utc.minute === 0 &&
    utc.second === 0 &&
    utc.millisecond === 0;
  if (!isBareDate) return utc.toAbsoluteString();
  return toZoned(
    toCalendarDateTime(toCalendarDate(utc), DEFAULT_TIME),
    AUTHOR_TIME_ZONE
  ).toAbsoluteString();
}

/** The YYYY-MM-DD of an instant in SITE_TIME_ZONE. */
export function formatDate(instant: string): string {
  return toCalendarDate(parseAbsolute(instant, SITE_TIME_ZONE)).toString();
}
