import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    environment: "production",
    simulation_only: true,
    data_backend: "supabase-postgresql",
    strict_ot_mode: true,
    min_operator_clearance: 2,
    session_ttl_minutes: 480,
  });
}
