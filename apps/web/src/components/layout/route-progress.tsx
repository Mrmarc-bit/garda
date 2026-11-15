"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Thin progress bar at the top of the workspace, shown while an internal
 * navigation is in flight.
 *
 * Why this exists: every workspace page fetches its own data after the route
 * commits, so between the click and the first painted result there was no
 * feedback at all — the app looked frozen. A top bar is the convention users
 * already read as "navigating", and it needs no extra dependency.
 *
 * Mechanics, deliberately explicit rather than inferred from a timer:
 *  - START  — a capture-phase click listener on an internal `/app` link.
 *  - TRICKLE — an interval creeps the bar toward 90% while the route loads.
 *  - COMPLETE — the pathname effect fires once the new route has committed, so
 *    the bar reaches 100% only when the destination is actually rendered.
 *
 * An earlier version derived the start from a pathname change and used three
 * chained timeouts; the creep timer outlived the hide timer and left a stale
 * 96% width behind. Start/complete are now separate, cancellable steps.
 *
 * It is `aria-hidden`: the destination's own loading state carries the
 * announcement for assistive technology, so a screen reader is never told about
 * a decorative bar.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  const trickleRef = React.useRef<number | null>(null);
  const hideRef = React.useRef<number | null>(null);
  const watchdogRef = React.useRef<number | null>(null);
  const pendingRef = React.useRef(false);

  const clearWatchdog = React.useCallback(() => {
    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const stopTrickle = React.useCallback(() => {
    if (trickleRef.current !== null) {
      window.clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
  }, []);

  const clearHide = React.useCallback(() => {
    if (hideRef.current !== null) {
      window.clearTimeout(hideRef.current);
      hideRef.current = null;
    }
  }, []);

  const start = React.useCallback(() => {
    clearHide();
    clearWatchdog();
    stopTrickle();
    pendingRef.current = true;
    setVisible(true);
    setProgress(8);
    trickleRef.current = window.setInterval(() => {
      // Asymptotic approach to 90%: fast at first, never reaching the end, so
      // the bar cannot claim completion before the route has committed.
      setProgress((current) => (current >= 90 ? 90 : current + Math.max(1, (90 - current) * 0.18)));
    }, 120);
    // Watchdog. COMPLETE is keyed on the pathname, but a link can change only
    // the query string (`/app/simulator?incident=…` clicked while already on the
    // simulator), and `usePathname()` does not change for that. Without this the
    // bar would sit at 90% forever. Reading search params here would force every
    // workspace page into a Suspense boundary, so a timeout is the cheaper guard.
    watchdogRef.current = window.setTimeout(() => {
      pendingRef.current = false;
      stopTrickle();
      setProgress(100);
      hideRef.current = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 260);
    }, 4000);
  }, [clearHide, clearWatchdog, stopTrickle]);

  const complete = React.useCallback(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    stopTrickle();
    clearWatchdog();
    setProgress(100);
    clearHide();
    hideRef.current = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 260);
  }, [clearHide, clearWatchdog, stopTrickle]);

  // START: one listener for the whole workspace instead of per-link state, so
  // every link (sidebar, cards, "Open Simulator", breadcrumbs) is covered.
  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor) return;
      if (anchor.getAttribute("target") === "_blank") return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/app")) return;
      // Same-URL clicks do not navigate, so they must not start the bar.
      if (href === `${window.location.pathname}${window.location.search}`) return;
      start();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [start]);

  // COMPLETE: the route has committed.
  React.useEffect(() => {
    complete();
  }, [pathname, complete]);

  React.useEffect(
    () => () => {
      stopTrickle();
      clearHide();
      clearWatchdog();
    },
    [stopTrickle, clearHide, clearWatchdog]
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        className="h-full bg-[#FF6B35] shadow-[0_0_10px_rgba(255,107,53,0.75)] transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
