import * as React from "react";
import {
  Skeleton,
  SkeletonCardGrid,
  SkeletonPage,
  SkeletonRows,
} from "@/components/ui/skeleton";

/**
 * Route-level fallback for the authenticated workspace, rendered by Next.js
 * while a server segment streams in. It mirrors the shape of a workspace page
 * (title block, KPI strip, content) so the transition reads as the page filling
 * in rather than a spinner replacing it.
 */
export default function AppLoading() {
  return (
    <SkeletonPage label="Loading workspace view">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <SkeletonCardGrid className="mt-4" count={3} />
      <SkeletonRows className="mt-4" rows={3} />
    </SkeletonPage>
  );
}
