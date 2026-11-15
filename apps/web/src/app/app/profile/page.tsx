"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Loader2,
  LogOut,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { ApiError, SessionInfo, fetchSession, loadFailureHint, logout } from "@/lib/api-client";
import { SkeletonCard } from "@/components/ui/skeleton";

type TabKey = "account" | "credentials" | "session";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabKey>("account");
  const [session, setSession] = React.useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = React.useState<boolean>(false);
  const [signOutError, setSignOutError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchSession();
        if (!cancelled) setSession(data);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? loadFailureHint(err) : "Could not read the current session."
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);
    try {
      await logout();
      router.replace("/login");
    } catch (err) {
      setSignOutError(
        err instanceof ApiError ? err.message : "Sign-out failed. The session may still be active."
      );
      setIsSigningOut(false);
    }
  };

  const tabs: Array<[TabKey, string]> = [
    ["account", "Account identity"],
    ["credentials", "Credentials"],
    ["session", "Active session"],
  ];

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            {session ? "SESSION ACTIVE" : "READING SESSION"}
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Operator identity as resolved by the API · identity facts are not client-editable
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/profile</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
            Analyst Profile &amp; Clearance
          </h1>
          <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
            The clearance level shown here is the one the safety engine evaluates. It is read from
            the server session and cannot be raised from the browser.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={isSigningOut}
          className="bg-red-950/40 border border-red-500/40 hover:bg-red-900/50 text-red-200 text-xs font-medium px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningOut ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              <span>Signing out…</span>
            </>
          ) : (
            <>
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Log out</span>
            </>
          )}
        </button>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{loadError}</span>
        </div>
      ) : null}

      {signOutError ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-200"
        >
          {signOutError}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-6 border-b border-[#383838] text-xs" role="tablist">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === key
                ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
                : "text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <p role="status" aria-live="polite" className="sr-only">
            Loading session
          </p>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : null}

      {!isLoading && activeTab === "account" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#FF6B35]" aria-hidden="true" />
              <span>SOC operator identity</span>
            </h2>

            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-[#737373]">Display name</dt>
                <dd className="text-[#F5F5F5] font-mono">{session?.display_name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[#737373]">Operator identifier</dt>
                <dd className="font-mono text-[#F5F5F5]">{session?.operator_id ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[#737373]">Clearance level</dt>
                <dd className="font-mono text-emerald-400 font-bold">
                  {session ? `Level ${session.clearance}` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[#737373]">Session expires</dt>
                <dd className="font-mono text-[#F5F5F5]">{session?.expires_at ?? "—"}</dd>
              </div>
            </dl>

            <p className="text-[11px] text-[#737373] mt-4 leading-relaxed">
              There is no profile-edit endpoint in this build, so the fields above are read-only
              rather than an editable form that silently discards your changes.
            </p>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#F5F5F5] mb-2">
                Deterministic clearance (SEC-OT-02)
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                SEC-OT-02 requires a registered operator whose clearance meets the configured
                minimum. The rule reads the session record on the server; it never trusts an operator
                identifier supplied in a request body.
              </p>

              {session ? (
                <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {session.operator_id} is authorized to run simulations and record review
                    decisions.
                  </span>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                  No active session could be read from the API.
                </div>
              )}
            </div>

            <div className="text-xs text-[#737373] mt-4 font-mono">
              STATUS: {session ? "AUTHORIZED_OPERATOR" : "UNKNOWN"}
            </div>
          </div>
        </div>
      )}

      {!isLoading && activeTab === "credentials" && (
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-6 max-w-2xl">
          <h2 className="text-base font-semibold text-[#F5F5F5] mb-2 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#FF6B35]" aria-hidden="true" />
            <span>Password management</span>
          </h2>

          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            Password change is not implemented in this build. The API stores PBKDF2-SHA256 hashes and
            verifies them on login, but exposes no self-service rotation endpoint, so the control is
            shown as unavailable rather than as a form that would pretend to work.
          </p>

          <div className="mt-4 space-y-3">
            <label htmlFor="profile-password-disabled" className="block text-[#A3A3A3] text-xs">
              New password
            </label>
            <input
              id="profile-password-disabled"
              type="password"
              disabled
              placeholder="Not available in this build"
              className="w-full bg-[#1C1C1C] border border-[#383838] rounded-lg p-2.5 text-xs text-[#737373] cursor-not-allowed"
            />
            <button
              type="button"
              disabled
              className="bg-[#2C2C2C] border border-[#383838] text-[#737373] text-xs font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2 cursor-not-allowed"
            >
              <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Update credentials — not implemented</span>
            </button>
          </div>

          <p className="text-[11px] text-[#737373] mt-4 leading-relaxed">
            To reset the demo credential, set{" "}
            <code className="font-mono">GARDA_DEMO_PASSWORD</code> before starting the API, or delete{" "}
            <code className="font-mono">.garda/demo-credentials.txt</code> so a new one is generated.
          </p>
        </div>
      )}

      {!isLoading && activeTab === "session" && (
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-6 max-w-2xl">
          <h2 className="text-base font-semibold text-[#F5F5F5] mb-2">Active workspace session</h2>

          <dl className="p-3 bg-[#1C1C1C] border border-[#333] rounded-lg text-xs space-y-1.5 font-mono">
            <div className="flex justify-between gap-3">
              <dt className="text-[#737373]">Operator</dt>
              <dd className="text-[#F5F5F5]">{session?.operator_id ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#737373]">Clearance</dt>
              <dd className="text-[#F5F5F5]">
                {session ? `Level ${session.clearance}` : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#737373]">Expires</dt>
              <dd className="text-[#F5F5F5]">{session?.expires_at ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#737373]">Synthetic session</dt>
              <dd className="text-[#F5F5F5]">
                {session ? (session.synthetic_session ? "true" : "false") : "—"}
              </dd>
            </div>
          </dl>

          <p className="text-[11px] text-[#737373] mt-3 leading-relaxed">
            The session token is stored in an HttpOnly cookie and only its SHA-256 digest is kept
            server-side. This page cannot list other sessions, because the API does not expose a
            session inventory.
          </p>
        </div>
      )}

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Identity verification · server-resolved session facts</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>OPERATOR: {session?.operator_id ?? "—"}</span>
          <span>CLEARANCE: {session ? `LEVEL_${session.clearance}` : "—"}</span>
        </div>
      </div>
    </>
  );
}
