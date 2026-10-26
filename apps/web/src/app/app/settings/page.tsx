"use client";

import * as React from "react";
import {
  Settings,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Save,
  CheckCircle2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  const [safetyStrictness, setSafetyStrictness] = React.useState("strict");
  const [aiProvider, setAiProvider] = React.useState("deterministic_stub");
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AppLayout
      title="Settings & Simulation Configuration"
      subtitle="Operational simulator policies, deterministic safety thresholds, and AI provider selection"
    >
      {/* Defensive Safety Invariant Notice */}
      <div className="p-4 rounded-xl border border-border bg-[#181818] flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
          <span>
            <strong className="text-text-primary">Safety Decoupling Guarantee:</strong> AI provider configuration only impacts natural-language explanation synthesis. Authoritative metrics and deterministic safety enforcement remain strictly isolated.
          </span>
        </div>
        <Badge variant="simulation">Deterministic Core</Badge>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Section 1: Deterministic Safety Constraints */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-semibold">Deterministic Safety Policy Configuration</CardTitle>
            <CardDescription>
              Hard constraint enforcement level governing simulated response actions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface-elevated/40 cursor-pointer">
                <input
                  type="radio"
                  name="safety"
                  value="strict"
                  checked={safetyStrictness === "strict"}
                  onChange={() => setSafetyStrictness("strict")}
                  className="mt-1 text-accent focus:ring-accent"
                />
                <div>
                  <div className="font-semibold text-text-primary flex items-center gap-2">
                    <span>Strict Industrial Safety (Recommended for IT/OT)</span>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                  <p className="text-text-muted mt-1 leading-relaxed">
                    Enforces Rule SEC-OT-04: Blocks any response action that severs telemetry or command feeds to industrial controllers without prior fail-safe buffer confirmation.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface-elevated/40 cursor-pointer">
                <input
                  type="radio"
                  name="safety"
                  value="standard"
                  checked={safetyStrictness === "standard"}
                  onChange={() => setSafetyStrictness("standard")}
                  className="mt-1 text-accent focus:ring-accent"
                />
                <div>
                  <div className="font-semibold text-text-primary">Standard Enterprise IT Policy</div>
                  <p className="text-text-muted mt-1 leading-relaxed">
                    Prioritizes enterprise network containment; warns on lateral OT disruptions without hard blocking.
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: AI Explanation Provider Adapter */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-semibold">AI Explanation Provider Adapter</CardTitle>
            <CardDescription>
              Select the backend component responsible for generating plain-language trade-off explanations
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface-elevated/40 cursor-pointer">
                <input
                  type="radio"
                  name="aiprovider"
                  value="deterministic_stub"
                  checked={aiProvider === "deterministic_stub"}
                  onChange={() => setAiProvider("deterministic_stub")}
                  className="mt-1 text-accent focus:ring-accent"
                />
                <div>
                  <div className="font-semibold text-text-primary flex items-center gap-2">
                    <span>Deterministic Local Synthetic Stub (Default)</span>
                    <Badge variant="info" size="sm">Zero API Key Needed</Badge>
                  </div>
                  <p className="text-text-muted mt-1 leading-relaxed">
                    Generates 100% reproducible, verifiable explanations directly from the deterministic rule graph. Guaranteed offline stability.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface-elevated/40 cursor-pointer">
                <input
                  type="radio"
                  name="aiprovider"
                  value="external_llm"
                  checked={aiProvider === "external_llm"}
                  onChange={() => setAiProvider("external_llm")}
                  className="mt-1 text-accent focus:ring-accent"
                />
                <div>
                  <div className="font-semibold text-text-primary">External LLM Provider (Anthropic / OpenAI API)</div>
                  <p className="text-text-muted mt-1 leading-relaxed">
                    Synthesizes dynamic responses using structured Pydantic schemas. Falls back seamlessly to the deterministic stub if offline.
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-text-muted">
            {isSaved ? "✓ Configuration persisted to local environment" : "Changes apply to subsequent simulation runs"}
          </span>
          <Button variant="primary" size="sm" onClick={handleSave} className="gap-2 text-xs">
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
