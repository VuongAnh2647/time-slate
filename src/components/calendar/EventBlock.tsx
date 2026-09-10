import { useRef } from "react";
import type { CalendarEvent } from "../../types/event";
import { formatTime, pxToMinutes } from "../../utils/date";
import { DRAG_DATA_TYPE, MINUTES_IN_DAY } from "../../constants";

interface EventBlockProps {
  event: CalendarEvent;
  top: number;
  height: number;
  onClick: (event: CalendarEvent) => void;
  onContextMenu: (event: CalendarEvent, x: number, y: number) => void;
}

export function EventBlock({
  event,
  top,
  height,
  onClick,
  onContextMenu,
}: EventBlockProps) {
  const justDraggedRef = useRef(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const grabOffsetMinutes = pxToMinutes(e.clientY - rect.top);
    e.dataTransfer.setData(
      DRAG_DATA_TYPE,
      JSON.stringify({ eventId: event.id, grabOffsetMinutes }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    justDraggedRef.current = true;
    setTimeout(() => {
      justDraggedRef.current = false;
    }, 0);
  };

  const handleClick = () => {
    if (justDraggedRef.current) return;
    onClick(event);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(event, e.clientX, e.clientY);
  };

  return (
    <div
      draggable
      onMouseDown={(e) => e.stopPropagation()}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={{ top, height, zIndex: Math.abs(MINUTES_IN_DAY - height) }}
      className="absolute right-1 border border-white left-1 px-2 py-1 bg-amber-500 text-white hover:bg-amber-600 active:cursor-grabbing rounded-md cursor-grab"
    >
      <p className="truncate text-xs font-semibold">{event.title}</p>
      <p className="truncate text-[11px] opacity-90">
        {formatTime(new Date(event.start))} &ndash;{" "}
        {formatTime(new Date(event.end))}
      </p>
    </div>
  );
}
