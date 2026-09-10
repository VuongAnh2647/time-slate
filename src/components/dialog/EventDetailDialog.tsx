import type { CalendarEvent } from "../../types/event";
import { formatDateTimeLabel } from "../../utils/date";
import { Modal } from "./Modal";

interface EventDetailDialogProps {
  event: CalendarEvent;
  onClose: () => void;
}

export function EventDetailDialog({ event, onClose }: EventDetailDialogProps) {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4 p-5">
        <h2 className="text-lg font-semibold text-gray-900">{event.title}</h2>

        <p className="text-sm text-gray-500">
          {formatDateTimeLabel(new Date(event.start))} &ndash;{" "}
          {formatDateTimeLabel(new Date(event.end))}
        </p>

        {event.description ? (
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {event.description}
          </p>
        ) : (
          <p className="text-sm italic text-gray-400">No description.</p>
        )}

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
