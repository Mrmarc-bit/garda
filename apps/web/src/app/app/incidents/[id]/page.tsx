"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";
import {
  ApiError,
  IncidentNoteResponse,
  SessionInfo,
  SyntheticEvidence,
  SyntheticIncident,
  fetchEvidence,
  fetchIncidents,
  fetchSession,
  recordIncidentNote,
} from "@/lib/api-client";

type TabKey = "summary" | "evidence" | "timeline" | "review";

const formatTimestamp = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return `${parsed.toISOString().replace("T", " ").replace(".000Z", "")} UTC`;
};

export default function IncidentDetailPage() {
  const params = useParams();
  const incidentId = typeof params?.id === "string" ? params.id : "";

  const [incidents, setIncidents] = React.useState<SyntheticIncident[]>([]);
  const [evidence, setEvidence] = React.useState<SyntheticEvidence[]>([]);
  const [session, setSession] = React.useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [activeTab, setActiveTab] = React.useState<TabKey>("summary");
  const [analystNote, setAnalystNote] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState<IncidentNoteResponse | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [incidentData, evidenceData, sessionData] = await Promise.all([
          fetchIncidents(),
          fetchEvidence(),
          fetchSession(),
        ]);
        if (cancelled) return;
        setIncidents(incidentData);
        setEvidence(evidenceData);
        setSession(sessionData);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Could not load the incident record."
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

  const incident = incidents.find((item) => item.id === incidentId) ?? null;

  /** Evidence correlated to this scenario's asset scope — the same source for every tab. */
  const scenarioEvidence = React.useMemo(() => {
    if (!incident) return [];
    const scope = new Set<string>([incident.targetAsset, ...incident.affectedServices]);
    return evidence.filter((item) => scope.has(item.associatedAsset));
  }, [incident, evidence]);

  const handleSaveNote = async () => {
    if (!incident) return;
    const trimmed = analystNote.trim();
    if (trimmed.length === 0) {
      setSaveError("Write something before recording the note.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    setSaved(null);
    try {
      const result = await recordIncidentNote(incident.id, trimmed);
      setSaved(result);
      setAnalystNote("");
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : "The note was not recorded. Nothing was written to the ledger."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span>Loading incident record…</span>
        </div>
      </>
    );
  }

  if (loadError || !incident) {
    return (
      <>
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Incident unavailable</p>
            <p className="mt-1">
              {loadError ?? `No synthetic scenario matches ${incidentId || "this route"}.`}
            </p>
            <Link href="/app/incidents" className="mt-3 inline-block text-[#FF6B35] hover:underline">
              Back to incident queue
            </Link>
          </div>
        </div>
      </>
    );
  }

  const tabs: Array<[TabKey, string]> = [
    ["summary", "Summary"],
    ["evidence", `Evidence · ${scenarioEvidence.length} records`],
    ["timeline", "Timeline"],
    ["review", "Review Context"],
  ];

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            INCIDENT RECORD LOADED
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Defensive incident repository · synthetic evidence isolated from real networks
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/incidents/{incident.id}</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">{incident.title}</h1>
          <p className="text-xs text-[#A3A3A3] mt-2">
            {incident.id} / Defensive Simulation Lab / ground-truth synthetic scenario
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/app/simulator?incident=${incident.id}`}
            className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Open Response Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/app/evidence"
            className="text-xs text-[#F5F5F5] bg-[#252525] border border-[#383838] px-3.5 py-2.5 rounded-lg hover:border-[#FF6B35] transition-colors"
          >
            View evidence
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-6 border-b border-[#383838] text-xs" role="tablist">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === key
                ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
                : "text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
        <div className="lg:col-span-7 space-y-4">
          {activeTab === "summary" && (
            <>
              <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
                <div className="text-[11px] font-mono text-[#FF6B35] font-bold">{incident.id}</div>
                <h2 className="text-xl font-bold text-[#F5F5F5] mt-1">{incident.title}</h2>

                <div className="flex flex-wrap items-center gap-3 text-xs mt-3">
                  <span
                    className={
                      incident.severity === "critical"
                        ? "text-red-400 font-bold uppercase"
                        : incident.severity === "warning"
                          ? "text-amber-400 font-bold uppercase"
                          : "text-[#A3A3A3] font-bold uppercase"
                    }
                  >
                    · {incident.severity}
                  </span>
                  <span className="text-emerald-400 font-mono">
                    · {incident.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-[#A3A3A3]">· virtual simulation lab</span>
                </div>

                <div className="space-y-1.5 text-xs mt-5">
                  <div>
                    <span className="text-[#A3A3A3]">Primary target asset / </span>
                    <span className="font-mono text-[#F5F5F5] font-bold">
                      {incident.targetAsset}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#A3A3A3]">Synthetic actor / </span>
                    <span className="font-mono text-[#F5F5F5]">{incident.syntheticIdentity}</span>
                  </div>
                  <div>
                    <span className="text-[#A3A3A3]">Affected services / </span>
                    <span className="font-mono text-amber-400">
                      {incident.affectedServices.length > 0
                        ? incident.affectedServices.join(", ")
                        : incident.targetAsset}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#383838]">
                  <div className="text-[11px] text-[#A3A3A3] mb-2 flex items-center justify-between">
                    <span>Authored confidence score</span>
                    <span className="font-mono text-[#FF6B35] font-bold">{incident.confidence}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#171717] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF6B35] rounded-full"
                      style={{ width: `${Math.round(incident.confidence * 100)}%` }}
                    />
                  </div>
                  <div className="font-mono text-xs text-[#737373] mt-2">
                    A fixture value from the synthetic scenario, not a computed probability.
                  </div>
                </div>
              </div>

              <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
                <h2 className="text-base font-semibold text-[#F5F5F5] mb-2">Scenario synopsis</h2>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">{incident.summary}</p>
                <div className="mt-4 pt-3 border-t border-[#383838] flex items-center justify-between text-xs font-mono text-[#737373]">
                  <span>Detection timestamp:</span>
                  <span className="text-[#F5F5F5]">{formatTimestamp(incident.detectedAt)}</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "evidence" && (
            <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-[#F5F5F5]">
                Correlated evidence probes
              </h2>
              {scenarioEvidence.length === 0 ? (
                <p className="text-xs text-[#737373]">
                  No evidence record is associated with this scenario&apos;s asset scope.
                </p>
              ) : (
                <div className="space-y-3 font-mono text-xs">
                  {scenarioEvidence.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#1C1C1C] border border-[#383838] rounded-lg"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[#FF6B35] font-bold mb-1">
                        <span>
                          {item.id} · {item.source}
                        </span>
                        <span className="text-[#737373] text-[11px]">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-[#F5F5F5] font-sans">{item.description}</p>
                      <div className="text-[11px] text-[#737373] mt-1">
                        {item.category} · {item.associatedAsset}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
              <h2 className="text-base font-semibold text-[#F5F5F5] mb-1">
                Synthetic event timeline
              </h2>
              <p className="text-[11px] text-[#737373] mb-5">
                Built from the same evidence records as the Evidence tab, ordered by timestamp.
              </p>

              {scenarioEvidence.length === 0 ? (
                <p className="text-xs text-[#737373]">No timestamped evidence for this scenario.</p>
              ) : (
                <div className="space-y-6">
                  {[...scenarioEvidence]
                    .sort(
                      (a, b) =>
                        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    )
                    .map((item) => (
                      <div key={item.id} className="space-y-1">
                        <div className="text-xs font-mono text-[#FF6B35]">
                          · {item.id} / {formatTimestamp(item.timestamp)}
                        </div>
                        <div className="text-sm font-semibold text-[#F5F5F5]">{item.source}</div>
                        <p className="text-xs text-[#A3A3A3]">{item.description}</p>
                        <div className="text-[11px] font-mono text-[#737373]">
                          {item.category} / {item.associatedAsset}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "review" && (
            <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-[#F5F5F5]">Analyst review protocol</h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Response actions for {incident.id} are governed by deterministic safety policy
                SEC-OT-01 through SEC-OT-05. No response can mutate a real network, and every
                approval requires an authorized operator.
              </p>
              <div className="p-4 rounded-lg bg-[#1C1C1C] border border-emerald-500/20 text-xs text-emerald-300 font-mono">
                SAFETY GATE: EVALUATED SERVER-SIDE ON EACH SIMULATION RUN
              </div>
              <Link
                href="/app/recommendations"
                className="inline-flex items-center gap-1 text-xs text-[#FF6B35] hover:underline"
              >
                <span>Open the review queue</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-base font-semibold text-[#F5F5F5] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF6B35]" aria-hidden="true" />
                <span>Analyst investigation note</span>
              </h2>
              {saved ? (
                <span className="text-[11px] font-mono text-emerald-400">
                  Recorded as {saved.audit_id}
                </span>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="incident-note" className="sr-only">
                Analyst investigation note
              </label>
              <textarea
                id="incident-note"
                value={analystNote}
                onChange={(event) => setAnalystNote(event.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Record the investigation rationale or review constraint…"
                className="w-full bg-[#1C1C1C] border border-[#383838] rounded-lg p-3 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#FF6B35]"
              />

              {saveError ? (
                <p role="alert" className="text-xs text-red-300">
                  {saveError}
                </p>
              ) : null}

              {saved ? (
                <p className="text-[11px] font-mono text-[#A3A3A3]">
                  Written to the append-only ledger at {saved.recorded_at}. Chain verified after
                  write: {saved.chain_verified ? "yes" : "no"}.
                </p>
              ) : null}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-[#737373]">
                  Author: <strong className="text-[#A3A3A3]">{session?.operator_id ?? "—"}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => void handleSaveNote()}
                  disabled={isSaving}
                  className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      <span>Recording…</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Save to Ledger</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#F5F5F5]">Evidence grounding</h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              {scenarioEvidence.length > 0
                ? `${scenarioEvidence
                    .map((item) => item.id)
                    .join(", ")} are the synthetic source facts bounded to this scenario's asset scope.`
                : "No synthetic evidence record is correlated with this scenario."}
            </p>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#F5F5F5]">Derived assessment</h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              The observed sequence is consistent with privilege misuse inside the virtual model.
              Intent and authorization context cannot be established from synthetic logs alone.
            </p>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#F5F5F5]">Decision support</h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Candidate rationales are authored fixtures in this build; no language model is
              connected. Operator authorization is non-bypassable, and the API refuses an approval
              for a policy-blocked strategy.
            </p>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              Downstream blast radius
            </div>
            <h2 className="text-sm font-semibold text-[#F5F5F5] mt-1">Possible operational impact</h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              {incident.affectedServices.length > 0
                ? `${incident.affectedServices.join(", ")} depend on ${incident.targetAsset}. A blanket isolation of the gateway would sever the modelled telemetry path.`
                : `${incident.targetAsset} has no modelled dependents.`}
            </p>
            <div className="text-xs text-emerald-400 mt-3 font-mono">
              ● Modelled dependency edges are shown in the digital twin
            </div>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#F5F5F5]">Audit context</h2>
            <div className="space-y-1.5 text-xs mt-3">
              <div>
                <span className="text-[#A3A3A3]">Operator / </span>
                <span className="font-mono text-[#F5F5F5]">{session?.operator_id ?? "—"}</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Active scenario / </span>
                <span className="font-mono text-[#F5F5F5]">{incident.id}</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Review state / </span>
                <span className="text-[#F5F5F5]">
                  {incident.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
              Notes saved here are appended to the HMAC-chained ledger. Earlier entries cannot be
              edited or deleted through the API.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Incident detail &amp; evidence ledger · {incident.id}</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>TARGET: {incident.targetAsset}</span>
          <span>EVIDENCE: {scenarioEvidence.length}</span>
          <span>OPERATOR: {session?.operator_id ?? "—"}</span>
        </div>
      </div>
    </>
  );
}
