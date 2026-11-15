export interface SyntheticIncident {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info" | "neutral";
  status: "active" | "investigating" | "awaiting_review" | "contained" | "simulated";
  targetAsset: string;
  detectedAt: string;
  confidence: number;
  syntheticIdentity: string;
  summary: string;
  affectedServices: string[];
}

export interface VirtualAsset {
  id: string;
  name: string;
  type: "gateway" | "identity" | "ot_controller" | "monitoring" | "dashboard" | "telemetry";
  status: "healthy" | "at_risk" | "compromised" | "isolated";
  ipAddress: string;
  criticality: "high" | "critical" | "medium";
  dependsOn: string[];
}

export interface SyntheticEvidence {
  id: string;
  timestamp: string;
  source: string;
  category: "Observed Fact" | "Derived Assessment" | "Policy Validation";
  description: string;
  rawPayload: Record<string, unknown>;
  associatedAsset: string;
}

export interface CandidateStrategy {
  id: string;
  code: string;
  name: string;
  description: string;
  securityBenefitScore: number; // 0-100
  simulatedDowntimeMinutes: number;
  recoveryEffort: "Low" | "Medium" | "High";
  impactedServices: string[];
  safetyPolicyStatus: "PASSED" | "VIOLATION_BLOCKED";
  safetyViolationReason?: string;
  isAiRecommended: boolean;
  aiRationale: string;
}

export const SYNTHETIC_INCIDENT: SyntheticIncident = {
  id: "INC-2026-0042",
  title: "Suspicious Privilege Escalation",
  severity: "critical",
  status: "awaiting_review",
  targetAsset: "APP-GW-02",
  detectedAt: "2026-10-26T14:12:00Z",
  confidence: 0.82,
  syntheticIdentity: "analyst-demo-03",
  summary:
    "Anomalous privilege escalation detected originating from service account svc_worker on synthetic node APP-GW-02, accompanied by outbound telemetry probe attempts.",
  affectedServices: ["APP-GW-02", "OPS-DASH-01", "TELEMETRY-SIM-01"],
};

export const SYNTHETIC_INCIDENT_02: SyntheticIncident = {
  id: "INC-2026-0043",
  title: "Anomalous Modbus Read Probe on OT-CONTROLLER",
  severity: "warning",
  status: "investigating",
  targetAsset: "OT-CONTROLLER-SIM-01",
  detectedAt: "2026-10-26T14:15:30Z",
  confidence: 0.91,
  syntheticIdentity: "scada-probe-01",
  summary:
    "Repeated non-standard Modbus function code 0x08 (Diagnostics) probed across field bus towards virtual industrial controller port 502.",
  affectedServices: ["OT-CONTROLLER-SIM-01", "TELEMETRY-SIM-01"],
};

export const SYNTHETIC_INCIDENTS: SyntheticIncident[] = [
  SYNTHETIC_INCIDENT,
  SYNTHETIC_INCIDENT_02,
];

export const VIRTUAL_ASSETS: VirtualAsset[] = [
  {
    id: "IDENTITY-SVC-01",
    name: "Identity & Access Controller",
    type: "identity",
    status: "healthy",
    ipAddress: "10.0.1.10",
    criticality: "critical",
    dependsOn: [],
  },
  {
    id: "APP-GW-02",
    name: "Edge Application Gateway",
    type: "gateway",
    status: "compromised",
    ipAddress: "10.0.2.15",
    criticality: "high",
    dependsOn: ["IDENTITY-SVC-01"],
  },
  {
    id: "MONITOR-01",
    name: "SIEM & Event Collector",
    type: "monitoring",
    status: "healthy",
    ipAddress: "10.0.3.50",
    criticality: "high",
    dependsOn: ["APP-GW-02"],
  },
  {
    id: "OPS-DASH-01",
    name: "Operations Dashboard",
    type: "dashboard",
    status: "at_risk",
    ipAddress: "10.0.3.55",
    criticality: "medium",
    dependsOn: ["APP-GW-02", "MONITOR-01"],
  },
  {
    id: "OT-CONTROLLER-SIM-01",
    name: "Virtual Industrial Controller",
    type: "ot_controller",
    status: "healthy",
    ipAddress: "192.168.10.5",
    criticality: "critical",
    dependsOn: ["APP-GW-02"],
  },
  {
    id: "TELEMETRY-SIM-01",
    name: "Substation Telemetry Feed",
    type: "telemetry",
    status: "at_risk",
    ipAddress: "192.168.10.12",
    criticality: "critical",
    dependsOn: ["OT-CONTROLLER-SIM-01"],
  },
];

