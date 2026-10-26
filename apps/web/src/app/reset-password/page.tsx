"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => router.push("/login"), 1500);
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
          <h1 className="text-xl font-bold text-text-primary pt-2">Set New Password</h1>
          <p className="text-xs text-text-muted">Enter and confirm your new access credentials</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-card p-6 md:p-8 space-y-6 shadow-2xl">
          {isSuccess ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 rounded-full bg-status-success/20 text-status-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-primary">Password Updated</h3>
              <p className="text-xs text-text-muted">Redirecting to login console...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">New Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full text-xs">
                Update Password & Sign In
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
