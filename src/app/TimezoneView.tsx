"use client";

import { useEffect, useState } from "react";
import { Temporal, Intl, toTemporalInstant } from "@js-temporal/polyfill";
// @ts-ignore
Date.prototype.toTemporalInstant = toTemporalInstant;
import * as CT from "countries-and-timezones";
import WorldMap from "./WorldMap";
import TimezoneCard from "./TimezoneCard";

function getDefaultTime(timelike: string) {
  const keywordTimeMap: Record<string, Temporal.Instant> = {
    now: Temporal.Now.zonedDateTimeISO("UTC").toInstant(),
    // https://tc39.es/proposal-temporal/docs/duration.html
    yesterday: Temporal.Now.zonedDateTimeISO("UTC")
      .subtract(Temporal.Duration.from({ days: 1 }))
      .toInstant(),
  };
  if (keywordTimeMap[timelike]) return keywordTimeMap[timelike];

  if (/^\d+$/.test(timelike)) {
    return Temporal.Instant.fromEpochSeconds(parseInt(timelike));
  }

  // https://tc39.es/proposal-temporal/docs/instant.html
  return Temporal.Now.zonedDateTimeISO("UTC").toInstant();
}

/**
 * TimezoneView
 *
 * @prop tz1 - anything Temporal.TimeZone can construe.
 *             cf. https://tc39.es/proposal-temporal/docs/timezone.html#constructor
 * @prop tz2
 * @prop timelike - represents the time. It can take a form of one of the special keywords
 *                  recognized by `getDefaultTime` above e.g. now, yesterday and so on or
 *                  an epoch time. Defaults to "now".
 * @onChange
 */
type Props = {
  tz1?: string;
  tz2?: string;
  timelike: string;
  onChange: (
    tz1: string | undefined,
    epochTime: number | undefined,
    tz2: string | undefined
  ) => void;
};
export default function TimezoneView({
  tz1,
  tz2,
  timelike,
  onChange,
}: Props) {
  const defaultTz1 = Temporal.Now.timeZoneId();

  const [time, setTime] = useState(getDefaultTime(timelike));
  // https://tc39.es/proposal-temporal/docs/timezone.html
  const [timezone1, setTimezone1] = useState<string>(tz1 ?? defaultTz1);
  const [timezone2, setTimezone2] = useState<string>(tz2 ?? "");
  const [timezoneOptions, setTimezoneOptions] = useState<string[]>([]);
  const [timezoneOptions2, setTimezoneOptions2] = useState<string[]>([]);
  const [offsets, setOffsets] = useState<string[]>([]);

  // TODO: Popup for a country + free texts in timezone panels
  const handleOnClick = (cc: CT.Country) => {
    if (timezone1) {
      if (!timezone2) {
        setTimezoneOptions2(cc.timezones);
        setTimezone2(cc.timezones[0]);
      }
    } else {
      setTimezoneOptions(cc.timezones);
      setTimezone1(cc.timezones[0]);
    }
  };

  const handleOnChange = (plainDateTime: string, timezone: string) => {
    const zoned =
      Temporal.PlainDateTime.from(plainDateTime).toZonedDateTime(timezone);
    const zonedTime = zoned.toInstant();
    setTime(zonedTime);
  };

  useEffect(() => {
    try {
      const offsets = [
        Temporal.Now.zonedDateTimeISO(timezone1).offset,
        Temporal.Now.zonedDateTimeISO(timezone2).offset,
      ];
      setOffsets(offsets);
    } catch {
      console.error("Invalid timezone identifier(s):", timezone1, timezone2);
    }
  }, [time, timezone1, timezone2]);

  useEffect(() => {
    onChange(timezone1, time.epochSeconds, timezone2);
  }, [time, timezone1, timezone2, onChange]);

  useEffect(() => {
    const id = setInterval(() => {
      //setTime(Temporal.Now.instant());
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-24 font-serif">
      <div className="max-w-3xl mx-auto">
        <div className="md:flex justify-center md:space-x-8 space-y-4 md:space-y-0">
          <TimezoneCard
            tz={timezone1 ?? ""}
            timezones={timezoneOptions}
            time={time}
            onChangeTime={handleOnChange}
            onChangeTimezone={(tz) => setTimezone1(tz)}
            onReset={() => setTimezone1("")}
          />

          {timezone2 && (
            <TimezoneCard
              tz={timezone2 ?? ""}
              timezones={timezoneOptions2}
              time={time}
              onChangeTime={handleOnChange}
              onChangeTimezone={(tz) => setTimezone2(tz)}
              onReset={() => setTimezone2("")}
            />
          )}
        </div>
      </div>

      <div className="my-16">
        <WorldMap offsets={offsets} onClick={handleOnClick} />
      </div>
    </div>
  );
}
