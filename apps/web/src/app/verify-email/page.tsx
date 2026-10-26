"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = React.useState("984-210");
  const [isVerified, setIsVerified] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerified(true);
    setTimeout(() => router.push("/onboarding"), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-bg-primary text-text-primary">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <span className="font-bold text-lg text-text-primary tracking-wide">GARDA-SIM AI</span>
          </Link>
          <h1 className="text-xl font-bold text-text-primary pt-2">Verify Email Address</h1>
          <p className="text-xs text-text-muted">Enter verification code sent to your account email</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-card p-6 md:p-8 space-y-6 shadow-2xl">
          {isVerified ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 rounded-full bg-status-success/20 text-status-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-primary">Email Verified</h3>
              <p className="text-xs text-text-muted">Proceeding to simulation lab setup wizard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-medium text-text-secondary">6-Digit Verification Code</label>
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="000-000"
                  className="text-center font-mono tracking-widest text-lg font-bold"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full text-xs">
                Confirm & Enter Lab
              </Button>
            </form>
          )}

          <div className="pt-2 border-t border-border text-center text-xs text-text-muted">
            Didn&apos;t receive code?{" "}
            <button type="button" className="text-accent hover:underline font-medium">
              Resend verification code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
