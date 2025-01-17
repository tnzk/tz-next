"use client";

import { useState } from "react";
import TimezoneView from "@/components/TimezoneView";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

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

type Props = {
  params: {
    tz1: string;
    timeAndTz2: string[];
  };
};
export default function Home({ params }: Props) {
  const { tz1 } = params;
  const [timelike, tz2] = params.timeAndTz2 ?? [];

  const [url, setUrl] = useState(constructPath(tz1, parseInt(timelike), tz2));
  const [copied, setCopied] = useState(false);

  const handleOnChange = (
    tz1: string | undefined,
    epochTime: number | undefined,
    tz2: string | undefined
  ) => {
    const path = constructPath(tz1, epochTime, tz2);
    setUrl(window.location.origin + path);
    window.history.replaceState(null, "", path);
  };

  const handleOnClick = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-blue-500">
      <Header withBackButton />
      <div className="relative flex place-items-center justify-center">
        <TimezoneView
          timelike={timelike}
          tz1={tz1 ? decodeURIComponent(tz1) : undefined}
          tz2={tz2 ? decodeURIComponent(tz2) : ""}
          onChange={handleOnChange}
        />
      </div>
      <div className="max-w-lg md:max-w-2xl mx-auto px-2">
        <label className="bg-white border-2 shadow-md border-blue-600 rounded-xl p-4 flex items-center gap-2 justify-between">
          {copied && (
            <div className="p-2 bg-lime-100 border border-lime-300 text-lime-800 rounded-lg">
              Copied!
            </div>
          )}
          {!copied && (
            <input
              type="text"
              className="grow focus:outline-none text-lg text-gray-700 p-2 text-ellipsis"
              readOnly
              value={url}
            />
          )}
          <a href="#" onClick={handleOnClick}>
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
          </a>
        </label>
      </div>
      <Footer />
    </main>
  );
}
