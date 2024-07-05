"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { Temporal, Intl, toTemporalInstant } from "@js-temporal/polyfill";
// @ts-ignore
Date.prototype.toTemporalInstant = toTemporalInstant;
import * as CT from "countries-and-timezones";
import WorldMap from "./Map";

export default function TimezoneView() {
  const [time, setTime] = useState(Temporal.Now.instant);
  const [utcTime, setUtcTime] = useState(
    time.toZonedDateTimeISO("UTC").toLocaleString()
  );
  const [timezone1, setTimezone1] = useState<string>();
  const [timezone2, setTimezone2] = useState<string>();
  const [timeInZone1, setTimeInZone1] = useState<string>("");
  const [timeInZone2, setTimeInZone2] = useState<string>("");

  const handleOnClick = (cc: CT.Country) => {
    console.log(CT.getTimezonesForCountry(cc.id));
    if (timezone1) {
      if (!timezone2) {
        setTimezone2(cc.timezones[0]);
      }
    } else {
      setTimezone1(cc.timezones[0]);
    }
  };

  useEffect(() => {
    if (timezone1) {
      setTimeInZone1(time.toZonedDateTimeISO(timezone1).toLocaleString());
    }
    if (timezone2) {
      setTimeInZone2(time.toZonedDateTimeISO(timezone2).toLocaleString());
    }
  }, [time, timezone1, timezone2]);

  useEffect(() => {
    setUtcTime(time.toZonedDateTimeISO("UTC").toLocaleString());
  }, [time]);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(Temporal.Now.instant);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-24">
      <div className="max-w-3xl mx-auto">
        <div suppressHydrationWarning>UTC: {utcTime}</div>
        <div className="flex justify-center space-x-2">
          <div className="bg-zinc-200/30 rounded-md p-6 backdrop-blur-2xl shadow-md">
            {timezone1}
            <br />
            {timeInZone1}
          </div>
          <div className="bg-zinc-200/30 rounded-md p-6 backdrop-blur-2xl shadow-md">
            {timezone2}
            <br />
            {timeInZone2}
          </div>
        </div>
      </div>

      <WorldMap onClick={handleOnClick} />
    </div>
  );
}
