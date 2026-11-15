"""Canonical synthetic dataset for GARDA-SIM AI.

This module is the single source of truth for the synthetic fixtures on the
backend. Every identifier the safety engine accepts is derived from here, so the
policy cannot drift away from the inventory it is meant to protect.
"""

from typing import Dict, FrozenSet, List

from .schemas import (
    CandidateStrategySchema,
    IncidentSchema,
    SyntheticEvidenceSchema,
    VirtualAssetSchema,
)

SYNTHETIC_INCIDENT = IncidentSchema(
    id="INC-2026-0042",
    title="Suspicious Privilege Escalation",
    severity="critical",
    status="awaiting_review",
    target_asset="APP-GW-02",
    detected_at="2026-10-26T14:12:00Z",
    confidence=0.82,
    synthetic_identity="analyst-demo-03",
    summary="Anomalous privilege escalation detected originating from service account svc_worker on synthetic node APP-GW-02, accompanied by outbound telemetry probe attempts.",
    affected_services=["APP-GW-02", "OPS-DASH-01", "TELEMETRY-SIM-01"]
)

SYNTHETIC_INCIDENT_02 = IncidentSchema(
    id="INC-2026-0043",
    title="Anomalous Modbus Read Probe on OT-CONTROLLER",
    severity="warning",
    status="investigating",
    target_asset="OT-CONTROLLER-SIM-01",
    detected_at="2026-10-26T14:15:30Z",
    confidence=0.91,
    synthetic_identity="scada-probe-01",
    summary="Repeated non-standard Modbus function code 0x08 (Diagnostics) probed across field bus towards virtual industrial controller port 502.",
    affected_services=["OT-CONTROLLER-SIM-01", "TELEMETRY-SIM-01"]
)

VIRTUAL_ASSETS: List[VirtualAssetSchema] = [
    VirtualAssetSchema(
        id="IDENTITY-SVC-01",
        name="Identity & Access Controller",
        type="identity",
        status="healthy",
        ip_address="10.0.1.10",
        criticality="critical",
        depends_on=[]
    ),
    VirtualAssetSchema(
        id="APP-GW-02",
        name="Edge Application Gateway",
        type="gateway",
        status="compromised",
        ip_address="10.0.2.15",
        criticality="high",
        depends_on=["IDENTITY-SVC-01"]
    ),
    VirtualAssetSchema(
        id="MONITOR-01",
        name="SIEM & Event Collector",
        type="monitoring",
        status="healthy",
        ip_address="10.0.3.50",
        criticality="high",
        depends_on=["APP-GW-02"]
    ),
    VirtualAssetSchema(
        id="OPS-DASH-01",
        name="Operations Dashboard",
        type="dashboard",
        status="at_risk",
        ip_address="10.0.3.55",
        criticality="medium",
        depends_on=["APP-GW-02", "MONITOR-01"]
    ),
    VirtualAssetSchema(
        id="OT-CONTROLLER-SIM-01",
        name="Virtual Industrial Controller",
        type="ot_controller",
        status="healthy",
        ip_address="192.168.10.5",
        criticality="critical",
        depends_on=["APP-GW-02"]
    ),
    VirtualAssetSchema(
        id="TELEMETRY-SIM-01",
        name="Substation Telemetry Feed",
        type="telemetry",
        status="at_risk",
        ip_address="192.168.10.12",
        criticality="critical",
        depends_on=["OT-CONTROLLER-SIM-01"]
    ),
]

SYNTHETIC_EVIDENCE: List[SyntheticEvidenceSchema] = [
    SyntheticEvidenceSchema(
        id="EVD-101",
        timestamp="2026-10-26T14:10:12Z",
        source="HOST_AUDIT_DAEMON",
        category="Observed Fact",
        description="Unauthorized sudo token elevation detected for UID 1004 (svc_worker) on APP-GW-02",
        raw_payload={"uid": 1004, "binary": "/usr/bin/sudo", "target_uid": 0, "tty": "pts/2"},
        associated_asset="APP-GW-02"
    ),
    SyntheticEvidenceSchema(
        id="EVD-102",
        timestamp="2026-10-26T14:11:05Z",
        source="NETWORK_FLOW_PROBE",
        category="Observed Fact",
        description="Anomalous outbound TCP SYN connection attempt to external IP 198.51.100.44:443",
        raw_payload={"src_ip": "10.0.2.15", "dst_ip": "198.51.100.44", "port": 443, "proto": "TCP"},
        associated_asset="APP-GW-02"
    ),
    SyntheticEvidenceSchema(
        id="EVD-103",
        timestamp="2026-10-26T14:11:42Z",
        source="IDENTITY_ANALYTICS",
        category="Derived Assessment",
        description="Service token hash reused across multiple disparate remote session contexts",
        raw_payload={"token_id": "tk_svc_8849", "entropy_anomaly": 0.94},
        associated_asset="IDENTITY-SVC-01"
    ),
    SyntheticEvidenceSchema(
        id="EVD-104",
        timestamp="2026-10-26T14:12:00Z",
        source="OT_SAFETY_PROBE",
        category="Policy Validation",
        description="Lateral probe packet inspected targeting virtual industrial controller port 502 (Modbus)",
        raw_payload={"src": "APP-GW-02", "dst": "OT-CONTROLLER-SIM-01", "port": 502, "action": "INSPECTED"},
        associated_asset="OT-CONTROLLER-SIM-01"
    )
]

