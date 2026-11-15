"use client";

import * as React from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Play,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  ApiError,
  loadFailureHint,
  CandidateStrategy,
  SimulationResult,
  SyntheticIncident,
  fetchIncidents,
  fetchStrategies,
  runSimulation,
} from "@/lib/api-client";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCardGrid,
  SkeletonPage,
  SkeletonRows,
} from "@/components/ui/skeleton";

/**
 * This page runs the *real* deterministic engine N times per candidate strategy and reports
 * only what it observes:
 *   - measured: wall-clock latency of each POST /api/simulate round-trip
 *   - observed: the safety rule verdicts and policy status the engine returned
 *   - modelled: the benefit/downtime figures that live in the strategy profile
 * It deliberately does not report containment accuracy or "blast radius accuracy", because no
 * ground truth exists to measure them against in this synthetic prototype.
 */

interface MeasuredMethod {
  code: string;
  name: string;
  modelledBenefit: number;
  modelledDowntime: number;
  recoveryEffort: string;
  safetyStatus: string;
  violationReason: string | null;
  failedRules: string[];
  latencySamples: number[];
  medianLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  auditIds: string[];
}

const REPETITION_OPTIONS = [5, 10, 20] as const;

const median = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[middle - 1] + sorted[middle]) / 2)
    : sorted[middle];
};

