"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const NAV_LINKS = [
    { href: "/features", label: "Features" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/documentation", label: "Documentation" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#303030] bg-[#171717]">
      <div className="max-w-[1440px] mx-auto h-16 px-6 md:px-12 lg:px-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-sm tracking-wide text-[#F5F5F5]">
          GARDA-SIM AI
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs text-[#A3A3A3]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#F5F5F5] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action buttons matching Figma */}
        <div className="hidden md:flex items-center gap-6 text-xs">
          <Link
            href="/login"
            className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/app"
            className="bg-[#FF6B35] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-1 shadow-sm"
          >
            <span>Get Started ↗</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#A3A3A3] hover:text-[#F5F5F5] rounded"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#303030] bg-[#171717] px-6 py-4 space-y-3 text-xs">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-[#A3A3A3] hover:text-[#F5F5F5]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#303030] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#A3A3A3]"
            >
              Sign In
            </Link>
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#FF6B35] text-white text-center py-2 rounded-lg font-medium"
            >
              Get Started ↗
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
