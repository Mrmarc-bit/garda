import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      <main className="flex-1 px-6 md:px-12 lg:px-16 py-16 flex flex-col justify-center">
        <div className="max-w-[1440px] mx-auto w-full space-y-6">
          <div className="space-y-3">
            <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
              PAGE NOT FOUND / 404
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
              This route is outside the map.
            </h1>
            <p className="text-sm md:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
              The page may have moved, or the address may not match a screen in this prototype.
            </p>
          </div>

          <div className="text-8xl md:text-9xl font-bold text-[#FF6B35] tracking-tight leading-none my-4">
            404
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <Link
              href="/"
              className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors shadow-sm"
            >
              Back to home
            </Link>
            <Link
              href="/documentation"
              className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
            >
              Open documentation
            </Link>
            <Link
              href="/app"
              className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
            >
              Explore Simulation Lab
            </Link>
          </div>

          <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 mt-12 space-y-3 max-w-4xl">
            <h2 className="text-base font-bold text-[#F5F5F5]">
              Looking for a specific workflow?
            </h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#A3A3A3]">
              <Link href="/app/incidents" className="hover:text-[#FF6B35] transition-colors">
                <span className="text-[#F5F5F5] font-medium">Incidents</span> → investigate the scenario
              </Link>
              <Link href="/app/simulator" className="hover:text-[#FF6B35] transition-colors">
                <span className="text-[#F5F5F5] font-medium">Response Simulator</span> → compare hypothetical strategies
              </Link>
              <Link href="/documentation" className="hover:text-[#FF6B35] transition-colors">
                <span className="text-[#F5F5F5] font-medium">Documentation</span> → understand concepts and limitations
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
