import { Temporal } from "@js-temporal/polyfill";
import { ChangeEventHandler } from "react";

type Props = {
  tz: string;
  timezones: string[];
  time: Temporal.Instant;
  onChangeTime: (plainDateTime: string, timezone: string) => void;
  onChangeTimezone: (timezone: string) => void;
  onReset: () => void;
};
export default function TimezoneCard({
  tz,
  timezones,
  time,
  onChangeTime,
  onChangeTimezone,
  onReset,
}: Props) {
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChangeTime(event.target.value, tz);
  };

  const localtime = (() => {
    try {
      return time
        .toZonedDateTimeISO(tz)
        .toPlainDateTime()
        .toString({ smallestUnit: "seconds" });
    } catch {
      return "";
    }
  })();

  return (
    <div className="bg-white rounded-xl border-blue-600 border-2 p-6 mx-4 sm:mx-auto backdrop-blur-2xl shadow-lg flex-0 sm:w-2/3 xl:w-1/2 text-center text-blue-950">
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
          {tz === "" && <div className="text-2xl">Choose host timezone</div>}
        </div>
        <div className="shrink">
          <svg
            onClick={onReset}
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
        </div>
      </div>
    </div>
  );
}