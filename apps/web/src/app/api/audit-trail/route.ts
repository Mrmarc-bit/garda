import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

    const supabase = getSupabaseAdmin();
    const { count, error: countErr } = await supabase
      .from("audit_entries")
      .select("*", { count: "exact", head: true });

    if (countErr) {
      return NextResponse.json({ detail: countErr.message }, { status: 500 });
    }

    const { data: rows, error: selectErr } = await supabase
      .from("audit_entries")
      .select("entry_id, seq, recorded_at, actor, event_type, resource, result, details, entry_hash, prev_hash, is_synthetic")
      .order("seq", { ascending: false })
      .range(offset, offset + limit - 1);

    if (selectErr) {
      return NextResponse.json({ detail: selectErr.message }, { status: 500 });
    }

    const entries = (rows || []).map((row) => ({
      id: row.entry_id,
      seq: row.seq,
      timestamp: row.recorded_at,
      actor: row.actor,
      event_type: row.event_type,
      resource: row.resource,
      result: row.result,
      details: row.details,
      entry_hash: row.entry_hash,
      prev_hash: row.prev_hash,
      is_synthetic: row.is_synthetic,
    }));

    return NextResponse.json({
      entries,
      total: count ?? entries.length,
      limit,
      offset,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}
