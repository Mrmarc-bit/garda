import * as React from "react";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SimulationBadgeProps {
  className?: string;
}

export const SimulationBadge: React.FC<SimulationBadgeProps> = ({ className }) => {
  return (
    <div
      className={className}
      title="Environment is in Simulation Mode. All assets, telemetry, and response actions are synthetic. No live systems are connected."
    >
      <Badge variant="simulation" size="default" className="flex items-center gap-1.5 shadow-sm">
        <ShieldAlert className="w-3.5 h-3.5 text-accent animate-pulse" />
        <span>SIMULATION ONLY</span>
      </Badge>
    </div>
  );
};
