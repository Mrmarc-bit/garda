"use client";

import * as React from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />

      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-border bg-[#181818]">
        <div className="max-w-[1440px] mx-auto text-center space-y-4">
          <Badge variant="simulation">Inquiries & Feedback</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl mx-auto">
            Contact the Research Team
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            Share feedback, report technical questions, or inquire about defensive simulation research.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-md mx-auto rounded-2xl border border-border bg-surface-card p-6 md:p-8 space-y-6">
          {submitted ? (
            <div className="text-center space-y-3 py-6">
              <div className="w-12 h-12 rounded-full bg-status-success/20 text-status-success flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Message Sent</h3>
              <p className="text-xs text-text-muted">
                Thank you for your message. Our research lab team will review your inquiry.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Your Name</label>
                <Input placeholder="Alex Mercer" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Email Address</label>
                <Input type="email" placeholder="alex@defense.org" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Message</label>
                <textarea
                  rows={4}
                  placeholder="Inquiry or feedback regarding simulator features..."
                  className="w-full rounded-lg border border-border bg-surface-input p-3 text-text-primary focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full gap-2 text-xs">
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </Button>
            </form>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
