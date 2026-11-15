"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  FileText,
  Play,
  ShieldCheck,
} from "lucide-react";
import {
  ApiError,
  loadFailureHint,
  SyntheticIncident,
  VirtualAsset,
  fetchAuditTrail,
  fetchIncidents,
  fetchTopology,
} from "@/lib/api-client";
import { Skeleton, SkeletonRows } from "@/components/ui/skeleton";

const STATUS_TONE: Record<string, string> = {
  healthy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  at_risk: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  compromised: "text-red-400 bg-red-500/10 border-red-500/20",
};

const DOT_TONE: Record<string, string> = {
  healthy: "bg-emerald-400",
  at_risk: "bg-amber-400",
  compromised: "bg-red-400",
};

export default function OverviewDashboard() {
  const [incidents, setIncidents] = React.useState<SyntheticIncident[]>([]);
  const [topology, setTopology] = React.useState<VirtualAsset[]>([]);
  const [auditTotal, setAuditTotal] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hint, setHint] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [incidentData, topologyData, auditPage] = await Promise.all([
          fetchIncidents(),
          fetchTopology(),
          fetchAuditTrail(10, 0),
        ]);
        if (cancelled) return;
        setIncidents(incidentData);
        setTopology(topologyData);
        setAuditTotal(auditPage.total);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load workspace state.");
        setHint(loadFailureHint(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const atRiskAssets = topology.filter(
    (asset) => asset.status === "at_risk" || asset.status === "compromised"
  );
  const highRiskIncidents = incidents.filter(
    (incident) => incident.severity === "critical" || incident.severity === "warning"
  );
  const awaitingReview = incidents.filter((incident) => incident.status === "awaiting_review");

  const metric = (value: number) => {
    if (isLoading) return <Skeleton className="h-8 w-12" />;
    if (error) return <span className="text-[#737373]">—</span>;
    return value;
  };

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
              error
                ? "text-red-300 bg-red-500/10 border-red-500/30"
                : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${error ? "bg-red-400" : "bg-emerald-400"}`}
              aria-hidden="true"
            />
            {error ? "API UNAVAILABLE" : isLoading ? "SYNCING" : "WORKSPACE SYNCHRONIZED"}
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Defensive IT/OT simulation environment · metrics computed from the synthetic engine
        </div>
        <div className="text-xs font-mono text-[#737373]">/app</div>
      </div>

      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">Simulation Overview</h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Active synthetic incident state, virtual IT/OT topology health, and deterministic safety
          enforcement telemetry.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Workspace state unavailable</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-[#A3A3A3]">
              {hint ?? "The view could not be loaded."} No placeholder numbers are shown in place of
              real ones.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-block text-[#FF6B35] hover:underline font-medium"
            >
              Sign in again
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/app/simulator"
            className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center justify-center gap-2 shadow-sm min-h-10 lg:min-h-6"
          >
            <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
            <span>Open Simulator</span>
          </Link>
          <Link
            href="/app/reports"
            className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors inline-flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Generate Reports</span>
          </Link>
        </div>
      </div>

      {/* KPI cards — real counts, no `|| 1` floor. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
          <div className="text-xs text-[#A3A3A3]">Active Incidents</div>
          <div className="text-3xl font-semibold font-mono text-[#F5F5F5] my-2">
            {metric(incidents.length)}
          </div>
          <div className="text-xs text-[#FBBF24] font-medium">
            {awaitingReview.length} awaiting review
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
          <div className="text-xs text-[#A3A3A3]">High-Risk Scenarios</div>
          <div className="text-3xl font-semibold font-mono text-[#FF6B35] my-2">
            {metric(highRiskIncidents.length)}
          </div>
          <div className="text-xs text-[#737373]">Severity: Critical / Warning</div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
          <div className="text-xs text-[#A3A3A3]">Virtual Services at Risk</div>
          <div className="text-3xl font-semibold font-mono text-[#F5F5F5] my-2">
            {metric(atRiskAssets.length)}
          </div>
          <div className="text-xs text-[#737373] font-mono truncate">
            {atRiskAssets.map((asset) => asset.id).join(", ") || "none"}
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
          <div className="text-xs text-[#A3A3A3]">Deterministic Safety Invariants</div>
          <div className="text-3xl font-semibold font-mono text-emerald-400 my-2">5</div>
          <div className="text-xs text-emerald-400 font-medium">SEC-OT-01..05, server-side</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Incidents card replaces the fabricated 4-bar timeline chart. */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              SYNTHETIC INCIDENT STATE
            </div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-4">
              Scenario queue
            </h2>

            {incidents.length === 0 ? (
              isLoading ? (
                <SkeletonRows rows={2} />
              ) : (
                <p className="text-xs text-[#737373]">No synthetic scenarios are available.</p>
              )
            ) : (
              <ul className="space-y-2">
                {incidents.map((incident) => (
                  <li
                    key={incident.id}
                    className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-[#1E1E1E] border border-[#333]"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/app/incidents/${incident.id}`}
                        className="font-mono text-xs text-[#FF6B35] hover:underline"
                      >
                        {incident.id}
                      </Link>
                      <p className="text-xs text-[#F5F5F5] truncate">{incident.title}</p>
                      <p className="text-[11px] text-[#737373] font-mono">{incident.targetAsset}</p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        incident.severity === "critical"
                          ? "text-red-400 bg-red-500/10 border-red-500/20"
                          : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      }`}
                    >
                      {incident.severity.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#737373] mt-4 font-mono">
            <span>Total scenarios: {incidents.length}</span>
            <Link href="/app/incidents" className="text-[#FF6B35] hover:underline">
              Open incident queue
            </Link>
          </div>
        </div>

        {/* Topology card — rendered from the API, not three hardcoded rows. */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#F5F5F5]">
                Virtual IT/OT Topology Status
              </h2>
              <Link
                href="/app/digital-twin"
                className="text-xs text-[#FF6B35] hover:underline inline-flex items-center gap-1 font-mono"
              >
                <span>Open Digital Twin</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {topology.length === 0 ? (
              isLoading ? (
                <SkeletonRows rows={4} className="mt-4" />
              ) : (
                <p className="text-xs text-[#737373] mt-4">No virtual assets are available.</p>
              )
            ) : (
              <ul className="space-y-2 mt-4 text-xs">
                {topology.map((asset) => (
                  <li
                    key={asset.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#1E1E1E] border border-[#333]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          DOT_TONE[asset.status] ?? "bg-[#737373]"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="font-mono font-medium text-[#F5F5F5] truncate">
                        {asset.id}
                      </span>
                      <span className="text-[#737373] text-[11px] truncate">{asset.type}</span>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        STATUS_TONE[asset.status] ?? "text-[#A3A3A3] bg-[#252525] border-[#383838]"
                      }`}
                    >
                      {asset.status.replace("_", " ").toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-xs text-[#737373] mt-4 font-mono">
            All assets are virtual. No hostname is resolved and no containment command is issued.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#F5F5F5]">Pending Recommendations</h2>
              <span className="text-xs font-mono text-[#FF6B35]">
                {incidents.find((incident) => incident.status === "awaiting_review")?.id ??
                  "none pending"}
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Candidate strategies are evaluated by the deterministic engine and await human
              sign-off. The API refuses an approval for any policy-blocked strategy, even if the
              request bypasses the UI.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#383838] flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-mono">Server-side gate: enforced</span>
            <Link
              href="/app/recommendations"
              className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
            >
              Inspect &amp; Authorize ➔
            </Link>
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#F5F5F5]">
                Methodology Comparison
              </h2>
              <span className="text-xs font-mono text-[#737373]">NOT RUN</span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              The benchmark harness compares static heuristics, unconstrained AI narratives and the
              deterministic simulation. It has not been executed yet, so this workspace shows no
              benchmark numbers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#383838] flex items-center justify-between">
            <span className="text-xs text-[#737373] font-mono">No results recorded</span>
            <Link
              href="/app/experiments"
              className="text-xs text-[#FF6B35] font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>Open Experiment Lab</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>GARDA-SIM AI Operational Overview · Synthetic domain</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>REST API: {error ? "UNAVAILABLE" : "CONNECTED"}</span>
          <span>SAFETY GATES: SERVER-SIDE</span>
          <span>AUDIT LEDGER: {error ? "—" : `${auditTotal} EVENTS`}</span>
        </div>
      </div>
    </>
  );
}
