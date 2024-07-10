import abbrevsJson from "@/app/TzAbbrevs.json"
// cf. https://www.timetemperature.com/abbreviations/world_time_zone_abbreviations.shtml
//     https://www.timeanddate.com/time/zones/
//     https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations

export async function GET(
  request: Request,
  { params }: { params: { abbrev: string } }
) {
  const abbrevs = abbrevsJson as Record<string, { name: string, offset: string }[]>;
  const key = params.abbrev ?? "";
  const possibleTimezones = abbrevs[key.toUpperCase()];

  return Response.json(possibleTimezones ?? [])
}