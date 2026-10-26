"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState("analyst-demo-03");
  const [password, setPassword] = React.useState("SimulatorDemo2026!");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/app");
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername("analyst-demo-03");
    setPassword("SimulatorDemo2026!");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-bg-primary text-text-primary relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <span className="font-bold text-lg text-text-primary tracking-wide">GARDA-SIM AI</span>
          </Link>
          <div className="pt-2">
            <h1 className="text-xl font-bold text-text-primary">Sign in to Console</h1>
            <p className="text-xs text-text-muted mt-1">
              Defensive Cyber Incident Response Decision-Support Simulator
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-surface-card p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Simulation Environment
            </span>
            <Badge variant="simulation" size="sm">SIMULATION ONLY</Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Username or Email</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="analyst-demo-03"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-text-secondary">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full gap-2"
                isLoading={isLoading}
              >
                <span>Enter Simulator Console</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Preset Button */}
          <div className="pt-3 border-t border-border text-center space-y-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-text-muted hover:text-accent font-mono transition-colors"
            >
              Preset: Fill Demo Analyst Credentials (analyst-demo-03)
            </button>
            <div className="text-[11px] text-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-accent hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="text-center text-[11px] text-text-muted">
          Notice: Authenticated session operates strictly in synthetic simulation mode.
        </div>
      </div>
    </div>
  );
}
