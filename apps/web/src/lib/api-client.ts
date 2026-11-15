/**
 * Typed client for the GARDA-SIM API.
 *
 * Two deliberate rules:
 *
 * 1. **Failures are failures.** No function here substitutes a local fixture for
 *    a failed request. An earlier version swallowed every error and returned the
 *    seed array, which made an API outage indistinguishable from success. Pages
 *    that want an instant first paint may seed their own state, but they must
 *    also surface the degraded state to the operator.
 * 2. **Identity is not sent from the browser.** The session lives in an
 *    HttpOnly cookie set by the server; `operator_id` and `reviewer_id` are never
 *    part of a request body.
 */

export type {
  SyntheticIncident,
  VirtualAsset,
  SyntheticEvidence,
  CandidateStrategy,
} from "./synthetic-data";

import type {
  SyntheticIncident,
  VirtualAsset,
  SyntheticEvidence,
  CandidateStrategy,
} from "./synthetic-data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code = "api_error") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  /** True when the server rejected the session rather than the request. */
  get isUnauthenticated(): boolean {
    return this.status === 401;
  }

  /** True when the request never reached the API (server down, DNS, offline). */
  get isUnreachable(): boolean {
    return this.status === 0;
  }
}

/**
 * Guidance shown under a failed load. The hint must match the cause: telling a
 * signed-out operator to "start the API" is wrong, and telling them to sign in
 * when the API is simply down is equally wrong.
 */
export function loadFailureHint(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isUnauthenticated) {
      return "Your session is missing or has expired. Sign in again to load this view.";
    }
    if (error.isUnreachable) {
      return "The simulation API is not running. Start it with `npm run api`, then reload.";
    }
    if (error.status === 403) {
      return "Your operator clearance does not allow this view. Ask for a higher-clearance operator account.";
    }
    return error.message;
  }
  return error instanceof Error ? error.message : "The request could not be completed.";
}

async function readErrorMessage(res: Response): Promise<{ message: string; code: string }> {
  try {
    const body: unknown = await res.json();
    if (body && typeof body === "object" && "detail" in body) {
      const detail = (body as { detail: unknown }).detail;
      if (typeof detail === "string") {
        return { message: detail, code: res.status === 401 ? "unauthenticated" : "request_failed" };
      }
      if (detail && typeof detail === "object" && "message" in detail) {
        const structured = detail as { message?: unknown; field?: unknown };
        if (typeof structured.message === "string") {
          return { message: structured.message, code: "invalid_request" };
        }
      }
    }
  } catch {
    // Fall through to the generic message below.
  }
  return {
    message: res.status === 401 ? "Your session has expired. Sign in again." : "The request could not be completed.",
    code: res.status === 401 ? "unauthenticated" : "request_failed",
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      credentials: "same-origin",
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(
      "The simulation API is unreachable. Start it with `npm run api`.",
      0,
      "network_error",
    );
  }

  if (!res.ok) {
    const { message, code } = await readErrorMessage(res);
    throw new ApiError(message, res.status, code);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

// --------------------------------------------------------------------------- //
// Wire types (snake_case, as the API speaks)
// --------------------------------------------------------------------------- //
interface ApiIncident {
  id: string;
  title: string;
  severity: SyntheticIncident["severity"];
  status: SyntheticIncident["status"];
  target_asset: string;
  detected_at: string;
  confidence: number;
  synthetic_identity: string;
  summary: string;
  affected_services: string[];
}

interface ApiAsset {
  id: string;
  name: string;
  type: VirtualAsset["type"];
  status: VirtualAsset["status"];
  ip_address: string;
  criticality: VirtualAsset["criticality"];
  depends_on: string[];
}

interface ApiEvidence {
  id: string;
  timestamp: string;
  source: string;
  category: SyntheticEvidence["category"];
  description: string;
  raw_payload: Record<string, unknown>;
  associated_asset: string;
}

interface ApiStrategy {
  id: string;
  code: string;
  name: string;
  description: string;
  security_benefit_score: number;
  simulated_downtime_minutes: number;
  recovery_effort: CandidateStrategy["recoveryEffort"];
  impacted_services: string[];
  safety_policy_status: CandidateStrategy["safetyPolicyStatus"];
  safety_violation_reason?: string | null;
  is_ai_recommended: boolean;
  ai_rationale: string;
}

export interface ApiAuditEntry {
  id: string;
  seq: number;
  timestamp: string;
  actor: string;
  event_type: string;
  resource: string;
  result: string;
  details: string;
  entry_hash: string;
  prev_hash: string;
  is_synthetic: boolean;
}

export interface AuditPage {
  entries: ApiAuditEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface ChainVerification {
  verified: boolean;
  checked_entries: number;
  broken_seq: number | null;
  algorithm: string;
  note: string;
}

export interface SessionInfo {
  operator_id: string;
  display_name: string;
  clearance: number;
  expires_at: string;
  synthetic_session: boolean;
}

export interface HealthInfo {
  status: string;
  environment: string;
  simulation_only: boolean;
  data_backend: string;
  strict_ot_mode: boolean;
  min_operator_clearance: number;
  session_ttl_minutes: number;
}

// --------------------------------------------------------------------------- //
// Auth
// --------------------------------------------------------------------------- //
export function login(operatorId: string, password: string): Promise<SessionInfo> {
  return request<SessionInfo>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ operator_id: operatorId, password }),
  });
}

