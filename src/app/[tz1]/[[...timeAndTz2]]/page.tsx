"use client";

import TimezoneView from "@/app/TimezoneView";
import { useEffect, useState } from "react";

const constructPath = (
  tz1: string | undefined,
  epochTime: number | undefined,
  tz2: string | undefined
): string => {
  if (tz1) {
    const slugs = [encodeURIComponent(tz1)];
    if (epochTime) {
      slugs.push(epochTime.toString());
      if (tz2) {
        slugs.push(encodeURIComponent(tz2));
      }
    }
    return "/" + slugs.join("/");
  }
  return "";
};

export default function Home({
  params,
}: {
  params: {
    tz1: string;
    timeAndTz2: string[];
  };
}) {
  const { tz1 } = params;
  const [timelike, tz2] = params.timeAndTz2 ?? [];

  const [url, setUrl] = useState(constructPath(tz1, parseInt(timelike), tz2));

  const handleOnChange = (
    tz1: string | undefined,
    epochTime: number | undefined,
    tz2: string | undefined
  ) => {
    const path = constructPath(tz1, epochTime, tz2);
    setUrl(window.location.origin + path);
    window.history.replaceState(null, "", path);
  };

  return (
    <main className="min-h-screen bg-blue-500">
      <div className="p-4">
        <svg
          onClick={() => (window.location.href = "/")}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.0}
          stroke="currentColor"
          className="size-6 text-blue-950 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </div>
      <div className="font-serif w-full text-blue-950 text-center pt-6 px-4 text-5xl">
        Does this time work for you?
      </div>
      <div className="relative flex place-items-center">
        <TimezoneView
          timelike={timelike}
          tz1={tz1 ? decodeURIComponent(tz1) : undefined}
          tz2={tz2 ? decodeURIComponent(tz2) : undefined}
          onChange={handleOnChange}
        />
      </div>
      <div className="max-w-lg md:max-w-2xl mx-auto">
        <label className="bg-white border-2 shadow-md border-blue-600 rounded-xl p-4 flex items-center gap-2">
          <input
            type="text"
            className="grow focus:outline-none text-lg text-gray-700"
            readOnly
            value={url}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-blue-900 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
            />
          </svg>
        </label>
      </div>
      <footer className="max-w-lg md:max-w-2xl mx-auto text-center pt-8 pb-4 text-blue-900">
        Copyright &copy; {new Date().getFullYear()} Does This Work for You All
        Rights Reserved
      </footer>
    </main>
  );
}
