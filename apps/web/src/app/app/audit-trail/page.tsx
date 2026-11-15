"use client";

import * as React from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Loader2,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  ApiError,
  ApiAuditEntry,
  ChainVerification,
  fetchAuditTrail,
  loadFailureHint,
  verifyAuditChain,
} from "@/lib/api-client";
import { SkeletonRows } from "@/components/ui/skeleton";

const PAGE_SIZE = 25;

function resultTone(result: string): string {
  if (result === "PASSED" || result === "Approved for Demonstration" || result === "SUCCESS") {
    return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  }
  if (
    result === "VIOLATION_BLOCKED" ||
    result === "Rejected" ||
    result === "REJECTED_BY_POLICY"
  ) {
    return "bg-red-500/10 text-red-400 border border-red-500/20";
  }
  return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
}

export default function AuditTrailPage() {
  const [entries, setEntries] = React.useState<ApiAuditEntry[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [offset, setOffset] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<ApiAuditEntry | null>(null);
  const [chain, setChain] = React.useState<ChainVerification | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [actorFilter, setActorFilter] = React.useState<string>("");
  const [eventFilter, setEventFilter] = React.useState<string>("");

  const load = React.useCallback(async (nextOffset: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const [page, verification] = await Promise.all([
        fetchAuditTrail(PAGE_SIZE, nextOffset),
        verifyAuditChain(),
      ]);
      setEntries(page.entries);
      setTotal(page.total);
      setOffset(page.offset);
      setChain(verification);
      setSelected((current) => {
        if (current && page.entries.some((entry) => entry.id === current.id)) return current;
        return page.entries[0] ?? null;
      });
    } catch (err) {
      setError(err instanceof ApiError ? loadFailureHint(err) : "Could not load the audit ledger.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load(0);
  }, [load]);

  const actors = React.useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.actor))).sort(),
    [entries]
  );
  const eventTypes = React.useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.event_type))).sort(),
    [entries]
  );

  const visible = entries.filter(
    (entry) =>
      (actorFilter === "" || entry.actor === actorFilter) &&
      (eventFilter === "" || entry.event_type === eventFilter)
  );

  const isFiltered = actorFilter !== "" || eventFilter !== "";
  const pageStart = total === 0 ? 0 : offset + 1;
  const pageEnd = offset + entries.length;

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            APPEND-ONLY LEDGER
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Every simulation run and authorization decision is recorded with a chained HMAC-SHA256
          entry hash
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/audit-trail</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">Audit Ledger</h1>
          <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
            Append-only record of simulated strategies, policy evaluations and authorized SOC
            reviews. Entries are stored in SQLite behind triggers that reject UPDATE and DELETE.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load(offset)}
          disabled={isLoading}
          className="bg-[#252525] hover:bg-[#303030] border border-[#383838] text-xs text-[#F5F5F5] px-3.5 py-2 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-10 xl:min-h-6"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6B35]" aria-hidden="true" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>Refresh Ledger</span>
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Ledger unavailable</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      ) : null}

      {/* Chain verification banner: the real result, not a decorative badge. */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {chain?.verified ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
          )}
          <div>
            <h2 className="text-xs font-semibold text-[#F5F5F5]">
              {chain === null
                ? "Chain verification unavailable"
                : chain.verified
                  ? "Chain verified"
                  : `Chain broken at sequence ${chain.broken_seq ?? "unknown"}`}
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5 max-w-2xl">
              {chain?.note ??
                "The API verifies every entry hash against its predecessor on request."}
            </p>
            {chain ? (
              <p className="text-[11px] font-mono text-[#737373] mt-1">
                {chain.algorithm} · {chain.checked_entries} entries checked
              </p>
            ) : null}
          </div>
        </div>
        <div className="text-xs font-mono text-[#737373] bg-[#1E1E1E] px-3 py-1.5 rounded-lg border border-[#333]">
          Total Recorded Events:{" "}
          <span className="text-emerald-400 font-bold">{total}</span>
        </div>
      </div>

      {/* Filters: they actually filter the loaded page. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3">
          <label htmlFor="audit-actor" className="block text-[11px] text-[#737373] mb-1">
            Actor
          </label>
          <select
            id="audit-actor"
            value={actorFilter}
            onChange={(event) => setActorFilter(event.target.value)}
            className="w-full bg-transparent text-xs font-mono text-[#F5F5F5] focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-[#252525]">
              All actors
            </option>
            {actors.map((actor) => (
              <option key={actor} value={actor} className="bg-[#252525]">
                {actor}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3">
          <label htmlFor="audit-event" className="block text-[11px] text-[#737373] mb-1">
            Event Type
          </label>
          <select
            id="audit-event"
            value={eventFilter}
            onChange={(event) => setEventFilter(event.target.value)}
            className="w-full bg-transparent text-xs font-mono text-[#F5F5F5] focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-[#252525]">
              All actions
            </option>
            {eventTypes.map((eventType) => (
              <option key={eventType} value={eventType} className="bg-[#252525]">
                {eventType}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3">
          <span className="block text-[11px] text-[#737373] mb-1">Integrity Mode</span>
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
            <span>{chain?.algorithm ?? "HMAC-SHA256 chained"}</span>
            <Lock className="w-3 h-3 text-emerald-400" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* First load: shaped placeholder rows instead of an empty table. */}
      {isLoading && entries.length === 0 ? (
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
          <p role="status" aria-live="polite" className="sr-only">
            Loading ledger entries
          </p>
          <SkeletonRows rows={6} />
        </div>
      ) : null}

      {/* Ledger table */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        {/* Below md the five-column ledger cannot be read without horizontal
            scrolling, so each entry becomes a stacked card instead. */}
        <ul className="md:hidden space-y-2">
          {visible.map((entry) => {
            const isSelected = selected?.id === entry.id;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setSelected(entry)}
                  aria-pressed={isSelected}
                  className={`w-full text-left rounded-lg border p-3 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6B35] ${
                    isSelected
                      ? "bg-[#302B28] border-[#FF6B35]/60"
                      : "bg-[#1F1F1F] border-[#383838] hover:border-[#FF6B35]/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] text-[#A3A3A3]">
                      {entry.timestamp.replace("T", " ").slice(0, 19)}
                    </span>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-semibold ${resultTone(entry.result)}`}
                    >
                      {entry.result}
                    </span>
                  </div>
                  <div className="mt-1.5 font-mono text-xs text-emerald-400 break-all">
                    {entry.actor}
                  </div>
                  <div className="font-mono text-[11px] text-[#737373]">{entry.event_type}</div>
                  <div className="mt-1.5 text-xs text-[#F5F5F5] break-words">{entry.resource}</div>
                  <div className="mt-1.5 flex items-center justify-between gap-2 font-mono text-[11px] text-[#A3A3A3]">
                    <span>{entry.entry_hash.slice(0, 16)}…</span>
                    {entry.is_synthetic ? (
                      <span className="text-[10px] text-[#737373]">SYNTHETIC</span>
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
          {visible.length === 0 ? (
            <li className="rounded-lg border border-[#383838] bg-[#1F1F1F] p-4 text-center text-xs text-[#737373]">
              {entries.length === 0
                ? "The ledger returned no entries for this page."
                : "No entry on this page matches the active filters. Clear a filter or page to older records."}
            </li>
          ) : null}
        </ul>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">
              Audit ledger entries, newest first. Select a row to inspect its full record.
            </caption>
            <thead>
              <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-medium tracking-wider uppercase">
                <th scope="col" className="pb-3 font-medium">Timestamp (UTC)</th>
                <th scope="col" className="pb-3 font-medium">Actor / Event</th>
                <th scope="col" className="pb-3 font-medium">Resource</th>
                <th scope="col" className="pb-3 font-medium">Result</th>
                <th scope="col" className="pb-3 font-medium">Entry Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/40 font-mono">
              {visible.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center font-sans text-[#737373]">
                    No entries match the current filters.
                  </td>
                </tr>
              ) : null}
              {visible.map((entry) => {
                const isSelected = selected?.id === entry.id;
                return (
                  <tr
                    key={entry.id}
                    onClick={() => setSelected(entry)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-[#302B28]" : "hover:bg-[#2C2C2C]/50"
                    }`}
                  >
                    <td className="py-3.5 text-[#A3A3A3]">
                      <button
                        type="button"
                        onClick={() => setSelected(entry)}
                        className="text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6B35]"
                      >
                        {entry.timestamp.replace("T", " ").slice(0, 19)}
                      </button>
                    </td>
                    <td className="py-3.5 text-[#F5F5F5]">
                      <span className="text-emerald-400">{entry.actor}</span>
                      <span className="text-[#737373] block text-[11px]">{entry.event_type}</span>
                    </td>
                    <td className="py-3.5 text-[#F5F5F5]">{entry.resource}</td>
                    <td className="py-3.5 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${resultTone(entry.result)}`}>
                        {entry.result}
                      </span>
                      {entry.is_synthetic ? (
                        <span className="ml-2 text-[10px] font-mono text-[#737373]">SYNTHETIC</span>
                      ) : null}
                    </td>
                    <td className="py-3.5 text-[#A3A3A3] text-[11px]">
                      {entry.entry_hash.slice(0, 16)}…
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#737373]">
                    {entries.length === 0
                      ? "The ledger returned no entries for this page."
                      : "No entry on this page matches the active filters. Clear a filter or page to older records."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#737373]">
          <span className="font-mono">
            {total === 0
              ? "No entries"
              : isFiltered
              ? `${visible.length} matching of ${entries.length} on this page · ${total} in ledger`
              : `Showing ${pageStart}–${pageEnd} of ${total}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load(Math.max(0, offset - PAGE_SIZE))}
              disabled={isLoading || offset === 0}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#383838] hover:border-[#FF6B35] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-10 xl:min-h-6"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Newer</span>
            </button>
            <button
              type="button"
              onClick={() => void load(offset + PAGE_SIZE)}
              disabled={isLoading || pageEnd >= total}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#383838] hover:border-[#FF6B35] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-10 xl:min-h-6"
            >
              <span>Older</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Record inspector */}
      {selected ? (
        <div className="bg-[#252525] border border-[#FF6B35]/50 rounded-xl p-6 mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase font-mono">
              Audit Record Inspector · {selected.id}
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border ${
                chain?.verified
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-red-400 bg-red-500/10 border-red-500/20"
              }`}
            >
              {chain?.verified ? "Chain verified" : "Chain not verified"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#383838] text-xs">
            <div>
              <span className="text-[#737373] block">Sequence:</span>
              <span className="text-[#F5F5F5] font-mono">{selected.seq}</span>
            </div>
            <div>
              <span className="text-[#737373] block">Timestamp:</span>
              <span className="text-[#F5F5F5] font-mono">{selected.timestamp}</span>
            </div>
            <div>
              <span className="text-[#737373] block">Actor ID:</span>
              <span className="text-[#F5F5F5] font-mono">{selected.actor}</span>
            </div>
            <div>
              <span className="text-[#737373] block">Resource:</span>
              <span className="text-[#F5F5F5] font-mono">{selected.resource}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-[#737373] block">Entry hash (HMAC-SHA256):</span>
              <span className="text-[#FF6B35] font-mono break-all">{selected.entry_hash}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-[#737373] block">Previous hash:</span>
              <span className="text-[#A3A3A3] font-mono break-all">{selected.prev_hash}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#1E1E1E] border border-[#333] rounded-lg text-xs">
            <span className="text-[#737373] block mb-1">Details:</span>
            <p className="text-[#F5F5F5] leading-relaxed">{selected.details}</p>
          </div>

          <p className="text-[11px] text-[#737373] mt-3 leading-relaxed">
            A chained hash detects modification or deletion of any earlier entry in this database.
            It does not prove that the whole file was never replaced, and it is not an external
            notarisation or a certification.
          </p>
        </div>
      ) : null}

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>GARDA-SIM AI Audit Ledger · Synthetic Domain</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>STORAGE: SQLITE + APPEND-ONLY TRIGGERS</span>
          <span>INTEGRITY: HMAC-SHA256 CHAIN</span>
          <span>HUMAN-IN-THE-LOOP: RECORDED</span>
        </div>
      </div>
    </>
  );
}
