import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

const SESSION_COOKIE = "garda_session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ detail: "unauthenticated" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data: session, error: sessError } = await supabase
      .from("sessions")
      .select("token, operator_id, clearance, expires_at")
      .eq("token", token)
      .single();

    if (sessError || !session) {
      return NextResponse.json({ detail: "unauthenticated" }, { status: 401 });
    }

    if (new Date(session.expires_at) < new Date()) {
      await supabase.from("sessions").delete().eq("token", token);
      const res = NextResponse.json({ detail: "unauthenticated" }, { status: 401 });
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }

    const { data: operator } = await supabase
      .from("operators")
      .select("display_name")
      .eq("operator_id", session.operator_id)
      .single();

    return NextResponse.json({
      operator_id: session.operator_id,
      display_name: operator?.display_name ?? session.operator_id,
      clearance: session.clearance,
      expires_at: session.expires_at,
      synthetic_session: true,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}
