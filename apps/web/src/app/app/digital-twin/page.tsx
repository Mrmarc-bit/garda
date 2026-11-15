"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  ApiError,
  loadFailureHint,
  SyntheticEvidence,
  SyntheticIncident,
  VirtualAsset,
  fetchEvidence,
  fetchIncidents,
  fetchTopology,
} from "@/lib/api-client";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCardGrid,
  SkeletonPage,
  SkeletonRows,
} from "@/components/ui/skeleton";

/**
 * Node placement is a presentation concern and lives here. Every *fact* on this page (assets,
 * dependency edges, statuses, incident targets, evidence) comes from the API. There is no
 * network probe and no latency figure, because nothing in this prototype can contact a host.
 */
const NODE_POSITION: Record<string, { left: number; top: number }> = {
  "IDENTITY-SVC-01": { left: 6, top: 4 },
  "OPS-DASH-01": { left: 66, top: 4 },
  "APP-GW-02": { left: 36, top: 34 },
  "MONITOR-01": { left: 8, top: 66 },
  "TELEMETRY-SIM-01": { left: 38, top: 74 },
  "OT-CONTROLLER-SIM-01": { left: 66, top: 60 },
};

const STATUS_TONE: Record<
  VirtualAsset["status"],
  { dot: string; text: string; border: string; label: string }
> = {
  healthy: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    border: "border-[#383838] hover:border-[#555]",
    label: "HEALTHY",
  },
  at_risk: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    border: "border-amber-500/50 hover:border-amber-400",
    label: "AT RISK",
  },
  compromised: {
    dot: "bg-red-400",
    text: "text-red-400",
    border: "border-red-500/60 hover:border-red-400",
    label: "COMPROMISED",
  },
  isolated: {
    dot: "bg-slate-400",
    text: "text-slate-400",
    border: "border-slate-500/50 hover:border-slate-400",
    label: "ISOLATED",
  },
};

const TYPE_LABEL: Record<VirtualAsset["type"], string> = {
  gateway: "Gateway",
  identity: "Identity",
  ot_controller: "OT controller",
  monitoring: "Monitoring",
  dashboard: "Dashboard",
  telemetry: "Telemetry",
};

/** Assets that transitively depend on `rootId` — the modelled blast radius. */
const downstreamClosure = (assets: VirtualAsset[], rootId: string): Set<string> => {
  const result = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const asset of assets) {
      if (result.has(asset.id) || asset.id === rootId) continue;
      if (asset.dependsOn.some((parent) => parent === rootId || result.has(parent))) {
        result.add(asset.id);
        changed = true;
      }
    }
  }
  return result;
};

