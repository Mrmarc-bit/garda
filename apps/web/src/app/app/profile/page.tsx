"use client";

import * as React from "react";
import {
  User,
  Shield,
  ShieldCheck,
  Key,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <AppLayout
      title="Operator Profile"
      subtitle="SOC operator credentials, authorization clearance, and session security attributes"
    >
      <div className="max-w-4xl space-y-6">
        {/* User Card */}
        <Card className="border-border bg-surface-card">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-surface-elevated border-2 border-accent flex items-center justify-center text-2xl font-bold text-accent shrink-0">
              AD
            </div>
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-text-primary">analyst-demo-03</h2>
                <Badge variant="simulation">Synthetic Operator</Badge>
                <Badge variant="success">Active Session</Badge>
              </div>
              <p className="text-xs text-text-muted">
                Role: Senior SOC Defensive Analyst · Clearance Level 2 (Decision-Support Simulator)
              </p>
              <div className="text-[11px] font-mono text-text-muted pt-1">
                Tenant: SYNTHETIC-LAB-DEFENSE-01 · Session ID: sess_demo_9841
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authorization Attributes and Capabilities */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-semibold">Simulator Authorization Clearance</CardTitle>
            <CardDescription>
              Role-based capabilities assigned under defensive simulation boundary
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-surface-elevated/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary">Run Deterministic Simulation Engine</span>
                <p className="text-text-muted text-[11px]">Permission to trigger impact calculations across all virtual assets.</p>
              </div>
              <Badge variant="success" size="sm">Authorized</Badge>
            </div>

            <div className="p-3 rounded-lg border border-border bg-surface-elevated/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary">Demonstration Scenario Approval</span>
                <p className="text-text-muted text-[11px]">Authorized to sign off on strategy recommendations for evaluation records.</p>
              </div>
              <Badge variant="success" size="sm">Authorized</Badge>
            </div>

            <div className="p-3 rounded-lg border border-border bg-surface-elevated/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary">Real-World Network Containment</span>
                <p className="text-text-muted text-[11px]">Direct isolation of external production systems.</p>
              </div>
              <Badge variant="critical" size="sm">Permanently Disabled by Architecture</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
