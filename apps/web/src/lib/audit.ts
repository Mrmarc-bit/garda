import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface AppendAuditParams {
  actor: string;
  eventType: string;
  resource: string;
  result: string;
  details: string;
}

export async function appendAuditEntry(params: AppendAuditParams) {
  const supabase = getSupabaseAdmin();

  // Get latest entry for prev_hash
  const { data: latest } = await supabase
    .from("audit_entries")
    .select("seq, entry_hash")
    .order("seq", { ascending: false })
    .limit(1)
    .single();

  const prevHash = latest?.entry_hash ?? "GENESIS";
  const entryId = `AUD-SYN-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const now = new Date().toISOString();

  const canonical = `${params.actor}|${params.eventType}|${params.resource}|${params.result}|${params.details}|${now}`;
  const entryHash = crypto.createHash("sha256").update(prevHash + canonical).digest("hex");

  const { data, error } = await supabase
    .from("audit_entries")
    .insert({
      entry_id: entryId,
      recorded_at: now,
      actor: params.actor,
      event_type: params.eventType,
      resource: params.resource,
      result: params.result,
      details: params.details,
      prev_hash: prevHash,
      entry_hash: entryHash,
      is_synthetic: true,
    })
    .select("entry_id, recorded_at")
    .single();

  if (error) {
    console.error("Failed to append audit entry:", error);
    return null;
  }

  return data;
}
