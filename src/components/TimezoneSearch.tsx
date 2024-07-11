import { ChangeEventHandler, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import {
  ResolvedTimezoneAbbrev,
  attemptLocalizeTime,
  lookupTimezoneAbbrev,
} from "@/lib/timezoneHelper";

type Props = {
  onClickTimezoneSuggestion: (timezone: string) => void;
};
export const TimezoneSearch = ({ onClickTimezoneSuggestion }: Props) => {
  const [suggestions, setSuggestions] = useState<ResolvedTimezoneAbbrev[]>([]);

  const onValidate: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const timezonelike = event.target.value;
    const recognizedByTemporal =
      (await attemptLocalizeTime(Temporal.Now.instant(), timezonelike)) !== "";
    const temporalSuggestion = recognizedByTemporal
      ? [{ name: timezonelike, offset: undefined }]
      : [];
    const resolved = await lookupTimezoneAbbrev(timezonelike);
    setSuggestions([...temporalSuggestion, ...resolved]);
  };

  return (
    <>
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
        {suggestions.map((tz) => (
          <li key={tz.name} className="w-full">
            <a
              className="hover:bg-gray-200 cursor-pointer px-2 py-1 block rounded-md"
              onClick={() => onClickTimezoneSuggestion(tz.offset ?? tz.name)}
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
    </>
  );
};
