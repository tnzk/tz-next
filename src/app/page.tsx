"use client";

import { Temporal } from "@js-temporal/polyfill";
import TimezoneView from "./TimezoneView";
import WorldMap from "./WorldMap";
import * as CT from "countries-and-timezones";


export default function Home() {
  const localtimeZone = Temporal.Now.timeZoneId();
  const quickStartPath = `/${(encodeURIComponent(localtimeZone))}/now`;

  const handleOnClick = (cc: CT.Country) => {
    const path = "/" + encodeURIComponent(cc.timezones[0]);
    window.location.href = path;
  };


  return (
    <main className="min-h-screen bg-blue-500">
      <div className="font-serif w-full text-blue-950 text-center pt-32 px-4 text-5xl">
        Does this time work for you?
      </div>
      <div className="max-w-lg text-xl font-serif md:max-w-2xl mx-auto text-left pt-8 pb-4 text-blue-100">
        <div>
          Pick two timezones and a point in time so you can arrange a call,
          session or anything easily with your friends.
        </div>
        <div className="mt-8">
          You can pick a timezone either by clicking on the map or type timezone
          names e.g. <code>CET</code>, <code>Asia/Tokyo</code> or{" "}
          <code>-08:00</code>.
        </div>
        <div className="mt-8">
          Start by clicking on the map below or &nbsp;
          <a href={quickStartPath} className="underline text-blue-900 hover:text-blue-700">
            your local timezone: {localtimeZone}
          </a>
        </div>
      </div>

      <div className="relative flex items-center my-24">
        <WorldMap offsets={[]} onClick={handleOnClick} />
      </div>

      <footer className="max-w-lg md:max-w-2xl mx-auto text-center pt-8 pb-4 text-blue-900">
        Copyright &copy; {new Date().getFullYear()} Does This Work for You All
        Rights Reserved
      </footer>
    </main>
  );
}
