"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Copy,
  FileCode,
  Search,
  ShieldCheck,
} from "lucide-react";
import { ApiError, fetchEvidence, loadFailureHint, SyntheticEvidence } from "@/lib/api-client";
import { SkeletonCard } from "@/components/ui/skeleton";

type TabKey = "timeline" | "logs" | "correlations";

const CATEGORY_TONE: Record<string, string> = {
  "Observed Fact": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Derived Assessment": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Policy Validation": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const formatTimestamp = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return `${parsed.toISOString().replace("T", " ").replace(".000Z", "")} UTC`;
};

export default function EvidencePage() {
  const [evidenceList, setEvidenceList] = React.useState<SyntheticEvidence[]>([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [activeTab, setActiveTab] = React.useState<TabKey>("timeline");
  const [copied, setCopied] = React.useState<boolean>(false);
  const [copyError, setCopyError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchEvidence();
        if (cancelled) return;
        setEvidenceList(data);
        setSelectedEvidenceId((current) => current || data[0]?.id || "");
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? loadFailureHint(err) : "Could not load the evidence repository."
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

  const categoryOptions = React.useMemo(
    () => Array.from(new Set(evidenceList.map((item) => item.category))).sort(),
    [evidenceList]
  );

  const filteredEvidence = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return evidenceList.filter((item) => {
      const matchesSearch =
        query === "" ||
        item.id.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        item.associatedAsset.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [evidenceList, searchQuery, categoryFilter]);

  const selectedRecord =
    filteredEvidence.find((item) => item.id === selectedEvidenceId) ??
    evidenceList.find((item) => item.id === selectedEvidenceId) ??
    filteredEvidence[0] ??
    null;

  /** The correlation view is the same records, ordered by observation time — no invented stages. */
  const chronological = React.useMemo(
    () =>
      [...filteredEvidence].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [filteredEvidence]
  );

  const handleCopyJSON = async () => {
    if (!selectedRecord) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(selectedRecord.rawPayload, null, 2));
      setCopied(true);
      setCopyError(null);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError("Clipboard access was refused by the browser.");
    }
  };

  const tabs: Array<[TabKey, string]> = [
    ["timeline", `Timeline view · ${filteredEvidence.length}`],
    ["logs", "Searchable raw grid"],
    ["correlations", "Chronological correlation"],
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
            SYNTHETIC TELEMETRY
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Defensive telemetry workbench · synthetic observations kept separate from interpretation
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/evidence</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
            Evidence &amp; Chronological Timeline
          </h1>
          <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
            Inspect correlated synthetic probes and raw sensor payloads. Every record below is an
            authored fixture; nothing here is captured from a real network.
          </p>
        </div>

        <Link
          href="/app/simulator"
          className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
        >
          <span>Simulate response</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Evidence repository unavailable</p>
            <p className="mt-1">{loadError}</p>
            <p className="mt-1 text-[#A3A3A3]">
              No local placeholder records are substituted.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-[#737373] shrink-0" aria-hidden="true" />
          <label htmlFor="ev-search" className="sr-only">
            Search evidence records
          </label>
          <input
            id="ev-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search records, assets, or probe text…"
            className="w-full bg-transparent text-xs text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B35] rounded font-mono"
          />
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between">
          <label htmlFor="ev-category" className="text-[11px] text-[#737373] block mb-1">
            Category filter
          </label>
          <select
            id="ev-category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="w-full bg-transparent text-xs text-[#F5F5F5] focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#252525]">
              All categories
            </option>
            {categoryOptions.map((category) => (
              <option key={category} value={category} className="bg-[#252525]">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-[#737373]">Records in repository</span>
          <span className="text-xs font-mono text-emerald-400 mt-1">
            {isLoading ? "loading…" : `${evidenceList.length} records`}
          </span>
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
        <div className="lg:col-span-7 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              <p role="status" aria-live="polite" className="sr-only">
                Loading evidence records
              </p>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : null}

          {!isLoading && activeTab === "timeline" && (
            <div className="space-y-3">
              {filteredEvidence.length === 0 ? (
                <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 text-xs text-[#737373]">
                  No evidence records match the current filter.
                </div>
              ) : (
                filteredEvidence.map((item) => {
                  const isSelected = selectedRecord?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedEvidenceId(item.id)}
                      className={`w-full text-left bg-[#252525] rounded-xl p-5 border cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] ${
                        isSelected
                          ? "border-[#FF6B35] bg-[#2A2421] ring-1 ring-[#FF6B35]/30"
                          : "border-[#383838] hover:border-[#4E4E4E]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#FF6B35]">
                            {item.id}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1C1C] text-[#A3A3A3] border border-[#333]">
                            {item.source}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#737373]">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>

                      <p className="text-xs text-[#F5F5F5] mt-2.5 font-medium leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] font-mono">
                        <span className="text-[#A3A3A3]">
                          Asset: <strong className="text-white">{item.associatedAsset}</strong>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-semibold border ${
                            CATEGORY_TONE[item.category] ??
                            "bg-[#2C2C2C] text-[#A3A3A3] border-[#383838]"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {!isLoading && activeTab === "logs" && (
            <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#383838] text-[#737373] uppercase">
                    <th scope="col" className="pb-3">
                      ID
                    </th>
                    <th scope="col" className="pb-3">
                      Source
                    </th>
                    <th scope="col" className="pb-3">
                      Asset
                    </th>
                    <th scope="col" className="pb-3">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#383838]/60">
                  {filteredEvidence.map((item) => (
                    <tr key={item.id} className="hover:bg-[#2C2C2C]/50">
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedEvidenceId(item.id)}
                          className="font-bold text-[#FF6B35] hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#FF6B35] cursor-pointer"
                        >
                          {item.id}
                        </button>
                      </td>
                      <td className="py-3 text-[#A3A3A3]">{item.source}</td>
                      <td className="py-3 text-[#F5F5F5]">{item.associatedAsset}</td>
                      <td className="py-3 text-[11px]">{item.category}</td>
                    </tr>
                  ))}
                  {filteredEvidence.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#737373]">
                        No records match the current filter.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && activeTab === "correlations" && (
            <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-[#F5F5F5]">
                  Chronological correlation
                </h2>
                <span className="text-[11px] font-mono text-[#737373]">
                  Ordered by observation timestamp
                </span>
              </div>

              {chronological.length === 0 ? (
                <p className="text-xs text-[#737373]">No records to correlate.</p>
              ) : (
                <ol className="space-y-3 font-mono text-xs">
                  {chronological.map((item, index) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedEvidenceId(item.id)}
                        aria-pressed={selectedRecord?.id === item.id}
                        className={`w-full text-left p-3.5 bg-[#1C1C1C] rounded-lg border cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] ${
                          selectedRecord?.id === item.id
                            ? "border-[#FF6B35] ring-1 ring-[#FF6B35]/40"
                            : "border-[#383838] hover:border-[#555]"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <span className="text-[#FF6B35] font-bold">
                            Step {index + 1} · {item.id}
                          </span>
                          <span className="text-[10px] text-[#A3A3A3]">
                            {formatTimestamp(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-[#A3A3A3] font-sans">{item.description}</p>
                        <div className="text-[10px] text-[#737373] mt-1">
                          {item.source} · {item.associatedAsset} · {item.category}
                        </div>
                      </button>
                    </li>
                  ))}
                </ol>
              )}

              <p className="text-[11px] text-[#737373] leading-relaxed">
                Ordering reflects fixture timestamps only. No causal inference is drawn, and no
                containment action is implied.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          {selectedRecord ? (
            <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase font-mono">
                    Evidence record inspector
                  </span>
                  <h2 className="text-lg font-bold font-mono text-[#F5F5F5] mt-0.5">
                    {selectedRecord.id}
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  SYNTHETIC RECORD
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-[#383838] pt-3">
                <div>
                  <span className="text-[#737373] block">Observation timestamp:</span>
                  <span className="font-mono text-[#F5F5F5]">
                    {formatTimestamp(selectedRecord.timestamp)}
                  </span>
                </div>
                <div>
                  <span className="text-[#737373] block">Probe / detector:</span>
                  <span className="font-mono text-[#F5F5F5]">{selectedRecord.source}</span>
                </div>
                <div>
                  <span className="text-[#737373] block">Category:</span>
                  <span className="font-mono text-[#F5F5F5]">{selectedRecord.category}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[#737373] block">Associated asset:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {selectedRecord.associatedAsset}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchQuery(selectedRecord.associatedAsset)}
                    className="text-[10px] font-mono text-[#A3A3A3] hover:text-[#FF6B35] underline cursor-pointer shrink-0"
                  >
                    Filter this asset
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-[#737373] block mb-1">Description:</span>
                <p className="text-xs text-[#F5F5F5] leading-relaxed bg-[#1C1C1C] p-3 rounded-lg border border-[#333]">
                  {selectedRecord.description}
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-[#737373] flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-[#FF6B35]" aria-hidden="true" />
                    <span>Raw structured payload</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleCopyJSON()}
                    className="text-[11px] font-mono text-[#A3A3A3] hover:text-[#FF6B35] inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" aria-hidden="true" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>

                {copyError ? (
                  <p role="alert" className="text-[11px] text-red-300 mb-1">
                    {copyError}
                  </p>
                ) : null}

                <pre className="bg-[#171717] border border-[#303030] rounded-lg p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-56">
                  {JSON.stringify(selectedRecord.rawPayload, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 text-xs text-[#737373]">
              Select an evidence record to inspect its raw payload.
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>GARDA-SIM AI evidence workbench · UTC timestamps</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>RECORDS: {evidenceList.length}</span>
          <span>SHOWN: {filteredEvidence.length}</span>
          <span>SOURCE: REST API</span>
        </div>
      </div>
    </>
  );
}
