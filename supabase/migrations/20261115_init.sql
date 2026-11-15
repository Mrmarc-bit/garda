-- =============================================================================
-- GARDA-SIM AI Database Schema for Supabase (PostgreSQL)
-- Implements append-only audit trail triggers, session resolution, and operators
-- =============================================================================

-- 1. OPERATORS REGISTRY
CREATE TABLE IF NOT EXISTS public.operators (
    operator_id   TEXT PRIMARY KEY,
    display_name  TEXT NOT NULL,
    clearance     INTEGER NOT NULL CHECK (clearance BETWEEN 1 AND 5),
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;

-- 2. SESSIONS (Short-lived tokens)
CREATE TABLE IF NOT EXISTS public.sessions (
    token         TEXT PRIMARY KEY,
    operator_id   TEXT NOT NULL REFERENCES public.operators(operator_id) ON DELETE CASCADE,
    clearance     INTEGER NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON public.sessions (expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_operator_id ON public.sessions (operator_id);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 3. AUDIT LEDGER (Append-only & Tamper-evident)
CREATE TABLE IF NOT EXISTS public.audit_entries (
    seq           BIGSERIAL PRIMARY KEY,
    entry_id      TEXT NOT NULL UNIQUE,
    recorded_at   TIMESTAMPTZ NOT NULL,
    actor         TEXT NOT NULL,
    event_type    TEXT NOT NULL,
    resource      TEXT NOT NULL,
    result        TEXT NOT NULL,
    details       TEXT NOT NULL,
    prev_hash     TEXT NOT NULL,
    entry_hash    TEXT NOT NULL,
    is_synthetic  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_audit_recorded_at ON public.audit_entries (recorded_at);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON public.audit_entries (event_type);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON public.audit_entries (resource);

ALTER TABLE public.audit_entries ENABLE ROW LEVEL SECURITY;

-- 4. APPEND-ONLY ENFORCEMENT TRIGGERS (PostgreSQL)
CREATE OR REPLACE FUNCTION public.reject_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'The audit ledger is append-only: UPDATE and DELETE operations are strictly forbidden.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reject_audit_update ON public.audit_entries;
CREATE TRIGGER reject_audit_update
    BEFORE UPDATE ON public.audit_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.reject_audit_tampering();

DROP TRIGGER IF EXISTS reject_audit_delete ON public.audit_entries;
CREATE TRIGGER reject_audit_delete
    BEFORE DELETE ON public.audit_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.reject_audit_tampering();

-- 5. SEED SYNTHETIC OPERATORS (Default Demo Operators)
-- Password hash corresponds to standard test/demo password: pbkdf2_sha256$210000$...
INSERT INTO public.operators (operator_id, display_name, clearance, password_hash)
VALUES
    ('analyst-demo-03', 'Nadia Rahman', 2, 'pbkdf2_sha256$210000$c6dd5c2cbfa10b91df130ae9e3a64968$c515a0c3bb05cb239eb87431e7807ec3dd813d10079093f41fc86a51d92aa9c5'),
    ('analyst-demo-01', 'Rizky Pratama', 3, 'pbkdf2_sha256$210000$c6dd5c2cbfa10b91df130ae9e3a64968$c515a0c3bb05cb239eb87431e7807ec3dd813d10079093f41fc86a51d92aa9c5'),
    ('auditor-demo-02', 'Sari Wulandari', 3, 'pbkdf2_sha256$210000$c6dd5c2cbfa10b91df130ae9e3a64968$c515a0c3bb05cb239eb87431e7807ec3dd813d10079093f41fc86a51d92aa9c5')
ON CONFLICT (operator_id) DO NOTHING;

-- 6. SEED INITIAL AUDIT LEDGER EVENTS
INSERT INTO public.audit_entries (entry_id, recorded_at, actor, event_type, resource, result, details, prev_hash, entry_hash, is_synthetic)
VALUES
    (
        'AUD-SYN-0001',
        timezone('utc'::text, now()),
        'system-safety-engine',
        'POLICY_INVARIANT_EVAL',
        'STRAT-A (INC-2026-0042)',
        'VIOLATION_BLOCKED',
        'Seeded synthetic record: STRAT-A blocked by SEC-OT-04 (OT telemetry cutoff).',
        'GENESIS',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        TRUE
    ),
    (
        'AUD-SYN-0002',
        timezone('utc'::text, now()),
        'analyst-demo-03',
        'STRATEGY_REVIEW',
        'STRAT-B (INC-2026-0042)',
        'Approved for Demonstration',
        'Seeded synthetic record: STRAT-B approved for demonstration review.',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'c4ca4238a0b923820dcc509a6f75849b28b753444453b70868f9a2e6f4325e6c',
        TRUE
    )
ON CONFLICT (entry_id) DO NOTHING;