export const SYNTHETIC_EVIDENCE_LIST: SyntheticEvidence[] = [
  {
    id: "EVD-101",
    timestamp: "2026-10-26T14:10:12Z",
    source: "HOST_AUDIT_DAEMON",
    category: "Observed Fact",
    description: "Unauthorized sudo token elevation detected for UID 1004 (svc_worker) on APP-GW-02",
    rawPayload: { uid: 1004, binary: "/usr/bin/sudo", target_uid: 0, tty: "pts/2" },
    associatedAsset: "APP-GW-02",
  },
  {
    id: "EVD-102",
    timestamp: "2026-10-26T14:11:05Z",
    source: "NETWORK_FLOW_PROBE",
    category: "Observed Fact",
    description: "Anomalous outbound TCP SYN connection attempt to external IP 198.51.100.44:443",
    rawPayload: { src_ip: "10.0.2.15", dst_ip: "198.51.100.44", port: 443, proto: "TCP" },
    associatedAsset: "APP-GW-02",
  },
  {
    id: "EVD-103",
    timestamp: "2026-10-26T14:11:42Z",
    source: "IDENTITY_ANALYTICS",
    category: "Derived Assessment",
    description: "Service token hash reused across multiple disparate remote session contexts",
    rawPayload: { token_id: "tk_svc_8849", entropy_anomaly: 0.94 },
    associatedAsset: "IDENTITY-SVC-01",
  },
  {
    id: "EVD-104",
    timestamp: "2026-10-26T14:12:00Z",
    source: "OT_SAFETY_PROBE",
    category: "Policy Validation",
    description: "Lateral probe packet inspected targeting virtual industrial controller port 502 (Modbus)",
    rawPayload: { src: "APP-GW-02", dst: "OT-CONTROLLER-SIM-01", port: 502, action: "INSPECTED" },
    associatedAsset: "OT-CONTROLLER-SIM-01",
  },
];

export const CANDIDATE_STRATEGIES: CandidateStrategy[] = [
  {
    id: "strat-01",
    code: "STRAT-A",
    name: "Full Network Isolation of APP-GW-02",
    description: "Sever all inbound and outbound VLAN routing for APP-GW-02 immediately.",
    securityBenefitScore: 94,
    simulatedDowntimeMinutes: 45,
    recoveryEffort: "High",
    impactedServices: ["OPS-DASH-01", "TELEMETRY-SIM-01", "APP-GW-02"],
    safetyPolicyStatus: "VIOLATION_BLOCKED",
    safetyViolationReason: "Violates Safety Rule SEC-OT-04: Telemetry stream to OT-CONTROLLER must never be abruptly severed without fail-safe switch.",
    isAiRecommended: false,
    aiRationale:
      "While containment effectiveness is high (94%), this action causes an uncoordinated drop in vital telemetry feeds, violating deterministic safety rule SEC-OT-04.",
  },
  {
    id: "strat-02",
    code: "STRAT-B",
    name: "Targeted Ingress Block & Credential Invalidation",
    description: "Block external C2 IP 198.51.100.44 at perimeter firewall and revoke token tk_svc_8849.",
    securityBenefitScore: 88,
    simulatedDowntimeMinutes: 0,
    recoveryEffort: "Low",
    impactedServices: [],
    safetyPolicyStatus: "PASSED",
    isAiRecommended: true,
    aiRationale:
      "Recommended strategy. Effectively neutralizes external command-and-control connection while preserving uninterrupted internal telemetry for industrial controller nodes. Zero estimated service disruption.",
  },
  {
    id: "strat-03",
    code: "STRAT-C",
    name: "Host Process Termination & Re-authentication",
    description: "Terminate rogue worker process on APP-GW-02 and force immediate credential rotation.",
    securityBenefitScore: 72,
    simulatedDowntimeMinutes: 5,
    recoveryEffort: "Medium",
    impactedServices: ["APP-GW-02 (transient)"],
    safetyPolicyStatus: "PASSED",
    isAiRecommended: false,
    aiRationale:
      "Adequate interim action, but leaves perimeter route open if new credentials leak before firewall rules propagate.",
  },
];
