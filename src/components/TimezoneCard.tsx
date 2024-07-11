import { Temporal } from "@js-temporal/polyfill";
import { ChangeEventHandler, useState } from "react";

// offset is undefined when the name is recognized by Temporal
type ResolvedTimezoneAbbrev = { name: string; offset: string | undefined };
async function lookupTimezoneAbbrev(
  abbrev: string
): Promise<ResolvedTimezoneAbbrev[]> {
  if (abbrev === "") return [];
  const res = await fetch(`/tz/abbrev/${encodeURIComponent(abbrev)}`);
  if (res.status === 200) {
    return res.json();
  }
  return [];
}

async function attemptLocalizeTime(
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
      const res = await fetch(`/tz/abbrev/${encodeURIComponent(timezonelike)}`);
      if (res.status === 200) {
        const possibleTimezones = await res.json();
        if (possibleTimezones[0]) {
          return time
            .toZonedDateTimeISO(possibleTimezones[0].offset)
            .toPlainDateTime()
            .toString({ smallestUnit: "seconds" });
        }
      }
    }

    return "";
  }
}

type Props = {
  tz: string;
  timezones: string[];
  time: Temporal.Instant;
  onChangeTime: (plainDateTime: string, timezone: string) => void;
  onChangeTimezone: (timezone: string) => void;
  onReset: () => void;
  placeholder: string;
};
export default function TimezoneCard({
  tz,
  timezones,
  time,
  onChangeTime,
  onChangeTimezone,
  onReset,
  placeholder,
}: Props) {
  const [localtime, setLocaltime] = useState("");
  const [possibleTimezones, setPossibleTimezones] = useState<
    ResolvedTimezoneAbbrev[]
  >([]);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChangeTime(event.target.value, tz);
  };

  const onValidate: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const timezonelike = event.target.value;
    const recognizedByTemporal =
      (await attemptLocalizeTime(time, timezonelike)) !== "";
    const temporalSuggestion = recognizedByTemporal
      ? [{ name: timezonelike, offset: undefined }]
      : [];
    const resolved = await lookupTimezoneAbbrev(timezonelike);
    setPossibleTimezones([...temporalSuggestion, ...resolved]);
  };

  const onClickTimezoneSuggestion = (timezonelike: string) => {
    onChangeTimezone(timezonelike);
  };

  attemptLocalizeTime(time, tz).then((s) => setLocaltime(s));

  return (
    <div className="flex items-center justify-center bg-white rounded-xl border-blue-600 border-2 p-6 mx-4 sm:mx-auto backdrop-blur-2xl shadow-lg flex-0 sm:w-2/3 xl:w-1/2 text-center text-blue-950">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {tz && (
            <>
              <div className="text-2xl mb-3">{tz}</div>
              <div className="text-2xl">
                <input
                  className="focus:outline-none"
                  type="datetime-local"
                  value={localtime}
                  onChange={handleOnChange}
                />
              </div>
              {timezones.length > 0 && (
                <div className="md:max-w-2xl mx-auto mt-8">
                  <label
                    htmlFor="timezones"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Other timezones in this country
                  </label>

                  <select
                    name="timezones"
                    id="timezones"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={(event) => onChangeTimezone(event.target.value)}
                  >
                    {timezones.map((s: string) => (
                      <option key={s} value={s} selected={s === tz}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
          {tz === "" && (
            <div>
              <div className="text-2xl">{placeholder}</div>
              <div className="text-left mt-3">
                <label htmlFor="timezone-search">Or type: </label>
                <input
                  name="timezone-search"
                  type="text"
                  className="w-full focus:outline-none text-lg text-gray-700 rounded-lg px-3 py-1 my-1 border border-gray-200"
                  onChange={onValidate}
                />
              </div>
              <ul className="text-left">
                {possibleTimezones.map((tz) => (
                  <li key={tz.name} className="w-full">
                    <a
                      className="hover:bg-gray-200 cursor-pointer px-2 py-1 block rounded-md"
                      onClick={() =>
                        onClickTimezoneSuggestion(tz.offset ?? tz.name)
                      }
                    >
                      {!tz.offset && <>{tz.name}</>}
                      {tz.offset && (
                        <>
                          {tz.name}{" "}
                          <span className="text-sm text-gray-700">
                            as UTC{tz.offset}
                          </span>
                        </>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="shrink">
          {tz && (
            <a onClick={onReset} href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
