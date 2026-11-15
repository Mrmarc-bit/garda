"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileCode,
  FileText,
  ShieldCheck,
  Table,
} from "lucide-react";
import {
  ApiError,
  loadFailureHint,
  AuditPage,
  CandidateStrategy,
  ChainVerification,
  SyntheticEvidence,
  SyntheticIncident,
  fetchAuditTrail,
  fetchEvidence,
  fetchIncidents,
  fetchStrategies,
  verifyAuditChain,
} from "@/lib/api-client";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCardGrid,
  SkeletonPage,
  SkeletonRows,
} from "@/components/ui/skeleton";

const AUDIT_EXPORT_LIMIT = 200;

type ExportTab = "all" | "audit" | "brief";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = React.useState<ExportTab>("all");
  const [downloadSuccess, setDownloadSuccess] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const [incidents, setIncidents] = React.useState<SyntheticIncident[]>([]);
  const [strategies, setStrategies] = React.useState<CandidateStrategy[]>([]);
  const [evidence, setEvidence] = React.useState<SyntheticEvidence[]>([]);
  const [auditPage, setAuditPage] = React.useState<AuditPage | null>(null);
  const [chain, setChain] = React.useState<ChainVerification | null>(null);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [incidentData, strategyData, evidenceData, auditData, chainData] =
        await Promise.all([
          fetchIncidents(),
          fetchStrategies(),
          fetchEvidence(),
          fetchAuditTrail(AUDIT_EXPORT_LIMIT, 0),
          verifyAuditChain(),
        ]);
      setIncidents(incidentData);
      setStrategies(strategyData);
      setEvidence(evidenceData);
      setAuditPage(auditData);
      setChain(chainData);
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? loadFailureHint(err) : "Could not load export source data."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const triggerDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const runExport = async (label: string, build: () => Promise<void>) => {
    setExportError(null);
    try {
      await build();
    } catch (err) {
      setDownloadSuccess(null);
      setExportError(
        err instanceof ApiError
          ? `${label} failed: ${err.message}`
          : `${label} failed. No file was generated.`
      );
    }
  };

  const downloadAuditJSON = () =>
    runExport("Audit ledger export", async () => {
      const page = await fetchAuditTrail(AUDIT_EXPORT_LIMIT, 0);
      const verification = await verifyAuditChain();
      const payload = {
        system: "GARDA-SIM AI",
        classification: "SYNTHETIC SIMULATION ONLY",
        export_version: "1.0.0",
        export_timestamp: new Date().toISOString(),
        ledger: {
          algorithm: verification.algorithm,
          chain_verified: verification.verified,
          checked_entries: verification.checked_entries,
          note: verification.note,
        },
        page: {
          exported_records: page.entries.length,
          total_records_in_ledger: page.total,
          limit: page.limit,
          offset: page.offset,
          truncated: page.entries.length < page.total,
        },
        records: page.entries,
      };
      triggerDownload(
        `garda-sim-audit-ledger-${Date.now()}.json`,
        JSON.stringify(payload, null, 2),
        "application/json"
      );
    });

  const downloadStrategyBriefMD = () =>
    runExport("Strategy brief export", async () => {
      const [incidentData, strategyData] = await Promise.all([
        fetchIncidents(),
        fetchStrategies(),
      ]);
      const primary = incidentData[0];
      const content = `# GARDA-SIM AI — Defensive Response Evaluation Brief

**Scenario:** ${primary?.id ?? "—"} (${primary?.title ?? "no scenario"})
**Target Asset:** ${primary?.targetAsset ?? "—"}
**Export Timestamp:** ${new Date().toISOString()}
**Classification:** SYNTHETIC SIMULATION ONLY — no real system was touched.

---

## 1. Executive Summary

${primary?.summary ?? "No scenario summary is available."}

## 2. Candidate Strategy Evaluation

${strategyData
  .map(
    (strategy) => `
### ${strategy.code}: ${strategy.name}

- **Security Benefit Score:** ${strategy.securityBenefitScore}%
- **Simulated Downtime:** ${strategy.simulatedDowntimeMinutes} minutes
- **Recovery Effort:** ${strategy.recoveryEffort}
- **Safety Policy Verdict:** ${strategy.safetyPolicyStatus}
${strategy.safetyViolationReason ? `- **Violation Reason:** ${strategy.safetyViolationReason}\n` : ""}- **Impacted Services:** ${
      strategy.impactedServices.length > 0
        ? strategy.impactedServices.join(", ")
        : "None (zero modelled blast radius)"
    }
- **Authored Rationale (synthetic fixture, no model connected):** ${strategy.aiRationale}
`
  )
  .join("\n")}

## 3. Policy Invariants

The five invariants (SEC-OT-01 to SEC-OT-05) are evaluated server-side on every simulation
run. Per-run verdicts are recorded in the audit ledger and are not restated here, because this
brief is generated from the strategy catalogue rather than from a specific run.

## 4. Human-in-the-Loop Sign-off

Candidate rationales are decision support only. Every response selection requires an authorized
human operator. The API refuses an approval request for a policy-blocked strategy.

## 5. Limitations

This brief is generated from synthetic fixtures. Scores are modelled values, not measurements
of a live environment.
`;
      triggerDownload(
        `garda-sim-strategy-brief-${Date.now()}.md`,
        content,
        "text/markdown"
      );
    });

  const downloadEvidenceCSV = () =>
    runExport("Evidence CSV export", async () => {
      const evidenceData = await fetchEvidence();
      const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
      let csv = "ID,Timestamp,Source,Category,Asset,Description\n";
      evidenceData.forEach((item) => {
        csv += `${item.id},${item.timestamp},${escape(item.source)},${escape(
          item.category
        )},${item.associatedAsset},${escape(item.description)}\n`;
      });
      triggerDownload(
        `garda-sim-evidence-log-${Date.now()}.csv`,
        csv,
        "text/csv"
      );
    });

  const primaryIncident = incidents[0] ?? null;
  const recommended = strategies.find((strategy) => strategy.isAiRecommended) ?? null;
  const blocked = strategies.filter(
    (strategy) => strategy.safetyPolicyStatus === "VIOLATION_BLOCKED"
  );

  if (isLoading) {
    return (
      <SkeletonPage label="Loading export sources from the simulation API">
        <SkeletonCardGrid count={3} />
        <SkeletonRows className="mt-4" rows={4} />
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
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            EXPORT GENERATOR ACTIVE
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Defensive simulation artifact export · Files are built in the browser from live API
          responses
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/reports</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
            Reports &amp; Artifact Exports
          </h1>
          <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
            Generate compliance artifacts, strategy evaluation summaries and audit ledger exports
            from the data the API actually returns.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="text-xs text-[#A3A3A3] border border-[#383838] hover:border-[#FF6B35] hover:text-[#FF6B35] px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          Refresh source data
        </button>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="mt-5 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Export sources unavailable</p>
            <p className="mt-1">{loadError}</p>
            <p className="mt-2 text-[#A3A3A3]">
              No placeholder report will be generated.
            </p>
          </div>
        </div>
      ) : null}

      {exportError ? (
        <div
          role="alert"
          className="mt-5 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{exportError}</span>
        </div>
      ) : null}

      {downloadSuccess ? (
        <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>
              Generated in the browser:{" "}
              <strong className="font-mono text-white">{downloadSuccess}</strong>
            </span>
          </div>
          <span className="text-[11px] text-emerald-300 font-mono">CLIENT-SIDE BLOB</span>
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-6 border-b border-[#383838] text-xs" role="tablist">
        {(
          [
            ["all", "All Available Reports · 3"],
            ["brief", "Strategy Briefs · 1"],
            ["audit", "Audit Ledgers · 1"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={activeTab === value}
            onClick={() => setActiveTab(value)}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === value
                ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
                : "text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {(activeTab === "all" || activeTab === "audit") && (
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between hover:border-[#FF6B35]/50 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-[#1E1E1E] text-emerald-400">
                  <FileCode className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  JSON · HMAC CHAIN
                </span>
              </div>

              <h2 className="text-base font-bold text-[#F5F5F5] mt-4">Audit Ledger Export</h2>
              <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
                Export recorded simulation runs, safety gate evaluations and human review
                authorizations, together with the chain verification result at export time.
              </p>

              <div className="mt-4 pt-3 border-t border-[#383838] text-[11px] font-mono text-[#737373] space-y-1">
                <div>
                  Records:{" "}
                  <span className="text-[#F5F5F5]">
                    {auditPage ? `${auditPage.total} events in ledger` : "—"}
                  </span>
                </div>
                <div>
                  Export window:{" "}
                  <span className="text-[#F5F5F5]">
                    newest {Math.min(AUDIT_EXPORT_LIMIT, auditPage?.total ?? 0)} records
                  </span>
                </div>
                <div>
                  Chain:{" "}
                  <span
                    className={
                      chain?.verified === true
                        ? "text-emerald-400"
                        : chain
                          ? "text-red-400"
                          : "text-[#737373]"
                    }
                  >
                    {chain ? (chain.verified ? "verified" : "BROKEN") : "not checked"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#383838]">
              <button
                type="button"
                onClick={() => void downloadAuditJSON()}
                className="w-full bg-[#FF6B35] text-white text-xs font-medium py-2.5 px-4 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download JSON Ledger</span>
              </button>
            </div>
          </div>
        )}

        {(activeTab === "all" || activeTab === "brief") && (
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between hover:border-[#FF6B35]/50 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-[#1E1E1E] text-[#FF6B35]">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#FF6B35] bg-[#FF6B35]/10 px-2 py-0.5 rounded border border-[#FF6B35]/20">
                  MARKDOWN · BRIEF
                </span>
              </div>

              <h2 className="text-base font-bold text-[#F5F5F5] mt-4">
                Strategy Evaluation Brief
              </h2>
              <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
                Markdown brief covering the scenario, candidate trade-offs, modelled blast radius
                and safety policy verdicts.
              </p>

              <div className="mt-4 pt-3 border-t border-[#383838] text-[11px] font-mono text-[#737373] space-y-1">
                <div>
                  Scope:{" "}
                  <span className="text-[#F5F5F5]">{primaryIncident?.id ?? "—"}</span>
                </div>
                <div>
                  Format: <span className="text-[#F5F5F5]">Formatted GFM (.md)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#383838]">
              <button
                type="button"
                onClick={() => void downloadStrategyBriefMD()}
                className="w-full bg-[#1E1E1E] border border-[#383838] hover:border-[#FF6B35] text-[#F5F5F5] hover:text-[#FF6B35] text-xs font-medium py-2.5 px-4 rounded-lg transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download Markdown Brief</span>
              </button>
            </div>
          </div>
        )}

        {(activeTab === "all" || activeTab === "brief") && (
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between hover:border-[#FF6B35]/50 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-[#1E1E1E] text-blue-400">
                  <Table className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  CSV · EVIDENCE
                </span>
              </div>

              <h2 className="text-base font-bold text-[#F5F5F5] mt-4">
                Synthetic Evidence Logs
              </h2>
              <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
                Comma-separated export of the synthetic evidence records currently served by the
                API.
              </p>

              <div className="mt-4 pt-3 border-t border-[#383838] text-[11px] font-mono text-[#737373] space-y-1">
                <div>
                  Records:{" "}
                  <span className="text-[#F5F5F5]">{evidence.length} evidence records</span>
                </div>
                <div>
                  Standard: <span className="text-[#F5F5F5]">RFC 4180 CSV</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#383838]">
              <button
                type="button"
                onClick={() => void downloadEvidenceCSV()}
                className="w-full bg-[#1E1E1E] border border-[#383838] hover:border-[#FF6B35] text-[#F5F5F5] hover:text-[#FF6B35] text-xs font-medium py-2.5 px-4 rounded-lg transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download Evidence CSV</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase font-mono">
              CURRENT STATE
            </div>
            <h2 className="text-base font-bold text-[#F5F5F5] mt-0.5">
              Export Source Summary
            </h2>
          </div>
          <span className="text-xs font-mono text-[#A3A3A3]">
            Scenario: {primaryIncident?.id ?? "—"} · Target: {primaryIncident?.targetAsset ?? "—"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#383838] text-[#737373] font-medium font-mono uppercase">
                <th className="py-2.5 font-medium">Dimension</th>
                <th className="py-2.5 font-medium">Value from API</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/60">
              <tr>
                <td className="py-3 font-medium text-[#A3A3A3]">Scenario</td>
                <td className="py-3 font-mono text-[#F5F5F5]">
                  {primaryIncident
                    ? `${primaryIncident.id} · ${primaryIncident.title}`
                    : "No scenario returned"}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[#A3A3A3]">Evidence records</td>
                <td className="py-3 font-mono text-[#F5F5F5]">
                  {evidence.length > 0
                    ? evidence.map((item) => item.id).join(" / ")
                    : "No evidence returned"}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[#A3A3A3]">Author-flagged strategy</td>
                <td className="py-3 text-emerald-400 font-medium">
                  {recommended
                    ? `${recommended.code}: ${recommended.name} (${recommended.securityBenefitScore}% modelled benefit, ${recommended.simulatedDowntimeMinutes}m modelled downtime)`
                    : "No strategy is flagged as recommended"}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[#A3A3A3]">Safety policy gate</td>
                <td className="py-3 font-mono text-[#A3A3A3]">
                  {blocked.length > 0
                    ? `${blocked
                        .map((strategy) => strategy.code)
                        .join(", ")} blocked by the deterministic policy`
                    : "No strategy is currently blocked"}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[#A3A3A3]">Ledger integrity</td>
                <td className="py-3 font-mono text-[#A3A3A3]">
                  {chain
                    ? `${chain.algorithm} · ${chain.verified ? "verified" : "BROKEN"} over ${chain.checked_entries} entries`
                    : "Not checked"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[11px] text-[#737373] leading-relaxed">
          {chain?.note ??
            "A chained hash detects modification or deletion of an earlier entry. It is not external notarisation and not a security certification."}
        </p>
      </div>

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Report generation runs in your browser against the live API</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>JSON LEDGER: {loadError ? "UNAVAILABLE" : "READY"}</span>
          <span>MARKDOWN BRIEF: {loadError ? "UNAVAILABLE" : "READY"}</span>
          <span>CSV EVIDENCE: {loadError ? "UNAVAILABLE" : "READY"}</span>
        </div>
      </div>
    </>
  );
}
