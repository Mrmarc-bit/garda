"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Server,
  Clock,
  PlayCircle,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SYNTHETIC_INCIDENT } from "@/lib/synthetic-data";

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("all");

  const incidents = [
    SYNTHETIC_INCIDENT,
    {
      id: "INC-2026-0038",
      title: "Anomalous SCADA Modbus Command Frequency",
      severity: "warning" as const,
      status: "contained" as const,
      targetAsset: "OT-CONTROLLER-SIM-01",
      detectedAt: "2026-10-25T09:40:00Z",
      confidence: 0.74,
      syntheticIdentity: "analyst-demo-01",
      summary: "High-frequency telemetry polling detected from unauthorized edge node. Response simulated and verified.",
      affectedServices: ["OT-CONTROLLER-SIM-01"],
    },
    {
      id: "INC-2026-0029",
      title: "Lateral Reconnaissance Probe",
      severity: "info" as const,
      status: "simulated" as const,
      targetAsset: "MONITOR-01",
      detectedAt: "2026-10-24T18:15:00Z",
      confidence: 0.68,
      syntheticIdentity: "analyst-demo-02",
      summary: "Port scan activity targeting SIEM collector. Evaluated under baseline containment scenario.",
      affectedServices: ["MONITOR-01"],
    },
  ];

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.targetAsset.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === "all" || inc.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <AppLayout
      title="Incidents & Scenarios"
      subtitle="Synthetic cybersecurity incident repository and response scenario workbench"
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface-card">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Incident Repository</h2>
          <p className="text-xs text-text-muted">
            All scenarios and logs are synthetic for defensive evaluation. Active incident highlighted below.
          </p>
        </div>
        <Link href="/app/simulator">
          <Button size="sm" className="gap-2">
            <PlayCircle className="w-4 h-4" />
            <span>Simulate Active Scenario</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search by incident ID, title, or asset (e.g., APP-GW-02)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="h-10 rounded-lg border border-border bg-surface-input px-3 text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Incident List Table Card */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span>Simulated Incidents ({filteredIncidents.length})</span>
            <span className="text-xs font-normal text-text-muted font-mono">Dataset: SYNTH-2026.1</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1C1C1C] border-b border-border text-text-muted uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Title & Description</th>
                  <th className="py-3 px-4">Target Asset</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredIncidents.map((incident) => {
                  const isCurrent = incident.id === SYNTHETIC_INCIDENT.id;
                  return (
                    <tr
                      key={incident.id}
                      className={`hover:bg-surface-elevated/40 transition-colors ${
                        isCurrent ? "bg-accent/5" : ""
                      }`}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-text-primary">
                        <div className="flex items-center gap-1.5">
                          {isCurrent && <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                          <span>{incident.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-sm">
                        <div className="font-semibold text-text-primary">{incident.title}</div>
                        <div className="text-[11px] text-text-muted truncate mt-0.5">{incident.summary}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-text-secondary">
                        <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border">
                          {incident.targetAsset}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={incident.severity} size="sm">
                          {incident.severity.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-mono text-text-primary">
                        {(incident.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="py-4 px-4">
                        <span className="capitalize text-text-secondary font-medium">
                          {incident.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link href={`/app/incidents/${incident.id}`}>
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <span>Inspect</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
