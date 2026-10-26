"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  PlayCircle,
  FileSearch,
  Network,
  Clock,
  ShieldAlert,
  Server,
  Code,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  SYNTHETIC_INCIDENT,
  SYNTHETIC_EVIDENCE_LIST,
  CANDIDATE_STRATEGIES,
} from "@/lib/synthetic-data";

export default function IncidentDetailPage() {
  const params = useParams();
  const incidentId = params?.id as string || SYNTHETIC_INCIDENT.id;
  const [selectedEvidence, setSelectedEvidence] = React.useState<string | null>(null);

  return (
    <AppLayout
      title={`Incident Detail · ${incidentId}`}
      subtitle="Correlated synthetic evidence, attack timeline, and candidate defense response options"
    >
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Link href="/app/incidents" className="hover:text-text-primary flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Incidents</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-text-primary">{incidentId}</span>
      </div>

      {/* Incident Header Spotlight Card */}
      <Card className="border-accent/40 bg-surface-card">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-accent">{incidentId}</span>
                <Badge variant="critical">Critical Severity</Badge>
                <Badge variant="warning">Awaiting Review</Badge>
                <Badge variant="simulation">Simulation Only</Badge>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                {SYNTHETIC_INCIDENT.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/app/digital-twin">
                <Button variant="outline" size="sm" className="gap-2">
                  <Network className="w-4 h-4" />
                  <span>Inspect Topology</span>
                </Button>
              </Link>
              <Link href="/app/simulator">
                <Button size="sm" className="gap-2 bg-accent hover:bg-accent-hover text-white">
                  <PlayCircle className="w-4 h-4" />
                  <span>Simulate Response</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Incident Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <span className="text-text-muted block mb-1">Target Asset</span>
              <span className="font-mono font-semibold text-text-primary px-2 py-0.5 rounded bg-surface-elevated border border-border inline-block">
                {SYNTHETIC_INCIDENT.targetAsset}
              </span>
            </div>
            <div>
              <span className="text-text-muted block mb-1">Detection Source</span>
              <span className="font-semibold text-text-primary">EDR-SIM-AGENT</span>
            </div>
            <div>
              <span className="text-text-muted block mb-1">Detected Time</span>
              <span className="font-mono text-text-primary">2026-10-26 14:12 UTC</span>
            </div>
            <div>
              <span className="text-text-muted block mb-1">Confidence Score</span>
              <span className="font-semibold text-accent">82% (Illustrative)</span>
            </div>
            <div>
              <span className="text-text-muted block mb-1">Synthetic Identity</span>
              <span className="font-mono text-text-primary">analyst-demo-03</span>
            </div>
            <div>
              <span className="text-text-muted block mb-1">Blast Radius</span>
              <span className="font-semibold text-status-warning">3 Virtual Assets</span>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed bg-surface-elevated/40 p-3 rounded-lg border border-border">
            {SYNTHETIC_INCIDENT.summary}
          </p>
        </CardContent>
      </Card>

      {/* Main Grid: Evidence Table & Incident Attack Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Correlated Evidence Table (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Correlated Synthetic Evidence ({SYNTHETIC_EVIDENCE_LIST.length})</span>
                <span className="text-xs font-normal text-text-muted font-mono">Traceable Fixtures</span>
              </CardTitle>
              <CardDescription>
                Empirical observations, derived analytic assessments, and deterministic policy alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1C1C1C] border-b border-border text-text-muted uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Evidence ID</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-right">Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {SYNTHETIC_EVIDENCE_LIST.map((evd) => (
                      <tr key={evd.id} className="hover:bg-surface-elevated/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-accent">
                          {evd.id}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-text-muted whitespace-nowrap">
                          {evd.timestamp.replace("2026-10-26T", "").replace("Z", "")}
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
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedEvidence(selectedEvidence === evd.id ? null : evd.id)
                            }
                            className="p-1.5 rounded hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors"
                            title="Inspect Raw JSON"
                          >
                            <Code className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* JSON Payload Inspection Drawer */}
              {selectedEvidence && (
                <div className="p-4 border-t border-border bg-[#141414] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-accent">
                      Raw Payload · {selectedEvidence}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedEvidence(null)}
                      className="text-xs text-text-muted hover:text-text-primary"
                    >
                      Close
                    </button>
                  </div>
                  <pre className="p-3 rounded bg-black/60 border border-border text-[11px] font-mono text-status-success overflow-x-auto">
                    {JSON.stringify(
                      SYNTHETIC_EVIDENCE_LIST.find((e) => e.id === selectedEvidence)?.rawPayload,
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline & Next Steps (Col span 1) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>Chronological Attack Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="relative pl-6 border-l-2 border-border space-y-6 text-xs">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-status-info border-2 border-bg-primary" />
                  <div className="font-mono text-[10px] text-text-muted">14:10:12 UTC</div>
                  <div className="font-semibold text-text-primary">Sudo Token Elevation</div>
                  <p className="text-text-muted mt-0.5">UID 1004 escalated to root on APP-GW-02.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-status-warning border-2 border-bg-primary" />
                  <div className="font-mono text-[10px] text-text-muted">14:11:05 UTC</div>
                  <div className="font-semibold text-text-primary">Outbound C2 Connection</div>
                  <p className="text-text-muted mt-0.5">SYN attempt to external IP 198.51.100.44:443.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-status-critical border-2 border-bg-primary animate-pulse" />
                  <div className="font-mono text-[10px] text-text-muted">14:12:00 UTC</div>
                  <div className="font-semibold text-status-critical">Lateral OT Probe Intercepted</div>
                  <p className="text-text-muted mt-0.5">Probing virtual controller port 502 (Modbus).</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fast CTA to Simulator */}
          <Card className="bg-[#1C1814] border-accent/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-accent flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                <span>Simulate Response Candidates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-text-secondary space-y-3">
              <p>
                3 candidate containment strategies are ready for deterministic simulation and safety policy validation.
              </p>
              <Link href="/app/simulator" className="block">
                <Button className="w-full text-xs">Launch Simulator for INC-2026-0042</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
