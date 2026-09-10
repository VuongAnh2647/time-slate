import { useEffect, useState } from "react";
import { minutesFromMidnight, minutesToPx } from "../../utils/date";

export function CurrentTimeIndicator() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const top = minutesToPx(minutesFromMidnight(now));

  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-10"
      style={{ top }}
    >
      <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-red-500" />
      <div className="h-px bg-red-500" />
    </div>
  );
}
