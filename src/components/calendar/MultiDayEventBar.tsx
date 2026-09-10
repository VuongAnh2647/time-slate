import type { MouseEvent } from 'react';
import type { CalendarEvent } from '../../types/event';

interface MultiDayEventBarProps {
  event: CalendarEvent;
  gridColumnStart: number;
  gridColumnEnd: number;
  overflowStart: boolean;
  overflowEnd: boolean;
  onClick: (event: CalendarEvent) => void;
  onContextMenu: (event: CalendarEvent, x: number, y: number) => void;
}

const NOTCH = '6px';

function buildClipPath(overflowStart: boolean, overflowEnd: boolean): string | undefined {
  if (!overflowStart && !overflowEnd) return undefined;

  const leftX = overflowStart ? NOTCH : '0';
  const rightX = overflowEnd ? `calc(100% - ${NOTCH})` : '100%';

  const points = [`${leftX} 0`, `${rightX} 0`];
  if (overflowEnd) points.push('100% 50%');
  points.push(`${rightX} 100%`, `${leftX} 100%`);
  if (overflowStart) points.push('0 50%');

  return `polygon(${points.join(', ')})`;
}

export function MultiDayEventBar({
  event,
  gridColumnStart,
  gridColumnEnd,
  overflowStart,
  overflowEnd,
  onClick,
  onContextMenu,
}: MultiDayEventBarProps) {
  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onContextMenu(event, e.clientX, e.clientY);
  };

  return (
    <div
      onClick={() => onClick(event)}
      onContextMenu={handleContextMenu}
      style={{
        gridColumn: `${gridColumnStart} / ${gridColumnEnd}`,
        clipPath: buildClipPath(overflowStart, overflowEnd),
      }}
      className={`h-5 cursor-pointer truncate bg-amber-500 text-[11px] leading-5 font-semibold text-white hover:bg-amber-600 ${
        overflowStart ? 'pl-3' : 'ml-1 rounded-l-md pl-2'
      } ${overflowEnd ? 'pr-3' : 'mr-1 rounded-r-md pr-2'}`}
    >
      {event.title}
    </div>
  );
}
