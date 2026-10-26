"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileSearch,
  Search,
  Filter,
  Code,
  ArrowRight,
  ShieldAlert,
  Server,
  Clock,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SYNTHETIC_EVIDENCE_LIST, SYNTHETIC_INCIDENT } from "@/lib/synthetic-data";

export default function EvidencePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [inspectEvidenceId, setInspectEvidenceId] = React.useState<string | null>("EVD-101");

  const filteredEvidence = SYNTHETIC_EVIDENCE_LIST.filter((evd) => {
    const matchesSearch =
      evd.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evd.associatedAsset.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || evd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const inspectedRecord =
    SYNTHETIC_EVIDENCE_LIST.find((e) => e.id === inspectEvidenceId) || SYNTHETIC_EVIDENCE_LIST[0];

  return (
    <AppLayout
      title="Evidence & Telemetry"
      subtitle="Correlated synthetic logs, empirical forensic facts, and analytic assertions"
    >
      {/* Context banner */}
      <div className="p-4 rounded-xl border border-border bg-surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Synthetic Evidence Repository · Scenario {SYNTHETIC_INCIDENT.id}
          </h2>
          <p className="text-xs text-text-muted">
            All records are synthetic telemetry fixtures used to ground incident analysis and AI explanations.
          </p>
        </div>
        <Link href={`/app/incidents/${SYNTHETIC_INCIDENT.id}`}>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <span>View Incident Summary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search telemetry by ID, keyword, or asset (e.g. EVD-101, sudo, APP-GW-02)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 rounded-lg border border-border bg-surface-input px-3 text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="all">All Categories</option>
            <option value="Observed Fact">Observed Facts</option>
            <option value="Derived Assessment">Derived Assessments</option>
            <option value="Policy Validation">Policy Validations</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Telemetry Table & Inspection Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Correlated Telemetry Records ({filteredEvidence.length})</span>
                <span className="text-xs font-normal text-text-muted font-mono">Dataset Verified</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1C1C1C] border-b border-border text-text-muted uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Evidence ID</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Asset</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredEvidence.map((evd) => {
                      const isSelected = inspectEvidenceId === evd.id;
                      return (
                        <tr
                          key={evd.id}
                          onClick={() => setInspectEvidenceId(evd.id)}
                          className={`hover:bg-surface-elevated/60 transition-colors cursor-pointer ${
                            isSelected ? "bg-accent/10" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-accent">
                            {evd.id}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-text-muted whitespace-nowrap">
                            {evd.timestamp.replace("2026-10-26T", "").replace("Z", "")}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-text-secondary">
                            {evd.associatedAsset}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                evd.category === "Observed Fact"
                                  ? "bg-status-info/15 text-status-info border border-status-info/30"
                                  : evd.category === "Policy Validation"
                                  ? "bg-status-warning/15 text-status-warning border border-status-warning/30"
                                  : "bg-surface-elevated text-text-secondary border border-border"
                              }`}
                            >
                              {evd.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-text-secondary leading-relaxed">
                            {evd.description}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-accent text-[11px] font-semibold">
                              {isSelected ? "Active" : "View"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Inspector Card (Col span 1) */}
        <div className="space-y-6">
          <Card className="border-border bg-surface-card">
            <CardHeader className="border-b border-border/60 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Evidence Inspector</CardTitle>
                <Badge variant="simulation" size="sm">{inspectedRecord.id}</Badge>
              </div>
              <CardDescription className="text-xs text-text-muted">
                Source: {inspectedRecord.source}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div>
                <span className="text-text-muted text-[11px] block mb-1">Associated Asset</span>
                <span className="font-mono font-semibold text-text-primary px-2 py-0.5 rounded bg-surface-elevated border border-border">
                  {inspectedRecord.associatedAsset}
                </span>
              </div>

              <div>
                <span className="text-text-muted text-[11px] block mb-1">Observation Description</span>
                <p className="text-text-secondary leading-relaxed bg-surface-elevated/40 p-3 rounded-lg border border-border">
                  {inspectedRecord.description}
                </p>
              </div>

              <div>
                <span className="text-text-muted text-[11px] block mb-1">Structured JSON Payload</span>
                <pre className="p-3 rounded-lg bg-black/60 border border-border text-[11px] font-mono text-status-success overflow-x-auto">
                  {JSON.stringify(inspectedRecord.rawPayload, null, 2)}
                </pre>
              </div>

              <div className="pt-2 border-t border-border">
                <Link href="/app/simulator" className="block">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Evaluate in Simulator
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
