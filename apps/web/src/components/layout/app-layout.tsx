"use client";

import * as React from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumb?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, breadcrumb }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-[#171717] text-[#F5F5F5] font-sans antialiased selection:bg-[#FF6B35]/30 selection:text-white">
      {/* Sidebar matching Figma */}
      <AppSidebar isMobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      {/* Backdrop overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main application column */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          breadcrumb={breadcrumb}
          onOpenMobile={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
