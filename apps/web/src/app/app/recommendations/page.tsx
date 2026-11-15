"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  ApiError,
  loadFailureHint,
  CandidateStrategy,
  ReviewDecision,
  ReviewResponse,
  SessionInfo,
  SyntheticIncident,
  fetchIncidents,
  fetchSession,
  fetchStrategies,
  submitReview,
} from "@/lib/api-client";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCardGrid,
  SkeletonPage,
  SkeletonRows,
} from "@/components/ui/skeleton";

type DecisionState = "Pending Review" | ReviewDecision;

interface Recommendation {
  key: string;
  scenario: string;
  asset: string;
  strategy: CandidateStrategy;
}

export default function RecommendationsPage() {
  const [incidents, setIncidents] = React.useState<SyntheticIncident[]>([]);
  const [strategies, setStrategies] = React.useState<CandidateStrategy[]>([]);
  const [session, setSession] = React.useState<SessionInfo | null>(null);
  const [scenarioId, setScenarioId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const [filterTab, setFilterTab] = React.useState<"all" | "pending" | "approved" | "blocked">("all");
  const [decisions, setDecisions] = React.useState<Record<string, DecisionState>>({});
  const [notes, setNotes] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [reviewResult, setReviewResult] = React.useState<ReviewResponse | null>(null);
  const [reviewError, setReviewError] = React.useState<string | null>(null);

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
        const first = incidentData[0];
        setScenarioId(first?.id ?? "");
        if (first) setSelectedKey(`${first.id}/${strategyData[0]?.code ?? ""}`);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? loadFailureHint(err) : "Could not load candidate strategies."
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const scenario = incidents.find((incident) => incident.id === scenarioId);

  const recommendations: Recommendation[] = React.useMemo(() => {
    if (!scenario) return [];
    return strategies.map((strategy) => ({
      key: `${scenario.id}/${strategy.code}`,
      scenario: scenario.id,
      asset: scenario.targetAsset,
      strategy,
    }));
  }, [scenario, strategies]);

  const selected =
    recommendations.find((rec) => rec.key === selectedKey) ?? recommendations[0] ?? null;
  const currentDecision: DecisionState = selected
    ? decisions[selected.key] ?? "Pending Review"
    : "Pending Review";

  const handleDecision = async (decision: ReviewDecision) => {
    if (!selected) return;
    setReviewResult(null);
    setReviewError(null);
    setIsSubmitting(true);
    try {
      const response = await submitReview({
        scenario_id: selected.scenario,
        strategy_code: selected.strategy.code,
        decision,
        notes,
      });
      setDecisions((previous) => ({ ...previous, [selected.key]: decision }));
      setReviewResult(response);
    } catch (err) {
      // A failed request must never render as a recorded decision.
      setReviewError(
        err instanceof ApiError
          ? err.message
          : "The review could not be recorded. The decision was not saved."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecs = recommendations.filter((rec) => {
    const decision = decisions[rec.key] ?? "Pending Review";
    if (filterTab === "pending") return decision === "Pending Review";
    if (filterTab === "approved") return decision === "Approved for Demonstration";
    if (filterTab === "blocked")
      return rec.strategy.safetyPolicyStatus === "VIOLATION_BLOCKED" || decision === "Rejected";
    return true;
  });

  const pendingCount = recommendations.filter(
    (rec) => (decisions[rec.key] ?? "Pending Review") === "Pending Review"
  ).length;
  const reviewedCount = recommendations.length - pendingCount;
  const blockedCount = recommendations.filter(
    (rec) => rec.strategy.safetyPolicyStatus === "VIOLATION_BLOCKED"
  ).length;

  if (isLoading) {
    return (
      <SkeletonPage label="Loading candidate strategies from the deterministic engine">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard />
        </div>
      </SkeletonPage>
    );
  }

  if (loadError || !selected) {
    return (
      <>
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Review queue unavailable</p>
            <p className="mt-1">{loadError ?? "No candidate strategy is available."}</p>
            <p className="mt-2 text-[#A3A3A3]">
              No candidate is invented client-side; the queue is whatever the API returns.
            </p>
          </div>
        </div>
      </>
    );
  }

  const isBlocked = selected.strategy.safetyPolicyStatus === "VIOLATION_BLOCKED";

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            HUMAN-IN-THE-LOOP ACTIVE
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Defensive response review · candidate rationales are authored fixtures; no model is
          connected in this build
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/recommendations</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
            Decision Support &amp; Review
          </h1>
          <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
            Inspect candidate rationale, deterministic policy verdicts and blast radius before
            human authorization. The API refuses an approval for any policy-blocked strategy.
          </p>
        </div>

        <Link
          href="/app/simulator"
          className="bg-[#252525] border border-[#383838] hover:border-[#FF6B35] text-xs text-[#F5F5F5] px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Open Simulator</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FF6B35]" aria-hidden="true" />
        </Link>
      </div>

      {/* Scenario selector — strategies are evaluated per scenario. */}
      <div className="mt-4 bg-[#252525] border border-[#383838] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <label htmlFor="rec-scenario" className="text-[11px] text-[#737373]">
          Scenario
        </label>
        <select
          id="rec-scenario"
          value={scenarioId}
          onChange={(event) => {
            setScenarioId(event.target.value);
            setSelectedKey(`${event.target.value}/${strategies[0]?.code ?? ""}`);
            setReviewResult(null);
            setReviewError(null);
          }}
          className="flex-1 bg-transparent text-xs font-mono text-[#F5F5F5] focus:outline-none cursor-pointer"
        >
          {incidents.map((incident) => (
            <option key={incident.id} value={incident.id} className="bg-[#252525]">
              {incident.id} — {incident.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#383838] text-xs">
        <div className="flex items-center gap-6" role="tablist" aria-label="Filter candidates">
          {(
            [
              ["all", `All Candidates · ${recommendations.length}`],
              ["pending", `Pending Review · ${pendingCount}`],
              ["approved", "Approved"],
              ["blocked", `Safety Blocked · ${blockedCount}`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filterTab === value}
              onClick={() => setFilterTab(value)}
              className={`pb-2.5 transition-colors cursor-pointer ${
                filterTab === value
                  ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
                  : "text-[#A3A3A3] hover:text-[#F5F5F5]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#737373] pb-2.5">
          Pending: <strong className="text-amber-400">{pendingCount}</strong> | Reviewed:{" "}
          <strong className="text-emerald-400">{reviewedCount}</strong>
        </span>
      </div>

      {reviewError ? (
        <div
          role="alert"
          className="mt-5 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5"
        >
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{reviewError}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
        <div className="lg:col-span-4 space-y-3">
          {filteredRecs.length === 0 ? (
            <p className="text-xs text-[#737373]">No candidate matches this filter.</p>
          ) : null}
          {filteredRecs.map((rec) => {
            const isSelected = selected.key === rec.key;
            const decision = decisions[rec.key] ?? "Pending Review";
            return (
              <div
                key={rec.key}
                className={`bg-[#252525] rounded-xl p-5 border transition-all ${
                  isSelected
                    ? "border-[#FF6B35] bg-[#2A2421] ring-1 ring-[#FF6B35]/30"
                    : "border-[#383838] hover:border-[#4B4B4B]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedKey(rec.key);
                    setReviewResult(null);
                    setReviewError(null);
                  }}
                  className="w-full text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6B35]"
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span
                      className={
                        decision === "Approved for Demonstration"
                          ? "text-emerald-400 font-bold"
                          : decision === "Rejected"
                            ? "text-red-400 font-bold"
                            : "text-[#FF6B35]"
                      }
                    >
                      · {decision}
                    </span>
                    {rec.strategy.isAiRecommended ? (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        AUTHOR FLAGGED
                      </span>
                    ) : null}
                    {rec.strategy.safetyPolicyStatus === "VIOLATION_BLOCKED" ? (
                      <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        SAFETY BLOCKED
                      </span>
                    ) : null}
                  </div>

                  <div className="text-xs font-mono text-[#A3A3A3] mt-2">
                    {rec.scenario} · {rec.strategy.code}
                  </div>

                  <h2 className="text-sm font-bold text-[#F5F5F5] mt-1 leading-snug">
                    {rec.strategy.name}
                  </h2>

                  <div className="text-xs text-[#A3A3A3] mt-3 pt-3 border-t border-white/5 flex items-center justify-between font-mono">
                    <span>
                      Benefit:{" "}
                      <strong className="text-white">
                        {rec.strategy.securityBenefitScore}%
                      </strong>
                    </span>
                    <span>
                      Downtime:{" "}
                      <strong
                        className={
                          rec.strategy.simulatedDowntimeMinutes === 0
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }
                      >
                        {rec.strategy.simulatedDowntimeMinutes}m
                      </strong>
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase font-mono">
                {selected.scenario} / {selected.strategy.code}
              </span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                  currentDecision === "Approved for Demonstration"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : currentDecision === "Rejected"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                STATUS: {currentDecision.toUpperCase()}
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#F5F5F5] mt-2">{selected.strategy.name}</h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A3A3] mt-2">
              <span>· Target Scenario: {selected.scenario}</span>
              <span>· Evaluated Asset: {selected.asset}</span>
              <span>· Safety Gate: {selected.strategy.safetyPolicyStatus}</span>
            </div>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase mb-2">
              Authored strategy rationale · synthetic fixture, no model connected
            </div>
            <blockquote className="text-xs text-[#F5F5F5] italic leading-relaxed pl-3 border-l-2 border-[#FF6B35]">
              &ldquo;{selected.strategy.aiRationale}&rdquo;
            </blockquote>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#A3A3A3]">
              <strong className="text-white block mb-1">Modelled operational impact:</strong>
              <p>
                {selected.strategy.impactedServices.length > 0
                  ? `Affected services: ${selected.strategy.impactedServices.join(", ")}. `
                  : "No service impact is modelled for this strategy. "}
                {selected.strategy.safetyViolationReason
                  ? `Deterministic verdict: ${selected.strategy.safetyViolationReason}`
                  : `Recovery effort: ${selected.strategy.recoveryEffort}.`}
              </p>
            </div>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Operator Sign-off &amp; Demonstration Decision
            </h2>
            <div className="text-xs font-mono mt-1 text-[#FF6B35]">
              Operator: {session?.operator_id ?? "—"} · clearance level {session?.clearance ?? "—"}
            </div>

            {isBlocked ? (
              <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  The deterministic policy blocks this strategy. Approval is disabled here and the
                  API returns 403 if a request attempts it anyway. Rejection and &ldquo;Requires
                  More Evidence&rdquo; remain available.
                </span>
              </div>
            ) : null}

            {reviewResult ? (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <FileCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>Decision recorded in the append-only ledger</span>
                </div>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-[#A3A3A3]">
                  <div>
                    Audit ID: <span className="text-[#F5F5F5]">{reviewResult.audit_id}</span>
                  </div>
                  <div>
                    Decision: <span className="text-emerald-300 font-bold">{reviewResult.decision}</span>
                  </div>
                  <div>
                    Recorded at: <span className="text-[#F5F5F5]">{reviewResult.recorded_at}</span>
                  </div>
                  <div>
                    Chain verified after write:{" "}
                    <span className={reviewResult.chain_verified ? "text-emerald-300" : "text-red-300"}>
                      {reviewResult.chain_verified ? "yes" : "no"}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <Link
                    href="/app/audit-trail"
                    className="text-[#FF6B35] hover:underline inline-flex items-center gap-1 font-sans"
                  >
                    <span>View in Audit Trail</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="mt-4">
              <label htmlFor="rec-notes" className="block text-xs text-[#A3A3A3] mb-1.5">
                Analyst justification notes
              </label>
              <textarea
                id="rec-notes"
                rows={2}
                maxLength={2000}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Record the reasoning for this decision."
                className="w-full bg-[#1C1C1C] border border-[#383838] rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => void handleDecision("Approved for Demonstration")}
                disabled={isSubmitting || isBlocked}
                className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>Approve for Demonstration</span>
              </button>

              <button
                type="button"
                onClick={() => void handleDecision("Rejected")}
                disabled={isSubmitting}
                className="text-xs text-[#F5F5F5] border border-[#383838] px-3.5 py-2 rounded-lg hover:border-red-500 hover:text-red-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
                <span>Reject Strategy</span>
              </button>

              <button
                type="button"
                onClick={() => void handleDecision("Requires More Evidence")}
                disabled={isSubmitting}
                className="text-xs text-[#A3A3A3] underline hover:text-[#FF6B35] transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Request More Evidence</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>
            GARDA-SIM AI Human-in-the-Loop Review Engine · Operator:{" "}
            {session?.operator_id ?? "—"}
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>EVALUATED: {recommendations.length} CANDIDATES</span>
          <span>LEDGER: APPEND-ONLY</span>
        </div>
      </div>
    </>
  );
}
