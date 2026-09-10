import { useRef, useState } from "react";
import { CalenderHeader } from "./CalendarHeader";
import { getWeekRange, isSameDay } from "../../utils/date";
import { useEvents } from "../../hooks/useEvents";
import { TimeGutter } from "./TimeGutter";
import { DayColumn } from "./DayColumn";
import type {
  CalendarEvent,
  CalendarEventDraft,
  ContextMenuState,
  DialogState,
} from "../../types/event";
import { EventFormDialog } from "../dialog/EventFormDialog";
import { EventDetailDialog } from "../dialog/EventDetailDialog";
import { ContextMenu } from "../menu/contextMenu";

export function CalendarView() {
  const [today] = useState(() => new Date());
  const days = getWeekRange(today);
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [dialogState, setDialogState] = useState<DialogState>({ type: "none" });
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleRequestCreate = (start: Date, end: Date) => {
    setDialogState({ type: "create", start, end });
  };

  const handleEventClick = (event: CalendarEvent) => {
    setDialogState({ type: "detail", event });
  };

  const handleEventContextMenu = (
    event: CalendarEvent,
    x: number,
    y: number,
  ) => {
    setContextMenu({ event, x, y });
  };

  const handleSave = (draft: CalendarEventDraft) => {
    if (dialogState.type === "create") {
      addEvent(draft);
    } else if (dialogState.type === "edit") {
      updateEvent(dialogState.event.id, draft);
    }
    setDialogState({ type: "none" });
  };

  const handleDelete = (event: CalendarEvent) => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      deleteEvent(event.id);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <CalenderHeader
        days={days}
        today={today}
        events={events}
        onEventClick={handleEventClick}
        onEventContextMenu={handleEventContextMenu}
      />
      <div ref={scrollRef} className="flex flex-1 overflow-auto">
        <TimeGutter />
        {days.map((day) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            isToday={isSameDay(day, today)}
            events={events.filter(
              (event) =>
                isSameDay(new Date(event.start), day) && event.isEventForDay,
            )}
            onRequestCreate={handleRequestCreate}
            onEventClick={handleEventClick}
            onEventContextMenu={handleEventContextMenu}
          />
        ))}
      </div>
      {dialogState.type === "create" && (
        <EventFormDialog
          mode="create"
          initial={{
            title: "",
            description: "",
            start: dialogState.start.toISOString(),
            end: dialogState.end.toISOString(),
            isEventForDay: true,
          }}
          onSave={handleSave}
          onClose={() => setDialogState({ type: "none" })}
        />
      )}

      {dialogState.type === "edit" && (
        <EventFormDialog
          mode="edit"
          initial={dialogState.event}
          onSave={handleSave}
          onClose={() => setDialogState({ type: "none" })}
        />
      )}

      {dialogState.type === "detail" && (
        <EventDetailDialog
          event={dialogState.event}
          onClose={() => setDialogState({ type: "none" })}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={[
            {
              label: "Edit",
              onSelect: () =>
                setDialogState({ type: "edit", event: contextMenu.event }),
            },
            {
              label: "Delete",
              danger: true,
              onSelect: () => handleDelete(contextMenu.event),
            },
          ]}
        />
      )}
    </div>
  );
}
