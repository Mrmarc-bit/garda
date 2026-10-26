"use client";

import * as React from "react";
import Link from "next/link";
import {
  Network,
  Server,
  Cpu,
  Radio,
  Eye,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { VIRTUAL_ASSETS, VirtualAsset, SYNTHETIC_INCIDENT } from "@/lib/synthetic-data";

export default function DigitalTwinPage() {
  const [selectedAssetId, setSelectedAssetId] = React.useState<string>("APP-GW-02");
  const [showBlastRadius, setShowBlastRadius] = React.useState(true);

  const selectedAsset =
    VIRTUAL_ASSETS.find((a) => a.id === selectedAssetId) || VIRTUAL_ASSETS[1];

  return (
    <AppLayout
      title="IT/OT Digital Twin"
      subtitle="Virtual network topology, service dependency mapping, and containment blast-radius modeling"
    >
      {/* Control Bar */}
      <div className="p-4 rounded-xl border border-border bg-surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted font-mono">TOPOLOGY MODEL: VIRTUAL-GRID-2026</div>
            <div className="text-sm font-semibold text-text-primary">
              6 Virtual Nodes · 5 Directed Dependencies
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={showBlastRadius ? "primary" : "secondary"}
            size="sm"
            onClick={() => setShowBlastRadius(!showBlastRadius)}
            className="gap-2 text-xs"
          >
            <Sliders className="w-4 h-4" />
            <span>{showBlastRadius ? "Blast Radius: Highlighted" : "Show Blast Radius"}</span>
          </Button>
          <Link href="/app/simulator">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <span>Test Containment Impact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Interactive 2D Visual Canvas & Node Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Visualizer Canvas (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-border bg-[#141414]">
            <CardHeader className="border-b border-border/60 pb-3 bg-[#191919]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <span>Interactive 2D Dependency Canvas</span>
                  <Badge variant="simulation" size="sm">Virtual Model</Badge>
                </CardTitle>
                <div className="flex items-center gap-3 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-status-critical" /> Compromised
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-status-warning" /> At Risk
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-status-success" /> Healthy
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Visual Grid Schematic representing 2D Node Graph */}
              <div className="relative min-h-[460px] rounded-xl border border-border/60 bg-[#121212] p-8 flex flex-col justify-between overflow-hidden">
                {/* Background circuit grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#FFF 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Level 1: Core Identity Provider */}
                <div className="flex justify-center">
                  <NodeCard
                    asset={VIRTUAL_ASSETS[0]}
                    isSelected={selectedAssetId === VIRTUAL_ASSETS[0].id}
                    onClick={() => setSelectedAssetId(VIRTUAL_ASSETS[0].id)}
                    highlight={false}
                  />
                </div>

                {/* Connector line */}
                <div className="flex justify-center -my-2">
                  <div className="w-0.5 h-10 bg-border border-dashed border-l border-accent/60" />
                </div>

                {/* Level 2: Compromised Gateway (Central Node) */}
                <div className="flex justify-center">
                  <NodeCard
                    asset={VIRTUAL_ASSETS[1]}
                    isSelected={selectedAssetId === VIRTUAL_ASSETS[1].id}
                    onClick={() => setSelectedAssetId(VIRTUAL_ASSETS[1].id)}
                    highlight={showBlastRadius}
                  />
                </div>

                {/* Connector lines branching out */}
                <div className="flex justify-around px-8 -my-2">
                  <div className="w-0.5 h-10 bg-border" />
                  <div className="w-0.5 h-10 bg-border" />
                  <div className="w-0.5 h-10 bg-border" />
                </div>

                {/* Level 3: Downstream Dependencies */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NodeCard
                    asset={VIRTUAL_ASSETS[2]}
                    isSelected={selectedAssetId === VIRTUAL_ASSETS[2].id}
                    onClick={() => setSelectedAssetId(VIRTUAL_ASSETS[2].id)}
                    highlight={false}
                  />
                  <NodeCard
                    asset={VIRTUAL_ASSETS[3]}
                    isSelected={selectedAssetId === VIRTUAL_ASSETS[3].id}
                    onClick={() => setSelectedAssetId(VIRTUAL_ASSETS[3].id)}
                    highlight={showBlastRadius}
                  />
                  <NodeCard
                    asset={VIRTUAL_ASSETS[4]}
                    isSelected={selectedAssetId === VIRTUAL_ASSETS[4].id}
                    onClick={() => setSelectedAssetId(VIRTUAL_ASSETS[4].id)}
                    highlight={showBlastRadius}
                  />
                </div>

                {/* Level 4: Telemetry Feed Leaf Node */}
                <div className="flex justify-end pt-4 pr-10">
                  <NodeCard
                    asset={VIRTUAL_ASSETS[5]}
                    isSelected={selectedAssetId === VIRTUAL_ASSETS[5].id}
                    onClick={() => setSelectedAssetId(VIRTUAL_ASSETS[5].id)}
                    highlight={showBlastRadius}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Node Details Panel (Col span 1) */}
        <div className="space-y-6">
          <Card className="border-border bg-surface-card">
            <CardHeader className="border-b border-border/60 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Node Inspector</CardTitle>
                <Badge
                  variant={
                    selectedAsset.status === "compromised"
                      ? "critical"
                      : selectedAsset.status === "at_risk"
                      ? "warning"
                      : "success"
                  }
                  size="sm"
                >
                  {selectedAsset.status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription className="font-mono text-xs text-accent">
                {selectedAsset.id}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4 text-xs">
              <div>
                <span className="text-text-muted text-[11px] block mb-1">Service Name</span>
                <span className="font-semibold text-text-primary text-sm">{selectedAsset.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface-elevated/40 border border-border">
                <div>
                  <span className="text-text-muted text-[10px] block">IP Address</span>
                  <span className="font-mono font-semibold text-text-primary">{selectedAsset.ipAddress}</span>
                </div>
                <div>
                  <span className="text-text-muted text-[10px] block">Criticality Tier</span>
                  <span className="font-semibold text-accent capitalize">{selectedAsset.criticality}</span>
                </div>
              </div>

              <div>
                <span className="text-text-muted text-[11px] block mb-1">Direct Upstream Dependencies</span>
                {selectedAsset.dependsOn.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAsset.dependsOn.map((dep) => (
                      <span
                        key={dep}
                        className="px-2 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[11px] text-text-primary"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-text-muted italic text-[11px]">Root architecture node</span>
                )}
              </div>

              {selectedAsset.status === "compromised" && (
                <div className="p-3 rounded-lg border border-status-critical/30 bg-status-critical/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-status-critical">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Compromise Assessment</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Root privilege escalation active. Lateral probes intercepted targeting OT Controller.
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-border space-y-2">
                <Link href="/app/simulator" className="block">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Evaluate Containment Impact
                  </Button>
                </Link>
                <Link href={`/app/incidents/${SYNTHETIC_INCIDENT.id}`} className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Associated Evidence
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

interface NodeCardProps {
  asset: VirtualAsset;
  isSelected: boolean;
  onClick: () => void;
  highlight: boolean;
}

function NodeCard({ asset, isSelected, onClick, highlight }: NodeCardProps) {
  const isCompromised = asset.status === "compromised";
  const isAtRisk = asset.status === "at_risk";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3.5 rounded-xl border text-left transition-all relative ${
        isSelected
          ? "border-accent bg-surface-elevated ring-1 ring-accent shadow-lg"
          : "border-border bg-surface-card hover:bg-surface-elevated/80"
      } ${
        highlight && isCompromised
          ? "border-status-critical ring-2 ring-status-critical/40"
          : highlight && isAtRisk
          ? "border-status-warning ring-1 ring-status-warning/40"
          : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="font-mono text-xs font-bold text-text-primary">{asset.id}</span>
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isCompromised
              ? "bg-status-critical animate-pulse"
              : isAtRisk
              ? "bg-status-warning"
              : "bg-status-success"
          }`}
        />
      </div>
      <div className="text-xs text-text-muted truncate max-w-[160px]">{asset.name}</div>
      <div className="text-[10px] font-mono text-text-muted mt-1">{asset.ipAddress}</div>
    </button>
  );
}
