import { NextResponse } from "next/server";
import { SYNTHETIC_INCIDENT } from "@/lib/synthetic-data";

export async function GET() {
  const incidents = [
    {
      id: SYNTHETIC_INCIDENT.id,
      title: SYNTHETIC_INCIDENT.title,
      severity: SYNTHETIC_INCIDENT.severity,
      status: SYNTHETIC_INCIDENT.status,
      target_asset: SYNTHETIC_INCIDENT.targetAsset,
      detected_at: SYNTHETIC_INCIDENT.detectedAt,
      confidence: SYNTHETIC_INCIDENT.confidence,
      synthetic_identity: SYNTHETIC_INCIDENT.syntheticIdentity,
      summary: SYNTHETIC_INCIDENT.summary,
      affected_services: SYNTHETIC_INCIDENT.affectedServices,
    },
  ];
  return NextResponse.json(incidents);
}
