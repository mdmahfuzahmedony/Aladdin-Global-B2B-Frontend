"use client";
import { useCallback, useEffect, useRef } from "react";

/**
 * Adds auto-sliding behaviour to a scrollable container ref.
 * @param intervalMs - milliseconds between each auto-scroll (default 2800)
 * @param scrollFraction - fraction of container width to scroll each step (default 0.6)
 */
export function useAutoSlider(
  ref: React.RefObject<HTMLDivElement | null>,
  intervalMs = 2800,
  scrollFraction = 0.6,
) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const start = useCallback(() => {
    stop();
    timerRef.current = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: Math.max(el.clientWidth * scrollFraction, 100), behavior: "smooth" });
      }
    }, intervalMs);
  }, [ref, intervalMs, scrollFraction, stop]);

  useEffect(() => {
    // Short delay so DOM is ready
    const t = setTimeout(start, 600);
    return () => { clearTimeout(t); stop(); };
  }, [start, stop]);

  return { start, stop };
}
