"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Thin progress bar at the top of the workspace, shown while a route change is
 * in flight.
 *
 * Why this exists: the workspace renders client components that fetch their own
 * data after navigation, so between the click and the first paint there was no
 * feedback at all — the page simply looked frozen for a moment. A top bar is the
 * convention users already read as "navigating", and it costs no dependency.
 *
 * Mechanics: on a pathname/query change the bar animates to 90% over 600ms and
 * completes to 100% on the next frame after the new route has committed, then
 * fades out. It is `aria-hidden` — the destination's own loading state carries
 * the announcement for assistive technology, so a screen reader is not told
 * about a decorative bar.
 */
export function RouteProgress() {
  // Pathname only, on purpose: `useSearchParams()` in a layout would force every
  // workspace page into a Suspense boundary just to render a decorative bar.
  const pathname = usePathname();

  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const firstRender = React.useRef(true);
  const timers = React.useRef<number[]>([]);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  React.useEffect(() => {
    // Do not flash the bar on the initial mount of the workspace.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    clearTimers();
    setVisible(true);
    setProgress(0);

    // Advance to 90% quickly, then creep — it must never claim to be finished
    // before the new route has actually rendered.
    const toNinety = window.setTimeout(() => setProgress(90), 20);
    const creep = window.setTimeout(() => setProgress(96), 900);
    const finish = window.setTimeout(() => {
      setProgress(100);
      const hide = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 240);
      timers.current.push(hide);
    }, 260);
    timers.current.push(toNinety, creep, finish);

    return clearTimers;
  }, [pathname, clearTimers]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
    >
      <div
        className="h-full bg-[#FF6B35] shadow-[0_0_10px_rgba(255,107,53,0.8)] transition-[width,opacity] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
