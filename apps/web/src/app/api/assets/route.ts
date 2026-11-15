import { NextResponse } from "next/server";
import { VIRTUAL_ASSETS } from "@/lib/synthetic-data";

export async function GET() {
  const assets = VIRTUAL_ASSETS.map((asset) => ({
    id: asset.id,
    name: asset.name,
    type: asset.type,
    status: asset.status,
    ip_address: asset.ipAddress,
    criticality: asset.criticality,
    depends_on: asset.dependsOn,
  }));
  return NextResponse.json(assets);
}
