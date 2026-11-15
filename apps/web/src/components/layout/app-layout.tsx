"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { RouteProgress } from "./route-progress";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumb?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, breadcrumb }) => {
  return (
    <SidebarProvider className="h-screen w-full flex bg-[#121212] text-[#F5F5F5] font-sans antialiased overflow-hidden selection:bg-[#FF6B35]/30 selection:text-white">
      {/* Navigation feedback. Rendered above the shell so it is not clipped by
          the scrolling <main>. */}
      <RouteProgress />

      {/* Modern Sidebar System */}
      <AppSidebar />

      {/* Main application column */}
      <SidebarInset className="flex-1 flex flex-col min-w-0 bg-[#171717] overflow-hidden">
        <AppHeader breadcrumb={breadcrumb} />
        <main className="flex-1 p-3 sm:p-5 md:p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1440px] mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
