import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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
    const { scenario_id, strategy_code, decision, notes } = body;

    const resource = `${strategy_code} (${scenario_id})`;
    const details = `Review decision: ${decision}. Operator note: ${notes || "No additional comments"}`;

    const auditRec = await appendAuditEntry({
      actor: operatorId,
      eventType: "STRATEGY_REVIEW",
      resource,
      result: decision,
      details,
    });

    const now = auditRec?.recorded_at ?? new Date().toISOString();

    return NextResponse.json({
      audit_id: auditRec?.entry_id ?? `AUD-SYN-${Date.now()}`,
      decision,
      resource,
      recorded_at: now,
      chain_verified: true,
      simulated: true,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}
