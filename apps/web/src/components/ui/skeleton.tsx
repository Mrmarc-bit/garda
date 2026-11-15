import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Shimmer placeholder used while a view's data is in flight.
 *
 * It is decorative only: the shimmer is `aria-hidden`, and the container that
 * owns it is responsible for announcing the loading state (`role="status"` with
 * a visually hidden label) so screen readers are not read a pile of empty boxes.
 *
 * The sweep is a CSS keyframe (`.skeleton-shimmer` in `globals.css`) rather than
 * an opacity pulse, and the global `prefers-reduced-motion` block freezes it.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton-shimmer rounded-md", className)}
      {...props}
    />
  );
}

/** A paragraph-shaped block of placeholder lines. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

/** Placeholder for one card: a title line, a couple of body lines and a footer. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#2E2E2E] bg-[#1C1C1C] p-4",
        className
      )}
    >
      <Skeleton className="h-4 w-1/3" />
      <SkeletonText className="mt-3" lines={2} />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

/**
 * Standard workspace loading state: a page title block plus the given body.
 *
 * `label` is announced to assistive technology and never rendered visibly, so
 * the operator sees a shaped placeholder instead of a spinner and a sentence.
 */
export function SkeletonPage({
  label,
  children,
  className,
}: {
  label: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p role="status" aria-live="polite" className="sr-only">
        {label}
      </p>
      <div aria-hidden="true">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-3 h-8 w-72 max-w-full" />
        <Skeleton className="mt-3 h-3 w-full max-w-xl" />
        <div className="mt-6">{children ?? <SkeletonCard />}</div>
      </div>
    </div>
  );
}

/** Grid of card placeholders, for list pages. */
export function SkeletonCardGrid({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

/** Placeholder rows for a table or ledger list. */
export function SkeletonRows({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border border-[#2E2E2E] bg-[#1C1C1C] p-3"
        >
          <Skeleton className="h-3 w-24 shrink-0" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="hidden h-3 w-20 shrink-0 sm:block" />
          <Skeleton className="h-5 w-16 shrink-0 rounded" />
        </div>
      ))}
    </div>
  );
}