export default function DigitalTwinPage() {
  const [assets, setAssets] = React.useState<VirtualAsset[]>([]);
  const [incidents, setIncidents] = React.useState<SyntheticIncident[]>([]);
  const [evidence, setEvidence] = React.useState<SyntheticEvidence[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [selectedAsset, setSelectedAsset] = React.useState<string>("");
  const [zoomLevel, setZoomLevel] = React.useState<number>(100);
  const [searchFilter, setSearchFilter] = React.useState<string>("");
  const [viewMode, setViewMode] = React.useState<"topology" | "blast">("topology");
  const [showDependencyTrace, setShowDependencyTrace] = React.useState<boolean>(false);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [topology, incidentData, evidenceData] = await Promise.all([
        fetchTopology(),
        fetchIncidents(),
        fetchEvidence(),
      ]);
      setAssets(topology);
      setIncidents(incidentData);
      setEvidence(evidenceData);
      setSelectedAsset((current) =>
        current && topology.some((asset) => asset.id === current)
          ? current
          : (topology.find((asset) => asset.status === "compromised") ?? topology[0])?.id ?? ""
      );
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? loadFailureHint(err) : "Could not load the virtual topology."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const current = assets.find((asset) => asset.id === selectedAsset) ?? null;

  const dependents = React.useMemo(() => {
    if (!current) return [];
    return assets.filter((asset) => asset.dependsOn.includes(current.id));
  }, [assets, current]);

  const upstream = React.useMemo(() => {
    if (!current) return [];
    return current.dependsOn
      .map((id) => assets.find((asset) => asset.id === id))
      .filter((asset): asset is VirtualAsset => Boolean(asset));
  }, [assets, current]);

  const blastRadius = React.useMemo(
    () => (current ? downstreamClosure(assets, current.id) : new Set<string>()),
    [assets, current]
  );

  const relatedIncidents = React.useMemo(
    () => incidents.filter((incident) => incident.targetAsset === selectedAsset),
    [incidents, selectedAsset]
  );

  const relatedEvidence = React.useMemo(
    () => evidence.filter((item) => item.associatedAsset === selectedAsset),
    [evidence, selectedAsset]
  );

  const handleZoomIn = () => setZoomLevel((previous) => Math.min(previous + 15, 145));
  const handleZoomOut = () => setZoomLevel((previous) => Math.max(previous - 15, 70));
  const handleResetView = () => {
    setZoomLevel(100);
    setSearchFilter("");
    setViewMode("topology");
    setShowDependencyTrace(false);
  };

  const matchesSearch = (asset: VirtualAsset) => {
    if (!searchFilter.trim()) return false;
    const needle = searchFilter.trim().toLowerCase();
    return (
      asset.id.toLowerCase().includes(needle) || asset.name.toLowerCase().includes(needle)
    );
  };

  if (isLoading) {
    return (
      <SkeletonPage label="Loading virtual topology from the simulation API">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Skeleton className="h-[460px] lg:col-span-2" />
          <SkeletonCard />
        </div>
      </SkeletonPage>
    );
  }

  if (loadError || !current) {
    return (
      <>
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Topology unavailable</p>
            <p className="mt-1">{loadError ?? "The API returned no virtual assets."}</p>
            <p className="mt-2 text-[#A3A3A3]">
              The graph is drawn only from real topology data; no nodes are hardcoded.
            </p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-3 text-[#FF6B35] hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </>
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
            TOPOLOGY LOADED FROM API
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Defensive digital twin · Directed dependency model across virtual IT and industrial OT
          assets
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/digital-twin</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
            IT/OT Virtual Digital Twin
          </h1>
          <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
            Trace upstream dependencies and downstream blast radius across the virtual asset
            inventory. Nothing here resolves a hostname or opens a connection.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => void load()}
            className="text-xs text-[#A3A3A3] border border-[#383838] hover:border-[#FF6B35] hover:text-[#FF6B35] px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Refresh
          </button>
          <Link
            href="/app/simulator"
            className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Run Simulation</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#252525] border border-[#383838] rounded-xl px-4 py-2 w-full sm:w-64">
            <label htmlFor="search-asset" className="block text-[11px] text-[#737373]">
              Highlight virtual node
            </label>
            <input
              id="search-asset"
              type="text"
              value={searchFilter}
              onChange={(event) => setSearchFilter(event.target.value)}
              placeholder="Search id or name…"
              className="w-full bg-transparent border-none text-xs font-mono text-[#F5F5F5] placeholder-[#737373] focus:outline-none mt-0.5"
            />
          </div>

          <div
            className="flex items-center gap-1 bg-[#252525] border border-[#383838] p-1 rounded-xl text-xs font-mono"
            role="tablist"
            aria-label="View mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "topology"}
              onClick={() => setViewMode("topology")}
              className={`px-3 py-1.5 min-h-10 xl:min-h-6 inline-flex items-center rounded-lg transition-colors cursor-pointer ${
                viewMode === "topology"
                  ? "bg-[#FF6B35] text-white font-bold"
                  : "text-[#A3A3A3] hover:text-[#F5F5F5]"
              }`}
            >
              Topology Graph
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "blast"}
              onClick={() => setViewMode("blast")}
              className={`px-3 py-1.5 min-h-10 xl:min-h-6 inline-flex items-center rounded-lg transition-colors cursor-pointer ${
                viewMode === "blast"
                  ? "bg-red-500 text-white font-bold"
                  : "text-[#A3A3A3] hover:text-[#F5F5F5]"
              }`}
            >
              Blast Radius
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#A3A3A3]">
          <div className="flex items-center gap-2 bg-[#252525] border border-[#383838] px-3 py-1.5 rounded-lg">
            <button
              type="button"
              onClick={handleZoomOut}
              className="hover:text-[#F5F5F5] cursor-pointer p-1 min-w-9 min-h-9 xl:min-w-6 xl:min-h-6 inline-flex items-center justify-center"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <span className="font-mono text-xs text-[#F5F5F5] w-12 text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="hover:text-[#F5F5F5] cursor-pointer p-1 min-w-9 min-h-9 xl:min-w-6 xl:min-h-6 inline-flex items-center justify-center"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetView}
            className="text-xs text-[#F5F5F5] bg-[#252525] border border-[#383838] px-3 py-1.5 min-h-10 lg:min-h-6 rounded-lg hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors inline-flex items-center gap-1.5 cursor-pointer font-mono"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* The dependency graph is laid out in percentages, so squeezing it into a
          375px column would overlap the node cards. Below lg the canvas keeps a
          usable minimum width and the wrapper scrolls horizontally instead. */}
      <div className="mt-4 bg-[#1A1A1A] border border-[#383838] rounded-2xl p-4 sm:p-6 relative min-h-[520px] flex flex-col justify-between overflow-x-auto overflow-y-hidden shadow-2xl">
        <p className="lg:hidden text-[11px] text-[#737373] mb-2">
          Scroll the graph horizontally to reach every virtual node.
        </p>
        <div
          className="relative w-full min-w-[720px] lg:min-w-0 h-[460px] transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {assets.flatMap((asset) =>
              asset.dependsOn.map((parentId) => {
                const from = NODE_POSITION[parentId];
                const to = NODE_POSITION[asset.id];
                if (!from || !to) return null;
                const inBlast =
                  viewMode === "blast" &&
                  current &&
                  (blastRadius.has(asset.id) || blastRadius.has(parentId));
                return (
                  <line
                    key={`${parentId}->${asset.id}`}
                    x1={`${from.left + 7}%`}
                    y1={`${from.top + 8}%`}
                    x2={`${to.left + 7}%`}
                    y2={`${to.top + 8}%`}
                    stroke={inBlast ? "#EF4444" : "#525252"}
                    strokeWidth={inBlast ? 2.5 : 1.5}
                    strokeDasharray={inBlast ? undefined : "4 3"}
                  />
                );
              })
            )}
          </svg>

          {assets.map((asset) => {
            const position = NODE_POSITION[asset.id] ?? { left: 40, top: 40 };
            const tone = STATUS_TONE[asset.status];
            const isSelected = asset.id === selectedAsset;
            const isHighlighted = matchesSearch(asset);
            const inBlast = viewMode === "blast" && blastRadius.has(asset.id);
            const isGroundZero = viewMode === "blast" && asset.id === selectedAsset;
            const targetedBy = incidents.filter(
              (incident) => incident.targetAsset === asset.id
            );

            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelectedAsset(asset.id)}
                aria-pressed={isSelected}
                style={{ left: `${position.left}%`, top: `${position.top}%` }}
                className={`absolute w-56 text-left bg-[#252525] rounded-xl p-4 cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6B35] ${
                  isGroundZero
                    ? "ring-4 ring-red-500 bg-red-950/40 border border-red-500 shadow-lg shadow-red-500/20"
                    : inBlast
                      ? "ring-2 ring-red-400/70 bg-red-950/20 border border-red-500/40"
                      : isSelected
                        ? "border-2 border-[#FF6B35] ring-2 ring-[#FF6B35]/30 bg-[#2A2421]"
                        : tone.border
                } ${isHighlighted ? "ring-2 ring-emerald-400" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#F5F5F5] truncate">
                    {asset.id}
                  </span>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${tone.dot}`} aria-hidden="true" />
                </div>
                <div className={`text-[11px] font-mono mt-1 ${tone.text}`}>{tone.label}</div>
                <div className="text-[11px] text-[#A3A3A3] mt-1 truncate">{asset.name}</div>
                {targetedBy.length > 0 ? (
                  <span className="inline-block mt-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                    {targetedBy[0].id}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-[#303030] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#737373] font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#525252]" aria-hidden="true" />
              <span>Dependency edge (depends_on)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-red-500" aria-hidden="true" />
              <span>Inside modelled blast radius</span>
            </span>
          </div>
          <span>
            {assets.length} virtual assets ·{" "}
            {assets.reduce((total, asset) => total + asset.dependsOn.length, 0)} dependency edges
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-[#252525] border border-[#FF6B35]/50 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase font-mono">
                Selected virtual asset
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  current.status === "healthy"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : current.status === "compromised"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {current.status}
              </span>
            </div>

            <h2 className="text-xl font-bold font-mono text-[#F5F5F5] mt-1">{current.id}</h2>
            <div className="text-xs text-[#A3A3A3] mt-1">
              {current.name} · {TYPE_LABEL[current.type]} · criticality {current.criticality}
            </div>

            <div className="space-y-2 text-xs mt-4">
              <div>
                <span className="text-[#A3A3A3]">Virtual address: </span>
                <span className="font-mono text-[#F5F5F5]">{current.ipAddress}</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Depends on: </span>
                <span className="font-mono text-emerald-400">
                  {upstream.length > 0
                    ? upstream.map((asset) => asset.id).join(", ")
                    : "none (root of the model)"}
                </span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Direct dependents: </span>
                <span className="font-mono text-amber-400">
                  {dependents.length > 0
                    ? dependents.map((asset) => asset.id).join(", ")
                    : "none"}
                </span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Modelled blast radius: </span>
                <span className="font-mono text-red-400">
                  {blastRadius.size > 0 ? Array.from(blastRadius).join(", ") : "none"}
                </span>
              </div>
            </div>
          </div>

          {showDependencyTrace ? (
            <div className="mt-4 p-3 rounded-lg bg-[#1C1C1C] border border-[#333] text-xs font-mono text-[#A3A3A3]">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F5]">DEPENDENCY TRACE: {current.id}</span>
                <span className="text-emerald-400">
                  {dependents.length + upstream.length} direct edges
                </span>
              </div>
              <div className="mt-1 leading-relaxed">
                Upstream: {upstream.length > 0 ? upstream.map((a) => a.id).join(" → ") : "none"}
                <br />
                Downstream: {dependents.length > 0 ? dependents.map((a) => a.id).join(", ") : "none"}
                <br />
                Computed locally from the API topology. No network probe was issued.
              </div>
            </div>
          ) : null}

          <div className="mt-4 pt-3 border-t border-[#383838] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowDependencyTrace((previous) => !previous)}
              className="text-xs text-[#F5F5F5] bg-[#1E1E1E] border border-[#383838] hover:border-[#FF6B35] px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <Activity className="w-3.5 h-3.5 text-[#FF6B35]" aria-hidden="true" />
              <span>{showDependencyTrace ? "Hide dependency trace" : "Trace dependency path"}</span>
            </button>

            <Link
              href={
                relatedIncidents[0]
                  ? `/app/simulator?incident=${relatedIncidents[0].id}`
                  : "/app/simulator"
              }
              className="text-xs text-[#FF6B35] hover:underline font-mono inline-flex items-center gap-1"
            >
              <span>Test in Simulator</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Grounded evidence &amp; active invariants
            </h2>

            <div className="mt-3 space-y-2">
              {relatedEvidence.length > 0 ? (
                relatedEvidence.map((item) => (
                  <div
                    key={item.id}
                    className="text-xs bg-[#1C1C1C] border border-[#333] rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[#FF6B35]">{item.id}</span>
                      <span className="text-[10px] font-mono text-[#737373] uppercase">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[#A3A3A3] mt-1 leading-relaxed">{item.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#737373]">
                  No evidence record is associated with this virtual asset.
                </p>
              )}
            </div>

            <p className="text-xs text-[#A3A3A3] mt-4 leading-relaxed">
              SEC-OT-01 restricts actions to the virtual inventory. SEC-OT-02 requires a registered
              operator at clearance 2 or above. SEC-OT-03 protects the identity service. SEC-OT-04
              refuses strategies that would sever the modelled telemetry path. SEC-OT-05 verifies
              the audit chain before a run is accepted.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-[#383838] flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono text-emerald-400">
              ● Topology served by the API
            </span>
            <Link
              href="/app/evidence"
              className="text-xs text-[#FF6B35] hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>Open evidence workspace</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>GARDA-SIM AI IT/OT virtual digital twin · dependency model only</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>NODES: {assets.length}</span>
          <span>SCALE: {zoomLevel}%</span>
          <span>MODE: {viewMode === "blast" ? "BLAST RADIUS" : "TOPOLOGY"}</span>
        </div>
      </div>
    </>
  );
}
