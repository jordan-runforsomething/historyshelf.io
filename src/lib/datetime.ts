/**
 * Custom utilities for dealing with datetimes
 */
import { format } from "date-fns"

export function getTimePeriodDisplay(start: Date | null, end: Date | null) {
  if (!start && !end) return ""
  if (end && !start) return end.toLocaleDateString()
  if (start && !end) return start.toLocaleDateString()

  // Note, this doesn't ever get executed it just makes TS happy
  if (!start || !end) return ""

  if (start.toDateString() == end.toDateString())
    return format(start, "M/d/yyyy")

  // If different years, we show year difference
  if (start.getFullYear() != end.getFullYear())
    return `${format(start, "yyyy")} - ${format(end, "yyyy")}`

  // If different months, we show months and year
  if (start.getMonth() != end.getMonth())
    return `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`

  // Must be the same month. Return that
  return format(start, "MMM yyyy")
}
