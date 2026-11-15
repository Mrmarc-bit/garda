import { NextResponse } from "next/server";
import { SYNTHETIC_EVIDENCE_LIST } from "@/lib/synthetic-data";

export async function GET() {
  const evidence = SYNTHETIC_EVIDENCE_LIST.map((item) => ({
    id: item.id,
    timestamp: item.timestamp,
    source: item.source,
    category: item.category,
    description: item.description,
    raw_payload: item.rawPayload,
    associated_asset: item.associatedAsset,
  }));
  return NextResponse.json(evidence);
}
