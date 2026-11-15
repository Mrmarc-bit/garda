import { NextResponse } from "next/server";
import { CANDIDATE_STRATEGIES } from "@/lib/synthetic-data";

export async function GET() {
  const strategies = CANDIDATE_STRATEGIES.map((strat) => ({
    id: strat.id,
    code: strat.code,
    name: strat.name,
    description: strat.description,
    security_benefit_score: strat.securityBenefitScore,
    simulated_downtime_minutes: strat.simulatedDowntimeMinutes,
    recovery_effort: strat.recoveryEffort,
    impacted_services: strat.impactedServices,
    safety_policy_status: strat.safetyPolicyStatus,
    safety_violation_reason: strat.safetyViolationReason ?? null,
    is_ai_recommended: strat.isAiRecommended,
    ai_rationale: strat.aiRationale,
  }));
  return NextResponse.json(strategies);
}
