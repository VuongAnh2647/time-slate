import { HOURS_IN_DAY } from "../../constants";
import { formatHourLabel } from "../../utils/date";

export function TimeGutter() {
  return (
    <div className="w-16 shrink-0">
      {Array.from({ length: HOURS_IN_DAY }, (_, hour) => (
        <div className="h-15 -top-2.5 text-[11px] pr-2 relative text-right text-gray-400">{hour === 0 ? "" : formatHourLabel(hour)}</div>
      ))}
    </div>
  );
}
