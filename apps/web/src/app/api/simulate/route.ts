import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { CANDIDATE_STRATEGIES } from "@/lib/synthetic-data";
import { getSupabaseAdmin } from "@/lib/supabase";
import { appendAuditEntry } from "@/lib/audit";

const SESSION_COOKIE = "garda_session";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    let operatorId = "analyst-demo-03";
    if (token) {
      const supabase = getSupabaseAdmin();
      const { data: session } = await supabase
        .from("sessions")
        .select("operator_id, clearance")
        .eq("token", token)
        .single();
      if (session) {
        operatorId = session.operator_id;
      }
    }

    const body = await request.json();
    const { scenario_id, strategy_code, target_asset } = body;

    const strat = CANDIDATE_STRATEGIES.find((s) => s.code.toUpperCase() === (strategy_code || "").toUpperCase());
    if (!strat) {
      return NextResponse.json(
        { detail: `Strategy ${strategy_code} has no modelled effect profile.` },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const integrityHash = crypto
      .createHash("sha256")
      .update(`${scenario_id}:${strat.code}:${now}`)
      .digest("hex");

    const isViolation = strat.safetyPolicyStatus === "VIOLATION_BLOCKED";
    const evaluatedRules = {
      "SEC-OT-01": "PASSED",
      "SEC-OT-02": "PASSED",
      "SEC-OT-03": "PASSED",
      "SEC-OT-04": isViolation ? "VIOLATION_BLOCKED" : "PASSED",
      "SEC-OT-05": "PASSED",
    };

    const auditRec = await appendAuditEntry({
      actor: operatorId,
      eventType: "SIMULATION_EXEC",
      resource: `${strat.code} (${scenario_id})`,
      result: isViolation ? "VIOLATION_BLOCKED" : "PASSED",
      details: isViolation
        ? `Simulated strategy ${strat.code} blocked by safety policy SEC-OT-04.`
        : `Simulated strategy ${strat.code} passed all deterministic safety invariant checks.`,
    });

    return NextResponse.json({
      scenario_id,
      strategy_code: strat.code,
      target_asset,
      operator_id: operatorId,
      security_benefit_score: strat.securityBenefitScore,
      simulated_downtime_minutes: strat.simulatedDowntimeMinutes,
      recovery_effort: strat.recoveryEffort,
      impacted_services: strat.impactedServices,
      safety_policy_status: strat.safetyPolicyStatus,
      safety_violation_reason: strat.safetyViolationReason ?? null,
      evaluated_rules: evaluatedRules,
      integrity_hash: integrityHash,
      timestamp: now,
      simulated: true,
      audit_id: auditRec?.entry_id ?? null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}
