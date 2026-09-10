import type { CalendarEvent } from "../../types/event";
import {
  dayDiff,
  formatDayNumber,
  formatWeekday,
  getGmtOffsetLabel,
  isSameDay,
  startOfDay,
} from "../../utils/date";
import { MultiDayEventBar } from "./MultiDayEventBar";

interface CalendarHeaderProps {
  days: Date[];
  today: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventContextMenu: (event: CalendarEvent, x: number, y: number) => void;
}
export function CalenderHeader({
  days,
  today,
  events,
  onEventClick,
  onEventContextMenu,
}: CalendarHeaderProps) {
  const firstDay = days[0];
  const lastDay = days[days.length - 1];

  const multiDayEvents = events.filter(
    (event) =>
      !event.isEventForDay &&
      startOfDay(new Date(event.end)).getTime() >= firstDay.getTime() &&
      startOfDay(new Date(event.start)).getTime() <= lastDay.getTime(),
  );

  return (
    <div className="flex border-b border-gray-200 mr-3.75 ">
      <div
        className="text-gray-400 flex shrink-0 items-center justify-center text-[11px] w-16"
      >
        {getGmtOffsetLabel(today)}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          {days.map((day) => {
            const isToday = isSameDay(day, today);
            return (
              <div
                key={day.toISOString()}
                className="flex flex-col flex-1 items-center justify-center border-l border-gray-100 font-medium py-1"
              >
                <span
                  className={`text-center text-[11px] ${isToday ? "text-blue-600" : "text-gray-400"}`}
                >
                  {formatWeekday(day)}
                </span>
                <span
                  className={`flex size-7 items-center justify-center text-lg rounded-full ${isToday ? "bg-blue-600 text-white" : "text-gray-800"}`}
                >
                  {formatDayNumber(day)}
                </span>
              </div>
            );
          })}
        </div>
        {multiDayEvents.map((event) => {
          const eventStartDay = startOfDay(new Date(event.start));
          const eventEndDay = startOfDay(new Date(event.end));
          const overflowStart = eventStartDay.getTime() < firstDay.getTime();
          const overflowEnd = eventEndDay.getTime() > lastDay.getTime();

          const startIndex = overflowStart
            ? 1
            : dayDiff(eventStartDay, firstDay) + 1;
          const endIndex = overflowEnd
            ? days.length + 1
            : dayDiff(eventEndDay, firstDay) + 2;

          return (
            <div
              key={event.id}
              className="grid pb-1"
              style={{
                gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
              }}
            >
              <MultiDayEventBar
                event={event}
                gridColumnStart={startIndex}
                gridColumnEnd={endIndex}
                overflowStart={overflowStart}
                overflowEnd={overflowEnd}
                onClick={onEventClick}
                onContextMenu={onEventContextMenu}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
