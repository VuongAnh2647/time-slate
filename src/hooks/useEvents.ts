import { useContext } from "react";
import {
  EventsContext,
  type EventsContextValue,
} from "../context/eventsContext";

export function useEvents(): EventsContextValue {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}
