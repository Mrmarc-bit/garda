"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Search,
  ShieldCheck,
} from "lucide-react";
import { ApiError, fetchIncidents, loadFailureHint, SyntheticIncident } from "@/lib/api-client";
import { SkeletonRows } from "@/components/ui/skeleton";

/** Status tone derived from the value the API actually returns — no blanket amber badge. */
const STATUS_TONE: Record<string, string> = {
  awaiting_review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  investigating: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contained: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  closed: "bg-[#2C2C2C] text-[#A3A3A3] border-[#383838]",
};

const SEVERITY_TONE: Record<string, string> = {
  critical: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = React.useState<SyntheticIncident[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = React.useState<string>("all");
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">("newest");

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchIncidents();
        if (!cancelled) setIncidents(data);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? loadFailureHint(err) : "Could not load the incident repository."
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

  /** Status options come from the loaded records, so a filter can never match nothing. */
  const statusOptions = React.useMemo(
    () => Array.from(new Set(incidents.map((incident) => incident.status))).sort(),
    [incidents]
  );

  const filteredIncidents = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return incidents
      .filter((incident) => {
        const matchesSearch =
          query === "" ||
          incident.id.toLowerCase().includes(query) ||
          incident.title.toLowerCase().includes(query) ||
          incident.targetAsset.toLowerCase().includes(query);

        const matchesSeverity =
          severityFilter === "all" || incident.severity === severityFilter;
        const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
        const matchesConfidence =
          confidenceFilter === "all" ||
          (confidenceFilter === "high" ? incident.confidence >= 0.85 : incident.confidence >= 0.8);

        return matchesSearch && matchesSeverity && matchesStatus && matchesConfidence;
      })
      .sort((a, b) => {
        const delta =
          new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
        return sortOrder === "newest" ? delta : -delta;
      });
  }, [incidents, searchQuery, severityFilter, statusFilter, confidenceFilter, sortOrder]);

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            INCIDENT REPOSITORY
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Defensive incident repository · synthetic scenarios with correlated evidence grounding
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/incidents</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
            Incident Investigation
          </h1>
          <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
            Examine correlated synthetic anomalies, evaluate affected virtual services, and launch
            defensive response simulations.
          </p>
        </div>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Incident repository unavailable</p>
            <p className="mt-1">{loadError}</p>
            <p className="mt-1 text-[#A3A3A3]">
              No placeholder records are substituted.
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 bg-[#252525] border border-[#383838] rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#737373] shrink-0" aria-hidden="true" />
          <label htmlFor="search-incidents" className="sr-only">
            Search incidents by ID, title or virtual asset
          </label>
          <input
            id="search-incidents"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search incident ID, scenario title, or virtual asset (e.g. APP-GW-02)…"
            className="w-full bg-transparent border-none text-xs text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B35] rounded font-mono"
          />
        </div>
        <button
          type="button"
          onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          className="flex items-center gap-1 text-xs text-[#A3A3A3] cursor-pointer hover:text-[#F5F5F5] font-mono shrink-0 min-h-10 lg:min-h-6"
        >
          <span>{sortOrder === "newest" ? "Newest first" : "Oldest first"}</span>
          {sortOrder === "newest" ? (
            <ArrowDown className="w-3.5 h-3.5 text-[#FF6B35]" aria-hidden="true" />
          ) : (
            <ArrowUp className="w-3.5 h-3.5 text-[#FF6B35]" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between">
          <label htmlFor="inc-severity" className="text-[11px] text-[#737373] block mb-1">
            Severity filter
          </label>
          <select
            id="inc-severity"
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
            className="bg-transparent text-xs text-[#F5F5F5] focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#252525]">
              All severities
            </option>
            <option value="critical" className="bg-[#252525]">
              Critical
            </option>
            <option value="warning" className="bg-[#252525]">
              Warning
            </option>
            <option value="info" className="bg-[#252525]">
              Informational
            </option>
          </select>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between">
          <label htmlFor="inc-status" className="text-[11px] text-[#737373] block mb-1">
            Status filter
          </label>
          <select
            id="inc-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="bg-transparent text-xs text-[#F5F5F5] focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#252525]">
              All statuses
            </option>
            {statusOptions.map((status) => (
              <option key={status} value={status} className="bg-[#252525]">
                {status.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between">
          <label htmlFor="inc-confidence" className="text-[11px] text-[#737373] block mb-1">
            Confidence filter
          </label>
          <select
            id="inc-confidence"
            value={confidenceFilter}
            onChange={(event) => setConfidenceFilter(event.target.value)}
            className="bg-transparent text-xs text-[#F5F5F5] focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#252525]">
              All confidences (≥ 0.80)
            </option>
            <option value="high" className="bg-[#252525]">
              High only (≥ 0.85)
            </option>
          </select>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-[#737373]">Boundary</span>
          <span className="text-xs font-mono text-emerald-400 mt-1">Virtual IT/OT twin</span>
        </div>
      </div>

      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        {/* Below md the six-column table becomes a stacked card list. */}
        <ul className="md:hidden space-y-2">
          {isLoading ? (
            <li>
              <p role="status" aria-live="polite" className="sr-only">
                Loading incident records
              </p>
              <SkeletonRows rows={3} />
            </li>
          ) : filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <li
                key={incident.id}
                className="rounded-lg border border-[#383838] bg-[#1F1F1F] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/app/incidents/${incident.id}`}
                    className="font-mono text-xs font-bold text-[#FF6B35] hover:underline"
                  >
                    {incident.id}
                  </Link>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-mono border ${
                      STATUS_TONE[incident.status] ?? "bg-[#2C2C2C] text-[#A3A3A3] border-[#383838]"
                    }`}
                  >
                    {incident.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
                <div className="mt-1.5 text-sm font-bold text-[#F5F5F5]">{incident.title}</div>
                <p className="mt-0.5 text-[11px] text-[#A3A3A3] line-clamp-2">{incident.summary}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px]">
                  <span className="text-[#A3A3A3]">{incident.targetAsset}</span>
                  <span className={`font-bold uppercase ${SEVERITY_TONE[incident.severity] ?? "text-[#A3A3A3]"}`}>
                    {incident.severity}
                  </span>
                </div>
                <Link
                  href={`/app/simulator?incident=${incident.id}`}
                  className="mt-2.5 inline-flex items-center justify-center bg-[#FF6B35] text-white text-[11px] font-medium px-3 py-1.5 rounded hover:bg-[#FF8255] transition-colors cursor-pointer shadow-sm min-h-9 xl:min-h-6"
                >
                  Simulate
                </Link>
              </li>
            ))
          ) : (
            <li className="rounded-lg border border-[#383838] bg-[#1F1F1F] p-4 text-center text-xs text-[#737373]">
              {incidents.length === 0
                ? "The repository returned no incidents."
                : "No synthetic incidents match your filter query."}
            </li>
          )}
        </ul>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#383838] text-[#737373] uppercase font-mono">
                <th scope="col" className="pb-3">
                  Incident ID
                </th>
                <th scope="col" className="pb-3">
                  Title / summary
                </th>
                <th scope="col" className="pb-3">
                  Target asset
                </th>
                <th scope="col" className="pb-3">
                  Severity
                </th>
                <th scope="col" className="pb-3">
                  Status
                </th>
                <th scope="col" className="pb-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="pt-3">
                    <SkeletonRows rows={3} />
                  </td>
                </tr>
              ) : filteredIncidents.length > 0 ? (
                filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-[#2C2C2C]/50 transition-colors">
                    <td className="py-4 font-mono font-bold text-[#FF6B35]">
                      <Link href={`/app/incidents/${incident.id}`} className="hover:underline">
                        {incident.id}
                      </Link>
                    </td>
                    <td className="py-4 max-w-md">
                      <div className="font-bold text-[#F5F5F5]">{incident.title}</div>
                      <div className="text-[#A3A3A3] text-[11px] mt-0.5 line-clamp-1">
                        {incident.summary}
                      </div>
                    </td>
                    <td className="py-4 font-mono text-[#F5F5F5]">{incident.targetAsset}</td>
                    <td className="py-4 font-mono">
                      <span
                        className={`font-bold uppercase ${
                          SEVERITY_TONE[incident.severity] ?? "text-[#A3A3A3]"
                        }`}
                      >
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                          STATUS_TONE[incident.status] ??
                          "bg-[#2C2C2C] text-[#A3A3A3] border-[#383838]"
                        }`}
                      >
                        {incident.status.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/app/simulator?incident=${incident.id}`}
                        className="bg-[#FF6B35] text-white text-[11px] font-medium px-3 py-1.5 rounded hover:bg-[#FF8255] transition-colors inline-flex items-center justify-center cursor-pointer shadow-sm min-h-9 xl:min-h-6"
                      >
                        Simulate
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#737373]">
                    {incidents.length === 0
                      ? "The repository returned no incidents."
                      : "No synthetic incidents match your filter query."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>GARDA-SIM AI incident management · bounded synthetic telemetry</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>RECORDS: {incidents.length}</span>
          <span>SHOWN: {filteredIncidents.length}</span>
          <span>SOURCE: REST API</span>
        </div>
      </div>
    </>
  );
}
