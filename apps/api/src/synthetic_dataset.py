from typing import List, Dict
from .schemas import IncidentSchema, VirtualAssetSchema, SyntheticEvidenceSchema, CandidateStrategySchema, AuditEntrySchema

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

INITIAL_AUDIT_LOGS: List[AuditEntrySchema] = [
    AuditEntrySchema(
        id="AUD-8849-01",
        timestamp="2026-10-26T15:42:10Z",
        actor="analyst-demo-03",
        event_type="STRATEGY_APPROVED",
        resource="STRAT-B (INC-2026-0042)",
        result="SUCCESS",
        details="Approved STRAT-B for demonstration review with verified OT telemetry continuity.",
        integrity_hash="8f4a1c729b2e"
    ),
    AuditEntrySchema(
        id="AUD-8849-02",
        timestamp="2026-10-26T15:40:02Z",
        actor="system-safety-engine",
        event_type="POLICY_INVARIANT_EVAL",
        resource="STRAT-A (INC-2026-0042)",
        result="VIOLATION_BLOCKED",
        details="Blocked candidate STRAT-A due to Rule SEC-OT-04 telemetry cutoff violation.",
        integrity_hash="3d22bf106a4c"
    )
]
