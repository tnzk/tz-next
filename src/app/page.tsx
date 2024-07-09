"use client";

import TimezoneView from "./TimezoneView";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleOnChange = (tz1: string | undefined) => {
    if (tz1) {
      router.push(`/${encodeURIComponent(tz1)}`);
    }
  };

  return (
    <main className="min-h-screen bg-blue-500">
      <div className="relative flex items-center">
        <TimezoneView timelike={"now"} onChange={handleOnChange} />
      </div>
    </main>
  );
}