CANDIDATE_STRATEGIES: List[CandidateStrategySchema] = [
    CandidateStrategySchema(
        id="strat-01",
        code="STRAT-A",
        name="Full Network Isolation of APP-GW-02",
        description="Sever all inbound and outbound VLAN routing for APP-GW-02 immediately.",
        security_benefit_score=94,
        simulated_downtime_minutes=45,
        recovery_effort="High",
        impacted_services=["OPS-DASH-01", "TELEMETRY-SIM-01", "APP-GW-02"],
        safety_policy_status="VIOLATION_BLOCKED",
        safety_violation_reason="Violates Safety Rule SEC-OT-04: Telemetry stream to OT-CONTROLLER must never be abruptly severed without fail-safe switch.",
        is_ai_recommended=False,
        ai_rationale="While containment effectiveness is high (94%), this action causes an uncoordinated drop in vital telemetry feeds, violating deterministic safety rule SEC-OT-04."
    ),
    CandidateStrategySchema(
        id="strat-02",
        code="STRAT-B",
        name="Targeted Ingress Block & Credential Invalidation",
        description="Block external C2 IP 198.51.100.44 at perimeter firewall and revoke token tk_svc_8849.",
        security_benefit_score=88,
        simulated_downtime_minutes=0,
        recovery_effort="Low",
        impacted_services=[],
        safety_policy_status="PASSED",
        is_ai_recommended=True,
        ai_rationale="Recommended strategy. Effectively neutralizes external command-and-control connection while preserving uninterrupted internal telemetry for industrial controller nodes. Zero estimated service disruption."
    ),
    CandidateStrategySchema(
        id="strat-03",
        code="STRAT-C",
        name="Host Process Termination & Re-authentication",
        description="Terminate rogue worker process on APP-GW-02 and force immediate credential rotation.",
        security_benefit_score=72,
        simulated_downtime_minutes=5,
        recovery_effort="Medium",
        impacted_services=["APP-GW-02 (transient)"],
        safety_policy_status="PASSED",
        is_ai_recommended=False,
        ai_rationale="Adequate interim action, but leaves perimeter route open if new credentials leak before firewall rules propagate."
    )
]

SYNTHETIC_INCIDENTS: List[IncidentSchema] = [SYNTHETIC_INCIDENT, SYNTHETIC_INCIDENT_02]

# Canonical strategy lookup. The keys are the exact registry codes; callers that
# accept user input must normalise it first (see safety_engine.normalize).
STRATEGY_BY_CODE: Dict[str, CandidateStrategySchema] = {
    strategy.code: strategy for strategy in CANDIDATE_STRATEGIES
}

# --------------------------------------------------------------------------- #
# Derived identifier inventories
#
# The safety engine accepts only these identifiers. Deriving them from the
# fixtures above (instead of re-declaring them) is what keeps the policy and the
# inventory from drifting apart.
# --------------------------------------------------------------------------- #
SYNTHETIC_ASSET_IDS: FrozenSet[str] = frozenset(asset.id for asset in VIRTUAL_ASSETS)

KNOWN_SCENARIO_IDS: FrozenSet[str] = frozenset(
    incident.id for incident in SYNTHETIC_INCIDENTS
)

KNOWN_STRATEGY_IDS: FrozenSet[str] = frozenset(
    strategy.code for strategy in CANDIDATE_STRATEGIES
)

# The root identity controller is a single point of trust: isolating it would
# strand every dependent service, so SEC-OT-03 protects it unconditionally.
PROTECTED_ASSET_IDS: FrozenSet[str] = frozenset({"IDENTITY-SVC-01"})

# Assets whose telemetry stream must never be severed without a fail-safe switch
# (SEC-OT-04). A strategy is judged by the assets it would actually disconnect.
TELEMETRY_CRITICAL_ASSET_IDS: FrozenSet[str] = frozenset(
    {"TELEMETRY-SIM-01", "OT-CONTROLLER-SIM-01"}
)

# Scope of each scenario: the incident's own target plus its affected services.
SCENARIO_ASSET_SCOPE: Dict[str, FrozenSet[str]] = {
    incident.id: frozenset({incident.target_asset, *incident.affected_services})
    for incident in SYNTHETIC_INCIDENTS
}