export default function ExperimentsPage() {
  const [incidents, setIncidents] = React.useState<SyntheticIncident[]>([]);
  const [strategies, setStrategies] = React.useState<CandidateStrategy[]>([]);
  const [scenarioId, setScenarioId] = React.useState<string>("");
  const [repetitions, setRepetitions] = React.useState<number>(5);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [runError, setRunError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<MeasuredMethod[] | null>(null);
  const [selectedCode, setSelectedCode] = React.useState<string | null>(null);
  const [completedAt, setCompletedAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [incidentData, strategyData] = await Promise.all([
          fetchIncidents(),
          fetchStrategies(),
        ]);
        if (cancelled) return;
        setIncidents(incidentData);
        setStrategies(strategyData);
        setScenarioId(incidentData[0]?.id ?? "");
        setSelectedCode(strategyData[0]?.code ?? null);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? loadFailureHint(err) : "Could not load scenarios and strategies."
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

  const scenario = incidents.find((incident) => incident.id === scenarioId) ?? null;

  const handleRunBenchmark = async () => {
    if (!scenario || strategies.length === 0) return;
    setIsRunning(true);
    setRunError(null);
    setResults(null);

    try {
      const collected: MeasuredMethod[] = [];

      for (const strategy of strategies) {
        const samples: number[] = [];
        const auditIds: string[] = [];
        let last: SimulationResult | null = null;

        for (let attempt = 0; attempt < repetitions; attempt += 1) {
          const startedAt = performance.now();
          const response = await runSimulation({
            scenario_id: scenario.id,
            strategy_code: strategy.code,
            target_asset: scenario.targetAsset,
          });
          samples.push(Math.round(performance.now() - startedAt));
          if (response.audit_id) auditIds.push(response.audit_id);
          last = response;
        }

        if (!last) continue;

        const failedRules = Object.entries(last.evaluated_rules ?? {})
          .filter(([, verdict]) => verdict !== "PASSED")
          .map(([code]) => code);

        collected.push({
          code: strategy.code,
          name: strategy.name,
          modelledBenefit: last.security_benefit_score,
          modelledDowntime: last.simulated_downtime_minutes,
          recoveryEffort: strategy.recoveryEffort,
          safetyStatus: last.safety_policy_status,
          violationReason: last.safety_violation_reason ?? null,
          failedRules,
          latencySamples: samples,
          medianLatencyMs: median(samples),
          minLatencyMs: Math.min(...samples),
          maxLatencyMs: Math.max(...samples),
          auditIds,
        });
      }

      setResults(collected);
      setCompletedAt(new Date().toISOString());
      if (collected.length > 0 && !collected.some((item) => item.code === selectedCode)) {
        setSelectedCode(collected[0].code);
      }
    } catch (err) {
      setRunError(
        err instanceof ApiError
          ? err.message
          : "The evaluation run failed. No results were recorded."
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadBenchmark = () => {
    if (!results || !scenario) return;
    const payload = {
      report: "Deterministic strategy evaluation — measured run",
      classification: "SYNTHETIC SIMULATION ONLY",
      scenario: {
        id: scenario.id,
        title: scenario.title,
        target_asset: scenario.targetAsset,
      },
      repetitions_per_strategy: repetitions,
      completed_at: completedAt,
      measured: "latency_ms is the wall-clock duration of each POST /api/simulate round-trip",
      modelled:
        "security_benefit_score and simulated_downtime_minutes come from the strategy profile; they are modelled values, not field measurements",
      not_measured:
        "containment accuracy and blast-radius accuracy are not reported because this prototype has no ground truth to measure them against",
      results: results.map((item) => ({
        code: item.code,
        name: item.name,
        safety_policy_status: item.safetyStatus,
        failed_rules: item.failedRules,
        modelled_benefit_percent: item.modelledBenefit,
        modelled_downtime_minutes: item.modelledDowntime,
        recovery_effort: item.recoveryEffort,
        latency_samples_ms: item.latencySamples,
        latency_median_ms: item.medianLatencyMs,
        latency_min_ms: item.minLatencyMs,
        latency_max_ms: item.maxLatencyMs,
        audit_ids: item.auditIds,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `garda-sim-evaluation-${Date.now()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const selected = results?.find((item) => item.code === selectedCode) ?? results?.[0] ?? null;

  if (isLoading) {
    return (
      <SkeletonPage label="Loading scenarios and candidate strategies">
        <SkeletonCardGrid count={3} />
        <SkeletonRows className="mt-4" rows={3} />
      </SkeletonPage>
    );
  }

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            MEASURED RUN HARNESS
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Repeated deterministic evaluation · Latency is measured; benefit and downtime are
          modelled profile values
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/experiments</div>
      </div>

      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Methodology Benchmark &amp; Evaluation
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Runs the deterministic engine repeatedly against every candidate strategy and reports
          the observed safety verdicts plus the measured round-trip latency of each call.
        </p>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="mt-5 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Evaluation inputs unavailable</p>
            <p className="mt-1">{loadError}</p>
            <p className="mt-2 text-[#A3A3A3]">
              Nothing is pre-filled: the harness has no inputs to evaluate without the API.
            </p>
          </div>
        </div>
      ) : null}

      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-6">
        <h2 className="text-sm font-semibold text-[#F5F5F5] mb-4">Run Configuration</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3">
            <label htmlFor="exp-scenario" className="block text-[11px] text-[#737373] mb-1">
              Target scenario
            </label>
            <select
              id="exp-scenario"
              value={scenarioId}
              onChange={(event) => setScenarioId(event.target.value)}
              className="w-full bg-transparent text-xs font-mono text-[#F5F5F5] font-medium focus:outline-none cursor-pointer"
            >
              {incidents.map((incident) => (
                <option key={incident.id} value={incident.id} className="bg-[#252525]">
                  {incident.id} ({incident.targetAsset})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3">
            <label htmlFor="exp-repetitions" className="block text-[11px] text-[#737373] mb-1">
              Repetitions per strategy
            </label>
            <select
              id="exp-repetitions"
              value={repetitions}
              onChange={(event) => setRepetitions(Number(event.target.value))}
              className="w-full bg-transparent text-xs text-[#F5F5F5] font-medium focus:outline-none cursor-pointer"
            >
              {REPETITION_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[#252525]">
                  {option} iterations
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3">
            <span className="block text-[11px] text-[#737373] mb-1">Candidates in scope</span>
            <span className="text-xs font-mono text-[#F5F5F5]">
              {strategies.length} strategies · {strategies.length * repetitions} simulated runs
            </span>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-[#737373] leading-relaxed">
          Every iteration is a real <code className="font-mono">POST /api/simulate</code> call and
          is appended to the audit ledger, so this harness adds {strategies.length * repetitions}{" "}
          ledger entries per run.
        </p>

        <div className="mt-5 pt-4 border-t border-[#383838] flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => void handleRunBenchmark()}
            disabled={isRunning || !scenario}
            className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>Running {strategies.length * repetitions} simulations…</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
                <span>Run Evaluation</span>
              </>
            )}
          </button>

          {results ? (
            <button
              type="button"
              onClick={handleDownloadBenchmark}
              className="bg-[#1E1E1E] hover:bg-[#2C2C2C] border border-[#383838] text-xs text-[#F5F5F5] px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download Run JSON</span>
            </button>
          ) : null}
        </div>
      </div>

      {runError ? (
        <div
          role="alert"
          className="mt-5 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5"
        >
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{runError}</span>
        </div>
      ) : null}

      {results ? (
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((item) => {
              const isSelected = selected?.code === item.code;
              const passed = item.failedRules.length === 0;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setSelectedCode(item.code)}
                  className={`text-left bg-[#252525] rounded-xl p-5 border transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6B35] ${
                    isSelected
                      ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/40 bg-[#2A2421]"
                      : passed
                        ? "border-emerald-500/40 hover:border-emerald-500/70"
                        : "border-[#383838] hover:border-[#555]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#FF6B35]">
                      {item.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        passed
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {item.safetyStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F5F5F5] mt-2 leading-snug">
                    {item.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[#737373] block text-[11px]">Modelled downtime</span>
                      <span
                        className={`font-mono font-bold ${
                          item.modelledDowntime === 0 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {item.modelledDowntime} min
                      </span>
                    </div>
                    <div>
                      <span className="text-[#737373] block text-[11px]">Failed rules</span>
                      <span
                        className={`font-mono font-bold ${
                          passed ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {item.failedRules.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#737373] block text-[11px]">Median latency</span>
                      <span className="font-mono font-bold text-[#F5F5F5]">
                        {item.medianLatencyMs} ms
                      </span>
                    </div>
                    <div>
                      <span className="text-[#737373] block text-[11px]">Modelled benefit</span>
                      <span className="font-mono text-[#A3A3A3]">{item.modelledBenefit}%</span>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] font-mono text-[#737373]">
                    {isSelected ? "● Inspecting" : "Select for breakdown"}
                  </div>
                </button>
              );
            })}
          </div>

          {selected ? (
            <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#FF6B35] uppercase">
                  Breakdown · {selected.code}
                </span>
                <span className="text-xs font-mono text-[#A3A3A3]">
                  Scenario: {scenario?.id ?? "—"} · {selected.latencySamples.length} measured runs
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-[#F5F5F5] leading-relaxed">
                  {selected.failedRules.length === 0 ? (
                    <>
                      <strong className="text-emerald-400">All five invariants passed.</strong>{" "}
                      The engine returned a clean verdict across every iteration. Modelled
                      downtime is {selected.modelledDowntime} minutes with a modelled benefit of{" "}
                      {selected.modelledBenefit}%.
                    </>
                  ) : (
                    <>
                      <strong className="text-red-400">Blocked by deterministic policy.</strong>{" "}
                      {selected.violationReason ??
                        `Failing invariants: ${selected.failedRules.join(", ")}.`}{" "}
                      The candidate keeps its modelled figures, but the safety gate refuses it.
                    </>
                  )}
                </p>
                <div className="text-[11px] font-mono text-[#737373]">
                  Failed rules:{" "}
                  {selected.failedRules.length > 0 ? selected.failedRules.join(", ") : "none"} ·
                  Latency min/median/max: {selected.minLatencyMs} / {selected.medianLatencyMs} /{" "}
                  {selected.maxLatencyMs} ms · Recovery effort: {selected.recoveryEffort}
                </div>
                <div className="text-[11px] font-mono text-[#737373]">
                  Ledger entries written: {selected.auditIds.length}
                  {selected.auditIds.length > 0
                    ? ` (first: ${selected.auditIds[0]}, last: ${
                        selected.auditIds[selected.auditIds.length - 1]
                      })`
                    : ""}
                </div>
              </div>
            </div>
          ) : null}

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#F5F5F5] mb-1">Observed Evaluation Matrix</h2>
            <p className="text-[11px] text-[#737373] mb-4">
              Latency is measured. Benefit and downtime are modelled profile values. Containment
              and blast-radius accuracy are intentionally absent: this prototype has no ground
              truth to measure them against.
            </p>

            {/* Below md the six-column matrix becomes one card per strategy. */}
            <ul className="md:hidden space-y-2">
              {results.map((item) => (
                <li key={item.code} className="rounded-lg border border-[#383838] bg-[#1F1F1F] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-sans text-sm font-medium text-[#F5F5F5]">{item.name}</div>
                      <div className="font-mono text-[11px] text-[#737373]">{item.code}</div>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                        item.failedRules.length === 0
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {item.safetyStatus}
                    </span>
                  </div>
                  <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[11px]">
                    <div>
                      <dt className="text-[#737373]">Failed rules</dt>
                      <dd className="mt-0.5">
                        {item.failedRules.length === 0 ? (
                          <span className="text-emerald-400">none</span>
                        ) : (
                          <span className="text-red-400 break-words">{item.failedRules.join(", ")}</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#737373]">Median latency</dt>
                      <dd className="mt-0.5 text-[#F5F5F5]">{item.medianLatencyMs} ms</dd>
                    </div>
                    <div>
                      <dt className="text-[#737373]">Modelled benefit</dt>
                      <dd className="mt-0.5 text-[#F5F5F5]">{item.modelledBenefit}%</dd>
                    </div>
                    <div>
                      <dt className="text-[#737373]">Modelled downtime</dt>
                      <dd className={`mt-0.5 ${item.modelledDowntime === 0 ? "text-emerald-400 font-bold" : "text-amber-400"}`}>
                        {item.modelledDowntime} min
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#383838] text-[#737373] uppercase">
                    <th className="pb-3">Strategy</th>
                    <th className="pb-3">Policy verdict</th>
                    <th className="pb-3">Failed rules</th>
                    <th className="pb-3">Modelled benefit</th>
                    <th className="pb-3">Modelled downtime</th>
                    <th className="pb-3">Median latency (measured)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#383838]/60">
                  {results.map((item) => (
                    <tr key={item.code} className="hover:bg-[#2C2C2C]/50 transition-colors">
                      <td className="py-3.5 font-sans font-medium text-[#F5F5F5]">
                        <div>{item.name}</div>
                        <span className="text-[11px] font-mono text-[#737373]">{item.code}</span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                            item.failedRules.length === 0
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {item.safetyStatus}
                        </span>
                      </td>
                      <td className="py-3.5">
                        {item.failedRules.length === 0 ? (
                          <span className="text-emerald-400 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> none
                          </span>
                        ) : (
                          <span className="text-red-400 inline-flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" aria-hidden="true" />{" "}
                            {item.failedRules.join(", ")}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-[#F5F5F5]">{item.modelledBenefit}%</td>
                      <td className="py-3.5">
                        <span
                          className={
                            item.modelledDowntime === 0
                              ? "text-emerald-400 font-bold"
                              : "text-amber-400"
                          }
                        >
                          {item.modelledDowntime} min
                        </span>
                      </td>
                      <td className="py-3.5 text-[#F5F5F5]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#737373]" aria-hidden="true" />
                          {item.medianLatencyMs} ms
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-8 text-center mt-6">
          <div className="w-12 h-12 rounded-full bg-[#1E1E1E] border border-[#383838] flex items-center justify-center mx-auto text-[#FF6B35] mb-3">
            <BarChart3 className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-[#F5F5F5]">No evaluation has been run</h2>
          <p className="text-xs text-[#A3A3A3] mt-2 max-w-lg mx-auto leading-relaxed">
            Click <strong className="text-[#F5F5F5]">Run Evaluation</strong> to call the
            deterministic engine once per strategy per repetition. The numbers that appear are
            the ones the engine actually returned; nothing is pre-filled.
          </p>
        </div>
      )}

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Deterministic evaluation harness · results are per-run, not benchmark claims</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>RUNS: {results ? results.reduce((sum, item) => sum + item.latencySamples.length, 0) : 0}</span>
          <span>COMPLETED: {completedAt ?? "—"}</span>
        </div>
      </div>
    </>
  );
}
