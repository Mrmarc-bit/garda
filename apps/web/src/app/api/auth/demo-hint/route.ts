import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    operator_id: "analyst-demo-03",
    password: "demo",
  });
}
