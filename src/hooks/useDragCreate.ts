import { useRef, useState, type MouseEvent, type RefObject } from "react";
import { clamp, minutesToPx, pxToMinutes, snapMinutes } from "../utils/date";
import { MIN_EVENT_MINUTES, MINUTES_IN_DAY } from "../constants";

export interface PreviewRange {
  top: number;
  height: number;
}

export function useDragCreate(
  containerRef: RefObject<HTMLDivElement | null>,
  onCreateRange: (startMinutes: number, endMinutes: number) => void,
) {
  const [preview, setPreview] = useState<PreviewRange | null>(null);
  const dragRef = useRef<{ anchorMinutes: number } | null>(null);

  const minutesFromEvent = (clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const offsetY = clientY - (rect?.top ?? 0);
    return clamp(
      snapMinutes(pxToMinutes(offsetY), MIN_EVENT_MINUTES),
      0,
      MINUTES_IN_DAY,
    );
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const anchorMinutes = minutesFromEvent(e.clientY);
    dragRef.current = { anchorMinutes };
    setPreview({ top: minutesToPx(anchorMinutes), height: 0 });

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      if (!dragRef.current) return;
      const currentMinutes = minutesFromEvent(moveEvent.clientY);
      const start = Math.min(dragRef.current.anchorMinutes, currentMinutes);
      const end = Math.max(dragRef.current.anchorMinutes, currentMinutes);
      setPreview({ top: minutesToPx(start), height: minutesToPx(end - start) });
    };

    const handleMouseUp = (upEvent: globalThis.MouseEvent) => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (!dragRef.current) return;

      const currentMinutes = minutesFromEvent(upEvent.clientY);
      let start = Math.min(dragRef.current.anchorMinutes, currentMinutes);
      let end = Math.max(dragRef.current.anchorMinutes, currentMinutes);
      if (end - start < MIN_EVENT_MINUTES) {
        end = clamp(start + 60, MIN_EVENT_MINUTES, MINUTES_IN_DAY);
        start = end - 60 >= 0 ? end - 60 : 0;
      }

      dragRef.current = null;
      setPreview(null);
      onCreateRange(start, end);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return { preview, handleMouseDown };
}
