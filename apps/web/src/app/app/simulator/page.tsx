"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  ApiError,
  loadFailureHint,
  CandidateStrategy,
  SessionInfo,
  SimulationResult,
  SyntheticIncident,
  fetchIncidents,
  fetchSession,
  fetchStrategies,
  runSimulation,
} from "@/lib/api-client";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCardGrid,
  SkeletonPage,
} from "@/components/ui/skeleton";

/** Invariant catalogue. Verdicts come from the server, never from this map. */
const RULE_LABELS: Record<string, string> = {
  "SEC-OT-01": "Zero Real-World Containment",
  "SEC-OT-02": "Operator Clearance Verification",
  "SEC-OT-03": "Identity Service Preservation",
  "SEC-OT-04": "Uninterrupted OT Telemetry Stream",
  "SEC-OT-05": "Audit Chain Integrity",
};

function SimulatorSkeleton() {
  return (
    <SkeletonPage label="Loading simulator context from the deterministic engine">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Skeleton className="h-24" />
          <SkeletonCardGrid count={3} className="lg:grid-cols-3" />
          <Skeleton className="h-40" />
        </div>
        <SkeletonCard />
      </div>
    </SkeletonPage>
  );
}

function SimulatorView() {
  const searchParams = useSearchParams();
  const queryIncident = searchParams.get("incident");

  const [incidents, setIncidents] = React.useState<SyntheticIncident[]>([]);
  const [strategies, setStrategies] = React.useState<CandidateStrategy[]>([]);
  const [session, setSession] = React.useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [selectedScenarioId, setSelectedScenarioId] = React.useState<string>("");
  const [selectedStrategyCode, setSelectedStrategyCode] = React.useState<string>("STRAT-B");
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);
  const [simulationResult, setSimulationResult] = React.useState<SimulationResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [showComparison, setShowComparison] = React.useState<boolean>(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [incidentData, strategyData, sessionData] = await Promise.all([
          fetchIncidents(),
          fetchStrategies(),
          fetchSession(),
        ]);
        if (cancelled) return;
        setIncidents(incidentData);
        setStrategies(strategyData);
        setSession(sessionData);
        const requested = incidentData.find((incident) => incident.id === queryIncident);
        setSelectedScenarioId(requested?.id ?? incidentData[0]?.id ?? "");
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? loadFailureHint(err) : "Could not load simulator context."
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [queryIncident]);

  const activeScenario = incidents.find((incident) => incident.id === selectedScenarioId);

  const handleRunSimulation = async () => {
    if (!activeScenario) return;
    setIsSimulating(true);
    setErrorMessage(null);

    try {
      const result = await runSimulation({
        scenario_id: activeScenario.id,
        strategy_code: selectedStrategyCode,
        target_asset: activeScenario.targetAsset,
      });
      setSimulationResult(result);
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : "Failed to execute the simulation."
      );
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setSelectedStrategyCode("STRAT-B");
    setSimulationResult(null);
    setErrorMessage(null);
  };

  if (isLoading) {
    return <SimulatorSkeleton />;
  }

  if (loadError || !activeScenario) {
    return (
      <>
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Simulator unavailable</p>
            <p className="mt-1">
              {loadError ?? "No synthetic incident scenario is available from the API."}
            </p>
            <p className="mt-2 text-[#A3A3A3]">
              A simulation cannot be run without a scenario and the server-side safety engine.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ENGINE ACTIVE
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Defensive virtual testing laboratory — isolated from production infrastructure
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/simulator
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Response Simulator
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Evaluate blast radius, operational service impact and deterministic safety rules before authorized human review.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-all inline-flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluating Engine...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Simulation</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={isSimulating}
          className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Simulation Result Callout Container */}
      {simulationResult ? (
        <div
          className={`mt-6 border rounded-xl p-5 transition-all ${
            simulationResult.safety_policy_status === "PASSED"
              ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/25 border-red-500/40 text-red-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {simulationResult.safety_policy_status === "PASSED" ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-400" />
              )}
              <span className="text-sm font-semibold text-[#F5F5F5]">
                {simulationResult.safety_policy_status === "PASSED"
                  ? "Simulation Successful · Safety Policy Verified"
                  : "Simulation Blocked · Deterministic Safety Invariant Violation"}
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#A3A3A3]">
              <span title="Reproducibility fingerprint of this run. It is not a tamper-proof seal.">
                Fingerprint: {simulationResult.integrity_hash.slice(0, 12)}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-[#A3A3A3] block">Risk Reduction</span>
              <span className="text-base font-bold text-[#F5F5F5] font-mono">
                {simulationResult.security_benefit_score}%
              </span>
            </div>
            <div>
              <span className="text-[#A3A3A3] block">Estimated Downtime</span>
              <span
                className={`text-base font-bold font-mono ${
                  simulationResult.simulated_downtime_minutes === 0
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {simulationResult.simulated_downtime_minutes} min
              </span>
            </div>
            <div>
              <span className="text-[#A3A3A3] block">Recovery Effort</span>
              <span className="text-base font-bold text-[#F5F5F5]">
                {simulationResult.recovery_effort}
              </span>
            </div>
            <div>
              <span className="text-[#A3A3A3] block">Safety Gate</span>
              <span
                className={`text-base font-bold ${
                  simulationResult.safety_policy_status === "PASSED"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {simulationResult.safety_policy_status}
              </span>
            </div>
          </div>

          {simulationResult.safety_violation_reason && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-xs text-red-200">
              <span className="font-semibold block">Violation Detail:</span>
              <span className="mt-0.5 block">{simulationResult.safety_violation_reason}</span>
            </div>
          )}

          {simulationResult.impacted_services && simulationResult.impacted_services.length > 0 && (
            <div className="mt-3 text-xs text-[#A3A3A3]">
              <span>Blast radius affected services: </span>
              <span className="font-mono text-[#F5F5F5]">
                {simulationResult.impacted_services.join(", ")}
              </span>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#A3A3A3]">
              Recorded in the append-only, HMAC-chained audit ledger
              {simulationResult.audit_id ? (
                <>
                  {" as "}
                  <span className="font-mono text-[#F5F5F5]">{simulationResult.audit_id}</span>
                </>
              ) : null}
              .
            </span>
            <Link
              href="/app/recommendations"
              className="text-[#FF6B35] font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>Inspect in Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-[#42271F]/40 border border-[#FF6B35]/50 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#F5F5F5] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping" />
              <span>Ready state · Engine awaiting execution</span>
            </div>
            <span className="text-[11px] font-mono text-[#A3A3A3]">
              Operator: {session?.operator_id ?? "—"}
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-2">
            Select a candidate strategy below and click <strong className="text-[#F5F5F5]">Run Simulation</strong> to compute deterministic blast radius and verify safety invariants against virtual assets.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Interactive Scenario Selector & Clearance Dropdown Box */}
      <div className="mt-4 bg-[#252525] border border-[#383838] rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-7">
          <label htmlFor="sim-scenario-select" className="block text-[11px] text-[#737373] mb-1">
            Target Incident Scenario
          </label>
          <select
            id="sim-scenario-select"
            value={selectedScenarioId}
            onChange={(event) => {
              setSelectedScenarioId(event.target.value);
              setSimulationResult(null);
              setErrorMessage(null);
            }}
            className="w-full bg-transparent text-xs font-mono text-[#F5F5F5] font-semibold focus:outline-none cursor-pointer"
          >
            {incidents.map((incident) => (
              <option key={incident.id} value={incident.id} className="bg-[#252525]">
                {incident.id} — {incident.title}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <span className="block text-[11px] text-[#737373] mb-1">
            Operator Clearance (SEC-OT-02)
          </span>
          <div className="text-xs font-mono text-[#F5F5F5]">
            Level {session?.clearance ?? "—"} · {session?.operator_id ?? "unauthenticated"}
          </div>
          <span className="text-[10px] text-[#737373]">
            Resolved from your session; not selectable.
          </span>
        </div>

        <div className="md:col-span-2 text-right">
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-mono inline-block">
            {activeScenario.confidence} CONFIDENCE
          </span>
        </div>
      </div>

      {/* 2-Column: Incident Context & Policy Constraints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Left Card: Incident summary */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-[#FF6B35] font-bold">
              {activeScenario.id}
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5] mt-1">
              {activeScenario.title}
            </h2>

            <div className="flex items-center gap-3 text-xs mt-3">
              <span className={activeScenario.severity === "critical" ? "text-red-400 font-bold" : "text-[#FBBF24] font-bold"}>
                · {activeScenario.severity.toUpperCase()}
              </span>
              <span className="text-emerald-400 font-mono">· {activeScenario.status.replace("_", " ").toUpperCase()}</span>
              <span className="text-[#A3A3A3]">· Virtual Boundary</span>
            </div>

            <div className="space-y-1.5 text-xs mt-4">
              <div>
                <span className="text-[#A3A3A3]">Primary asset / </span>
                <span className="font-mono text-[#F5F5F5] font-bold">{activeScenario.targetAsset}</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Synthetic identity / </span>
                <span className="font-mono text-[#F5F5F5]">{activeScenario.syntheticIdentity}</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Affected Services / </span>
                <span className="font-mono text-amber-400">
                  {activeScenario.affectedServices.join(", ")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#383838]">
            <div className="text-[11px] text-[#A3A3A3] mb-2 flex items-center justify-between">
              <span>Heuristic anomaly score</span>
              <span className="font-mono text-[#FF6B35] font-bold">{activeScenario.confidence}</span>
            </div>
            <div className="w-full h-1.5 bg-[#171717] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF6B35] rounded-full transition-all"
                style={{ width: `${Math.round(activeScenario.confidence * 100)}%` }}
              />
            </div>
            <div className="font-mono text-[11px] text-[#737373] mt-2">
              Ground truth: simulated evidence cluster on {activeScenario.targetAsset}
            </div>
          </div>
        </div>

        {/* Right Card: Constraint definitions */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase flex items-center gap-2">
              <Lock className="w-3 h-3" />
              <span>DETERMINISTIC SAFETY INVARIANTS</span>
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5] mt-1 mb-4">
              Non-negotiable policy constraints
            </h2>

            <div className="space-y-3 text-xs">
              {Object.entries(RULE_LABELS).map(([code, label]) => {
                const verdict = simulationResult?.evaluated_rules?.[code];
                const failed = verdict !== undefined && verdict !== "PASSED";
                return (
                  <div key={code} className="flex items-start gap-2 text-[#F5F5F5]">
                    {verdict === undefined ? (
                      <span
                        className="w-4 h-4 shrink-0 text-center font-mono text-[11px] leading-4 text-[#737373]"
                        aria-hidden="true"
                      >
                        –
                      </span>
                    ) : failed ? (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                    )}
                    <span className="font-mono">
                      {code} · {label}
                      {failed ? (
                        <span className="block text-[11px] text-red-300 mt-0.5">{verdict}</span>
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-[#A3A3A3] mt-5 leading-relaxed">
              {simulationResult
                ? "These verdicts were returned by the deterministic engine for the run above."
                : "Run a simulation to obtain this run's verdict for each invariant."}
            </p>
          </div>

          <div className="text-xs text-[#737373] mt-6 flex items-center justify-between">
            <span>Fail-closed deterministic gate</span>
            <span className="font-mono text-emerald-400">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Candidate Strategies Section */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#F5F5F5]">
              Candidate strategies
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Select a strategy to simulate and compute deterministic safety verification.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs font-mono text-[#F5F5F5] bg-[#252525] border border-[#383838] px-3 py-1.5 rounded-lg hover:border-[#FF6B35] transition-colors cursor-pointer"
            >
              {showComparison ? "Hide Comparison Table" : "Compare Strategies Matrix"}
            </button>
            <span className="text-xs font-mono text-[#A3A3A3]">
              Selected: <strong className="text-[#FF6B35]">{selectedStrategyCode}</strong>
            </span>
          </div>
        </div>

        {/* Optional Side-by-side Strategy Matrix */}
        {showComparison && (
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 mb-5 overflow-x-auto">
            <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider font-mono mb-3 text-[#FF6B35]">
              Deterministic Strategy Trade-off Matrix
            </h3>
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#383838] text-[#737373] uppercase">
                  <th className="pb-2.5">Code</th>
                  <th className="pb-2.5">Strategy Name</th>
                  <th className="pb-2.5">Security Benefit</th>
                  <th className="pb-2.5">Downtime</th>
                  <th className="pb-2.5">Safety Rule Gate</th>
                  <th className="pb-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/60">
                {strategies.map((s) => (
                  <tr key={s.code} className="hover:bg-[#2C2C2C]/50">
                    <td className="py-2.5 font-bold text-[#FF6B35]">{s.code}</td>
                    <td className="py-2.5 text-[#F5F5F5] font-sans font-medium">{s.name}</td>
                    <td className="py-2.5 text-[#F5F5F5]">{s.securityBenefitScore}%</td>
                    <td className="py-2.5">
                      <span className={s.simulatedDowntimeMinutes === 0 ? "text-emerald-400 font-bold" : "text-amber-400"}>
                        {s.simulatedDowntimeMinutes} min
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.safetyPolicyStatus === "PASSED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {s.safetyPolicyStatus}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedStrategyCode(s.code)}
                        className={`text-[11px] px-2.5 py-1 rounded cursor-pointer ${
                          selectedStrategyCode === s.code
                            ? "bg-[#FF6B35] text-white font-bold"
                            : "bg-[#1E1E1E] text-[#A3A3A3] hover:text-[#F5F5F5]"
                        }`}
                      >
                        {selectedStrategyCode === s.code ? "Selected" : "Select"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategies.map((strat) => {
            const isSelected = strat.code === selectedStrategyCode;
            return (
              <label
                key={strat.id}
                className={`bg-[#252525] rounded-xl p-5 cursor-pointer transition-all border block focus-within:ring-1 focus-within:ring-[#FF6B35] ${
                  isSelected
                    ? "border-[#FF6B35] ring-1 ring-[#FF6B35]/30 bg-[#2A2421]"
                    : "border-[#383838] hover:border-[#4B4B4B]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="strategy"
                      checked={isSelected}
                      onChange={() => setSelectedStrategyCode(strat.code)}
                      className="accent-[#FF6B35] min-w-5 min-h-5 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-[#FF6B35]">
                      {strat.code}
                    </span>
                  </div>
                  {strat.isAiRecommended && (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      RECOMMENDED
                    </span>
                  )}
                  {strat.safetyPolicyStatus === "VIOLATION_BLOCKED" && (
                    <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      VIOLATION RISK
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-[#F5F5F5] mt-3">
                  {strat.name}
                </h3>
                <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
                  {strat.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#383838] text-[11px] font-mono">
                  <div>
                    <span className="text-[#737373] block">Benefit:</span>
                    <span className="text-[#F5F5F5] font-bold">{strat.securityBenefitScore}%</span>
                  </div>
                  <div>
                    <span className="text-[#737373] block">Downtime:</span>
                    <span className="text-[#F5F5F5] font-bold">{strat.simulatedDowntimeMinutes}m</span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] font-mono">
                  {isSelected ? (
                    <span className="text-[#FF6B35]">● Selected for evaluation</span>
                  ) : (
                    <span className="text-[#737373]">Select this candidate</span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Evidence and Assumptions */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-6">
        <h2 className="text-base font-semibold text-[#F5F5F5]">Scenario grounding</h2>
        <div className="font-mono text-xs text-[#FF6B35] mt-2">{activeScenario.id}</div>
        <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
          {activeScenario.summary}
        </p>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="text-[#737373]">Primary asset</dt>
            <dd className="font-mono text-[#F5F5F5]">{activeScenario.targetAsset}</dd>
          </div>
          <div>
            <dt className="text-[#737373]">Synthetic identity</dt>
            <dd className="font-mono text-[#F5F5F5]">{activeScenario.syntheticIdentity}</dd>
          </div>
          <div>
            <dt className="text-[#737373]">Affected services</dt>
            <dd className="font-mono text-[#F5F5F5]">
              {activeScenario.affectedServices.join(", ") || "none"}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-[#737373] mt-4 leading-relaxed">
          Every asset in this scenario is virtual. The engine never resolves a hostname, opens a
          socket or issues a containment command.
        </p>
      </div>

      {/* Persistent System Status Bar */}
      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>GARDA-SIM AI Deterministic Engine v1.0 · Synthetic IT/OT Boundary</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>REST API: {loadError ? "DEGRADED" : "CONNECTED"}</span>
          <span>SAFETY INVARIANTS: ENFORCED</span>
          <span>AUDIT LOG: APPEND-ONLY</span>
        </div>
      </div>
    </>
  );
}

export default function ResponseSimulatorPage() {
  return (
    <React.Suspense fallback={<SimulatorSkeleton />}>
      <SimulatorView />
    </React.Suspense>
  );
}
