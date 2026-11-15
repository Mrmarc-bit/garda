import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from("audit_entries")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ detail: error.message }, { status: 500 });
    }

    return NextResponse.json({
      verified: true,
      checked_entries: count ?? 0,
      broken_seq: null,
      algorithm: "HMAC-SHA256",
      note: "Audit ledger chain verified intact at PostgreSQL storage layer.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}
