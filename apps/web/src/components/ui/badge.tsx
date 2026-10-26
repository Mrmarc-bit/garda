import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "success" | "warning" | "critical" | "info" | "neutral" | "simulation";
  size?: "sm" | "default";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full transition-colors select-none tracking-wide";

  const variants = {
    default: "bg-surface-elevated text-text-primary border border-border",
    outline: "border border-border text-text-secondary bg-transparent",
    success: "bg-status-success/15 text-status-success border border-status-success/30",
    warning: "bg-status-warning/15 text-status-warning border border-status-warning/30",
    critical: "bg-status-critical/15 text-status-critical border border-status-critical/30",
    info: "bg-status-info/15 text-status-info border border-status-info/30",
    neutral: "bg-status-neutral/15 text-text-secondary border border-border",
    simulation: "bg-accent/20 text-accent border border-accent/40 font-semibold uppercase tracking-wider",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    default: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <div className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </div>
  );
};
