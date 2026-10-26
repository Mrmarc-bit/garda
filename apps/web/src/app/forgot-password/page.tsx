"use client";

import * as React from "react";
import Link from "next/link";
import { Shield, ArrowRight, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          <h1 className="text-xl font-bold text-text-primary pt-2">Reset Password</h1>
          <p className="text-xs text-text-muted">Enter your email to receive recovery instructions</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-card p-6 md:p-8 space-y-6 shadow-2xl">
          {submitted ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 rounded-full bg-status-success/20 text-status-success flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-primary">Recovery Link Dispatched</h3>
              <p className="text-xs text-text-muted">
                Simulated recovery token sent to <strong>{email}</strong>.
              </p>
              <div className="pt-2">
                <Link href="/reset-password">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Continue to Password Reset
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@defense.sim"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full text-xs">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="pt-2 border-t border-border text-center">
            <Link href="/login" className="text-xs text-accent hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