export function logout(): Promise<void> {
  return request<void>("/api/auth/logout", { method: "POST" });
}

export function fetchSession(): Promise<SessionInfo> {
  return request<SessionInfo>("/api/auth/me");
}

export interface DemoHint {
  operator_id: string;
  password: string;
}

/**
 * Local development convenience: the API generates a demo password on first boot
 * and exposes it here so the sign-in screen can offer one-click access. Returns a
 * 404 in production, where no generated credential exists.
 */
export function fetchDemoHint(): Promise<DemoHint> {
  return request<DemoHint>("/api/auth/demo-hint");
}

// --------------------------------------------------------------------------- //
// Reads
// --------------------------------------------------------------------------- //
export function fetchHealth(): Promise<HealthInfo> {
  return request<HealthInfo>("/health");
}

export async function fetchIncidents(): Promise<SyntheticIncident[]> {
  const data = await request<ApiIncident[]>("/api/incidents");
  return data.map((incident) => ({
    id: incident.id,
    title: incident.title,
    severity: incident.severity,
    status: incident.status,
    targetAsset: incident.target_asset,
    detectedAt: incident.detected_at,
    confidence: incident.confidence,
    syntheticIdentity: incident.synthetic_identity,
    summary: incident.summary,
    affectedServices: incident.affected_services,
  }));
}

export async function fetchTopology(): Promise<VirtualAsset[]> {
  const data = await request<ApiAsset[]>("/api/topology");
  return data.map((asset) => ({
    id: asset.id,
    name: asset.name,
    type: asset.type,
    status: asset.status,
    ipAddress: asset.ip_address,
    criticality: asset.criticality,
    dependsOn: asset.depends_on,
  }));
}

export async function fetchStrategies(): Promise<CandidateStrategy[]> {
  const data = await request<ApiStrategy[]>("/api/strategies");
  return data.map((strategy) => ({
    id: strategy.id,
    code: strategy.code,
    name: strategy.name,
    description: strategy.description,
    securityBenefitScore: strategy.security_benefit_score,
    simulatedDowntimeMinutes: strategy.simulated_downtime_minutes,
    recoveryEffort: strategy.recovery_effort,
    impactedServices: strategy.impacted_services,
    safetyPolicyStatus: strategy.safety_policy_status,
    safetyViolationReason: strategy.safety_violation_reason ?? undefined,
    isAiRecommended: strategy.is_ai_recommended,
    aiRationale: strategy.ai_rationale,
  }));
}

export async function fetchEvidence(): Promise<SyntheticEvidence[]> {
  const data = await request<ApiEvidence[]>("/api/evidence");
  return data.map((evidence) => ({
    id: evidence.id,
    timestamp: evidence.timestamp,
    source: evidence.source,
    category: evidence.category,
    description: evidence.description,
    rawPayload: evidence.raw_payload,
    associatedAsset: evidence.associated_asset,
  }));
}

export function fetchAuditTrail(limit = 50, offset = 0): Promise<AuditPage> {
  return request<AuditPage>(`/api/audit-trail?limit=${limit}&offset=${offset}`);
}

export function verifyAuditChain(): Promise<ChainVerification> {
  return request<ChainVerification>("/api/audit-trail/verify");
}

// --------------------------------------------------------------------------- //
// Writes
// --------------------------------------------------------------------------- //
export interface SimulationRequest {
  scenario_id: string;
  strategy_code: string;
  target_asset: string;
}

export interface SimulationResult {
  scenario_id: string;
  strategy_code: string;
  target_asset: string;
  operator_id: string;
  security_benefit_score: number;
  simulated_downtime_minutes: number;
  recovery_effort: string;
  impacted_services: string[];
  safety_policy_status: "PASSED" | "VIOLATION_BLOCKED";
  safety_violation_reason?: string | null;
  evaluated_rules: Record<string, string>;
  integrity_hash: string;
  timestamp: string;
  simulated: boolean;
  audit_id?: string | null;
}

export function runSimulation(req: SimulationRequest): Promise<SimulationResult> {
  return request<SimulationResult>("/api/simulate", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export type ReviewDecision = "Approved for Demonstration" | "Rejected" | "Requires More Evidence";

export interface ReviewRequest {
  scenario_id: string;
  strategy_code: string;
  decision: ReviewDecision;
  notes: string;
}

export interface ReviewResponse {
  audit_id: string;
  decision: ReviewDecision;
  resource: string;
  recorded_at: string;
  chain_verified: boolean;
  simulated: boolean;
}

export function submitReview(review: ReviewRequest): Promise<ReviewResponse> {
  return request<ReviewResponse>("/api/recommendations/review", {
    method: "POST",
    body: JSON.stringify(review),
  });
}

export interface IncidentNoteResponse {
  audit_id: string;
  scenario_id: string;
  recorded_at: string;
  chain_verified: boolean;
  simulated: boolean;
}

/** Append an analyst note for a synthetic scenario to the append-only ledger. */
export function recordIncidentNote(
  incidentId: string,
  note: string
): Promise<IncidentNoteResponse> {
  return request<IncidentNoteResponse>(
    `/api/incidents/${encodeURIComponent(incidentId)}/notes`,
    { method: "POST", body: JSON.stringify({ note }) }
  );
}
