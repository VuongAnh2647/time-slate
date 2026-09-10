import { useRef, type DragEvent } from "react";
import {
  DRAG_DATA_TYPE,
  HOURS_IN_DAY,
  MIN_EVENT_MINUTES,
  MINUTES_IN_DAY,
} from "../../constants";
import type { CalendarEvent } from "../../types/event";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";
import {
  clamp,
  isSameDay,
  minutesFromMidnight,
  minutesToPx,
  pxToMinutes,
  snapMinutes,
} from "../../utils/date";
import { EventBlock } from "./EventBlock";
import { useEvents } from "../../hooks/useEvents";
import { useDragCreate } from "../../hooks/useDragCreate";

interface DayColumnProps {
  day: Date;
  isToday: boolean;
  events: CalendarEvent[];
  onRequestCreate: (start: Date, end: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventContextMenu: (event: CalendarEvent, x: number, y: number) => void;
}

export function DayColumn({
  day,
  isToday,
  events,
  onRequestCreate,
  onEventClick,
  onEventContextMenu,
}: DayColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { events: allEvents, updateEvent } = useEvents();
  const { preview, handleMouseDown } = useDragCreate(
    containerRef,
    (startMinutes, endMinutes) => {
      const start = new Date(day);
      start.setHours(0, startMinutes, 0, 0);
      const end = new Date(day);
      end.setHours(0, endMinutes, 0, 0);
      onRequestCreate(start, end);
    },
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData(DRAG_DATA_TYPE);
    if (!raw) return;

    const { eventId, grabOffsetMinutes } = JSON.parse(raw) as {
      eventId: string;
      grabOffsetMinutes: number;
    };
    const draggedEvent = allEvents.find((event) => event.id === eventId);
    if (!draggedEvent) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const dropMinutes = pxToMinutes(e.clientY - (rect?.top ?? 0));
    const durationMinutes =
      (new Date(draggedEvent.end).getTime() -
        new Date(draggedEvent.start).getTime()) /
      60_000;

    const newStartMinutes = clamp(
      snapMinutes(dropMinutes - grabOffsetMinutes, MIN_EVENT_MINUTES),
      0,
      MINUTES_IN_DAY - durationMinutes,
    );

    const newStart = new Date(day);
    newStart.setHours(0, newStartMinutes, 0, 0);
    const newEnd = new Date(newStart.getTime() + durationMinutes * 60_000);

    updateEvent(eventId, {
      title: draggedEvent.title,
      description: draggedEvent.description,
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
      isEventForDay: isSameDay(newStart, newEnd)
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 border-l border-gray-100 first:border-l-0"
      onMouseDown={handleMouseDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {Array.from({ length: HOURS_IN_DAY }, (_, hour) => (
        <div key={hour} className="border-b border-gray-100 h-15" />
      ))}

      {isToday && <CurrentTimeIndicator />}

      {preview && (
        <div
          className="pointer-events-none absolute right-1 left-1 z-30 rounded-md border-2 border-dashed border-amber-400 bg-amber-200/50"
          style={{ top: preview.top, height: preview.height }}
        />
      )}

      {events.map((event) => {
        const startMinutes = minutesFromMidnight(new Date(event.start));
        const durationMinutes = Math.max(
          (new Date(event.end).getTime() - new Date(event.start).getTime()) /
            60_000,
          15,
        );
        return (
          <EventBlock
            key={event.id}
            event={event}
            top={startMinutes}
            height={minutesToPx(durationMinutes)}
            onClick={onEventClick}
            onContextMenu={onEventContextMenu}
          />
        );
      })}
    </div>
  );
}
