import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border bg-surface-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors",
            "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-status-critical focus-visible:border-status-critical focus-visible:ring-status-critical",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-status-critical font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
