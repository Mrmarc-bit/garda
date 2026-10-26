"use client";

import * as React from "react";
import Link from "next/link";
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  Hash,
  User,
  ArrowRight,
  Clock,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AuditTrailPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedEventType, setSelectedEventType] = React.useState<string>("all");

  const auditEvents = [
    {
      id: "AUD-8849-01",
      timestamp: "2026-10-26T15:42:10Z",
      actor: "analyst-demo-03",
      eventType: "STRATEGY_APPROVED",
      resource: "STRAT-B (INC-2026-0042)",
      result: "SUCCESS",
      hash: "8f4a1c72...9b2e",
      details: "Approved STRAT-B for demonstration review with verified OT telemetry continuity.",
    },
    {
      id: "AUD-8849-02",
      timestamp: "2026-10-26T15:40:02Z",
      actor: "system-safety-engine",
      eventType: "POLICY_INVARIANT_EVAL",
      resource: "STRAT-A (INC-2026-0042)",
      result: "VIOLATION_BLOCKED",
      hash: "3d22bf10...6a4c",
      details: "Blocked candidate STRAT-A due to Rule SEC-OT-04 telemetry cutoff violation.",
    },
    {
      id: "AUD-8849-03",
      timestamp: "2026-10-26T15:39:45Z",
      actor: "system-simulation-engine",
      eventType: "SIMULATION_RUN",
      resource: "INC-2026-0042 (APP-GW-02)",
      result: "SUCCESS",
      hash: "e3b0c442...b855",
      details: "Deterministic calculation of 3 candidate containment strategies completed.",
    },
    {
      id: "AUD-8849-04",
      timestamp: "2026-10-26T14:15:00Z",
      actor: "analyst-demo-03",
      eventType: "SCENARIO_LOADED",
      resource: "INC-2026-0042",
      result: "SUCCESS",
      hash: "91c49b01...22fa",
      details: "Loaded synthetic scenario Suspicious Privilege Escalation on APP-GW-02.",
    },
    {
      id: "AUD-8849-05",
      timestamp: "2026-10-26T14:12:00Z",
      actor: "EDR-SIM-AGENT",
      eventType: "INCIDENT_TRIGGER",
      resource: "APP-GW-02",
      result: "TRIGGERED",
      hash: "44ab8190...81dd",
      details: "Synthetic lateral scan intercepted targeting port 502 Modbus controller.",
    },
  ];

  const filteredEvents = auditEvents.filter((ev) => {
    const matchesSearch =
      ev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedEventType === "all" || ev.eventType === selectedEventType;
    return matchesSearch && matchesType;
  });

  return (
    <AppLayout
      title="Audit Trail"
      subtitle="Append-only cryptographic simulation event ledger, operator action logs, and policy decisions"
    >
      {/* Header Context */}
      <div className="p-4 rounded-xl border border-border bg-surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Immutable Simulation Audit Trail</h2>
          <p className="text-xs text-text-muted">
            All operator reviews, deterministic simulation runs, and safety verdicts are permanently recorded.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="simulation">Audit Mode Active</Badge>
          <Badge variant="success">Hash Chain Verified</Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search audit trail by event ID, actor, resource, or action details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Event:
          </span>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="h-10 rounded-lg border border-border bg-surface-input px-3 text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="all">All Event Types</option>
            <option value="STRATEGY_APPROVED">STRATEGY_APPROVED</option>
            <option value="POLICY_INVARIANT_EVAL">POLICY_INVARIANT_EVAL</option>
            <option value="SIMULATION_RUN">SIMULATION_RUN</option>
            <option value="SCENARIO_LOADED">SCENARIO_LOADED</option>
            <option value="INCIDENT_TRIGGER">INCIDENT_TRIGGER</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table Card */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span>Recorded Audit Entries ({filteredEvents.length})</span>
            <span className="text-xs font-mono text-text-muted">Ledger State: Consistent</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1C1C1C] border-b border-border text-text-muted uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Action Summary</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">{ev.id}</td>
                    <td className="py-3.5 px-4 font-mono text-text-muted whitespace-nowrap">
                      {ev.timestamp.replace("2026-10-26T", "").replace("Z", "")}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-primary">{ev.actor}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-text-secondary">{ev.eventType}</td>
                    <td className="py-3.5 px-4 font-mono text-accent">{ev.resource}</td>
                    <td className="py-3.5 px-4 text-text-secondary max-w-xs">{ev.details}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge
                        size="sm"
                        variant={
                          ev.result === "SUCCESS"
                            ? "success"
                            : ev.result === "VIOLATION_BLOCKED"
                            ? "critical"
                            : "info"
                        }
                      >
                        {ev.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
