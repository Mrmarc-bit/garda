"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import {
  ApiError,
  loadFailureHint,
  ApiAuditEntry,
  AuditPage,
  ChainVerification,
  fetchAuditTrail,
  verifyAuditChain,
} from "@/lib/api-client";
import { SkeletonRows } from "@/components/ui/skeleton";

const FEED_LIMIT = 50;

/** Where a given ledger event type can be inspected further. */
const EVENT_LINK: Record<string, string> = {
  SIMULATION_RUN: "/app/simulator",
  STRATEGY_REVIEW: "/app/recommendations",
  STRATEGY_REVIEW_REFUSED: "/app/recommendations",
  INCIDENT_NOTE: "/app/incidents",
};

const EVENT_TONE: Record<string, string> = {
  SIMULATION_RUN: "text-blue-400",
  STRATEGY_REVIEW: "text-emerald-400",
  STRATEGY_REVIEW_REFUSED: "text-red-400",
  INCIDENT_NOTE: "text-amber-400",
};

const formatTimestamp = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return `${parsed.toISOString().replace("T", " ").replace(".000Z", "")} UTC`;
};

export default function NotificationsPage() {
  const [page, setPage] = React.useState<AuditPage | null>(null);
  const [chain, setChain] = React.useState<ChainVerification | null>(null);
  const [eventFilter, setEventFilter] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [auditPage, chainResult] = await Promise.all([
          fetchAuditTrail(FEED_LIMIT, 0),
          verifyAuditChain(),
        ]);
        if (cancelled) return;
        setPage(auditPage);
        setChain(chainResult);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? loadFailureHint(err) : "Could not read the event ledger."
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

  const entries: ApiAuditEntry[] = page?.entries ?? [];

  const eventTypes = React.useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.event_type))).sort(),
    [entries]
  );

  const visible = React.useMemo(
    () =>
      eventFilter === "all"
        ? entries
        : entries.filter((entry) => entry.event_type === eventFilter),
    [entries, eventFilter]
  );

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            LEDGER EVENT FEED
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Activity feed derived from the append-only audit ledger · no separate notification store
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/notifications</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">Notifications</h1>
          <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
            Every simulation run, review decision and analyst note is an event in the ledger. This
            page shows the newest {FEED_LIMIT} of them, newest first.
          </p>
        </div>

        <Link
          href="/app/audit-trail"
          className="bg-[#252525] hover:bg-[#303030] border border-[#383838] text-xs text-[#F5F5F5] px-3.5 py-2 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Full audit trail</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FF6B35]" aria-hidden="true" />
        </Link>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Event feed unavailable</p>
            <p className="mt-1">{loadError}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="notif-event-type" className="text-[11px] text-[#737373]">
            Event type
          </label>
          <select
            id="notif-event-type"
            value={eventFilter}
            onChange={(event) => setEventFilter(event.target.value)}
            className="bg-[#1C1C1C] border border-[#383838] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#FF6B35] cursor-pointer"
          >
            <option value="all">All events</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          {chain ? (
            chain.verified ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-400">CHAIN VERIFIED</span>
              </>
            ) : (
              <>
                <ShieldX className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
                <span className="text-red-400">CHAIN BROKEN @ {chain.broken_seq}</span>
              </>
            )
          ) : (
            <span className="text-[#737373]">CHAIN STATUS UNKNOWN</span>
          )}
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {isLoading ? (
          <>
            <p role="status" aria-live="polite" className="sr-only">
              Loading ledger events
            </p>
            <SkeletonRows rows={5} />
          </>
        ) : visible.length === 0 ? (
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-8 text-center text-xs text-[#737373]">
            <Bell className="w-4 h-4 mx-auto mb-2 text-[#4E4E4E]" aria-hidden="true" />
            <span>
              {loadError
                ? "Events could not be read from the ledger. This is not an empty ledger."
                : entries.length === 0
                  ? "The ledger is empty. Run a simulation to create the first event."
                  : "No event matches the selected type."}
            </span>
          </div>
        ) : (
          visible.map((entry) => {
            const href = EVENT_LINK[entry.event_type];
            return (
              <article
                key={entry.id}
                className={`bg-[#252525] border rounded-xl p-5 ${
                  entry.is_synthetic
                    ? "border-[#383838]"
                    : "border-[#FF6B35]/30 bg-[#282421]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        EVENT_TONE[entry.event_type] ?? "text-[#737373]"
                      }`}
                      aria-hidden="true"
                    />
                    <h2 className="text-sm font-semibold text-[#F5F5F5]">
                      {entry.event_type.replace(/_/g, " ")}
                    </h2>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1C] border border-[#333] text-[#A3A3A3]">
                      {entry.result}
                    </span>
                    {entry.is_synthetic ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1C] border border-[#333] text-[#737373]">
                        SYNTHETIC DATA
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[11px] font-mono text-[#737373]">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
                  {entry.details || "No additional detail was recorded for this event."}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-[#737373]">
                  <span>ACTOR: {entry.actor}</span>
                  <span>RESOURCE: {entry.resource}</span>
                  <span>SEQ: {entry.seq}</span>
                </div>

                {href ? (
                  <div className="mt-3">
                    <Link
                      href={href}
                      className="text-xs text-[#FF6B35] hover:underline inline-flex items-center gap-1 font-mono"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </div>

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>GARDA-SIM AI event feed · sourced from the audit ledger</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>LEDGER TOTAL: {page?.total ?? "—"}</span>
          <span>SHOWN: {visible.length}</span>
          <span>SOURCE: REST API</span>
        </div>
      </div>
    </>
  );
}
