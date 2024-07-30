import { Temporal } from "@js-temporal/polyfill";

// offset is undefined when the name is recognized by Temporal
export type ResolvedTimezoneAbbrev = { name: string; offset: string | undefined };

export type OffsetBand = {
  offset: string;
  color: string; // SVG color keyword
}

export async function lookupTimezoneAbbrev(
  abbrev: string
): Promise<ResolvedTimezoneAbbrev[]> {
  if (abbrev === "") return [];
  const res = await fetch(`/tz/abbrev/${encodeURIComponent(abbrev)}`);
  if (res.status === 200) {
    return res.json() as Promise<ResolvedTimezoneAbbrev[]>;
  }
  return [];
}

export async function attemptLocalizeTime(
  time: Temporal.Instant,
  timezonelike: string
) {
  try {
    // Try Temporal first
    return time
      .toZonedDateTimeISO(timezonelike)
      .toPlainDateTime()
      .toString({ smallestUnit: "seconds" });
  } catch {
    if (timezonelike !== "") {
      // Fallback to the in-house list
      const possibleTimezones = (await lookupTimezoneAbbrev(timezonelike)).find((tz) => tz.offset);
      if (possibleTimezones?.offset) {
        return time
          .toZonedDateTimeISO(possibleTimezones.offset)
          .toPlainDateTime()
          .toString({ smallestUnit: "seconds" });
      }
    }

    return "";
  }
}