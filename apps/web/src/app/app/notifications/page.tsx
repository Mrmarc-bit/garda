"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState([
    {
      id: "NOTIF-01",
      title: "Urgent: Incident INC-2026-0042 Awaiting Strategy Review",
      description: "Candidate STRAT-B has passed all 5 safety policy invariants and requires SOC operator sign-off.",
      timestamp: "10 mins ago",
      type: "critical" as const,
      isRead: false,
      link: "/app/recommendations",
    },
    {
      id: "NOTIF-02",
      title: "Deterministic Safety Policy Invariant Triggered",
      description: "Candidate STRAT-A isolation action automatically blocked by Safety Rule SEC-OT-04.",
      timestamp: "18 mins ago",
      type: "warning" as const,
      isRead: false,
      link: "/app/simulator",
    },
    {
      id: "NOTIF-03",
      title: "Synthetic SCADA Telemetry Anomaly Ingested",
      description: "Probe sensor EVD-104 registered Modbus scan attempt towards virtual controller node.",
      timestamp: "35 mins ago",
      type: "info" as const,
      isRead: true,
      link: "/app/evidence",
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppLayout
      title="Notifications & Alerts"
      subtitle="Operational simulator alerts, pending approval requests, and policy invariant notifications"
    >
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-card">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">System Notification Center</h2>
          <p className="text-xs text-text-muted">
            Track pending human-review tasks and automated safety alerts.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs">
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`border transition-all ${
              !n.isRead ? "border-accent/40 bg-surface-card" : "border-border bg-surface-card/60"
            }`}
          >
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === "critical"
                      ? "bg-status-critical/15 text-status-critical"
                      : n.type === "warning"
                      ? "bg-status-warning/15 text-status-warning"
                      : "bg-status-info/15 text-status-info"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-text-primary">{n.title}</span>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{n.description}</p>
                  <span className="text-[10px] text-text-muted mt-2 block font-mono">{n.timestamp}</span>
                </div>
              </div>

              <Link href={n.link} className="shrink-0">
                <Button variant="outline" size="sm" className="text-xs gap-1.5 w-full sm:w-auto">
                  <span>Take Action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
