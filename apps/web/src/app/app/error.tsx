"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Error boundary for the authenticated workspace. It shows the message the
 * runtime produced and never substitutes placeholder data for a failed render.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Surfaced in the browser console only; the message below is what the operator sees.
    console.error("Workspace view failed to render:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div
        role="alert"
        className="max-w-lg w-full rounded-xl border border-red-500/40 bg-red-950/30 p-6 text-xs text-red-200"
      >
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-2">
            <h1 className="text-sm font-semibold text-[#F5F5F5]">This view could not be rendered</h1>
            <p>
              {error.message ||
                "The workspace view threw an unexpected error. No placeholder data was substituted."}
            </p>
            {error.digest ? (
              <p className="font-mono text-[11px] text-[#A3A3A3]">Digest: {error.digest}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={reset}
                className="bg-[#FF6B35] text-white text-xs font-medium px-3.5 py-2 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Try again</span>
              </button>
              <Link href="/app" className="text-[#FF6B35] hover:underline">
                Back to the dashboard
              </Link>
              <Link href="/login" className="text-[#FF6B35] hover:underline">
                Sign in again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
