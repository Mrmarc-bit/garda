import * as React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-accent/20 border-2 border-accent flex items-center justify-center text-accent">
          <ShieldAlert className="w-8 h-8 text-accent" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-sm font-bold text-accent tracking-widest">ERROR 404</div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary">
            Simulation Route Not Found
          </h1>
          <p className="text-xs md:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
            The requested resource or scenario URL does not exist in the virtual simulation repository.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/app">
            <Button variant="primary" size="sm" className="gap-2 text-xs">
              <span>Open Simulator Console</span>
            </Button>
          </Link>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
