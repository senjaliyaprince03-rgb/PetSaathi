/**
 * Shared Indian Standard Time (IST, Asia/Kolkata, UTC+05:30) date helpers.
 * Replaces timezone-naive ISO string date splitting to avoid day-boundary shifts.
 */

const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Returns date as YYYY-MM-DD in Asia/Kolkata timezone.
 */
export function toISTDateString(date: Date | string | number = new Date()): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date provided to toISTDateString");
  }
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Alias for toISTDateString
 */
export const formatDateIST = toISTDateString;

/**
 * Returns human-readable date & time in IST (e.g. "21 Sep 2026, 02:30 am IST").
 */
export function formatDateTimeIST(date: Date | string | number = new Date()): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date provided to formatDateTimeIST");
  }
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
