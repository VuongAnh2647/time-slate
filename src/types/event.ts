export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  isEventForDay: boolean
}

export type CalendarEventDraft = Omit<CalendarEvent, "id">;

export type DialogState =
  | { type: "none" }
  | { type: "create"; start: Date; end: Date }
  | { type: "edit"; event: CalendarEvent }
  | { type: "detail"; event: CalendarEvent };

export interface ContextMenuState {
  event: CalendarEvent;
  x: number;
  y: number;
}
