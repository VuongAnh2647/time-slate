import { useState, type FormEvent } from 'react';
import type { CalendarEventDraft } from '../../types/event';
import { isSameDay, toDatetimeLocalValue } from '../../utils/date';
import { Modal } from './Modal';

interface EventFormDialogProps {
  mode: 'create' | 'edit';
  initial: CalendarEventDraft;
  onSave: (draft: CalendarEventDraft) => void;
  onClose: () => void;
}

export function EventFormDialog({ mode, initial, onSave, onClose }: EventFormDialogProps) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [start, setStart] = useState(toDatetimeLocalValue(new Date(initial.start)));
  const [end, setEnd] = useState(toDatetimeLocalValue(new Date(initial.end)));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate.getTime() <= startDate.getTime()) {
      setError('End time must be after start time.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      isEventForDay: isSameDay(startDate, endDate)
    });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {mode === 'create' ? 'New event' : 'Edit event'}
        </h2>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
            placeholder="Event title"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
            placeholder="Optional description"
          />
        </label>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm text-gray-700">
            Start
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="rounded border border-gray-300 px-2 py-2 text-sm focus:border-amber-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm text-gray-700">
            End
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="rounded border border-gray-300 px-2 py-2 text-sm focus:border-amber-500 focus:outline-none"
            />
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
