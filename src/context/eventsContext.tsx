import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CalendarEvent, CalendarEventDraft } from "../types/event";
import { loadEvents, saveEvents } from "../utils/storage";

export interface EventsContextValue {
  events: CalendarEvent[];
  addEvent: (draftEvent: CalendarEventDraft) => void;
  updateEvent: (id: string, draftEvent: CalendarEventDraft) => void;
  deleteEvent: (id: string) => void;
}

export const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEvents());
  useEffect(() => {
    saveEvents(events);
  }, [events]);
  const value = useMemo<EventsContextValue>(
    () => ({
      events,
      addEvent: (draftEvent: CalendarEventDraft) => {
        setEvents((prev) => [
          ...prev,
          { ...draftEvent, id: crypto.randomUUID() },
        ]);
      },
      updateEvent: (id: string, draftEvent: CalendarEventDraft) => {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === id ? { ...draftEvent, id } : event,
          ),
        );
      },
      deleteEvent: (id: string) => {
        setEvents((prev) => prev.filter((event) => event.id !== id));
      },
    }),
    [events],
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}
