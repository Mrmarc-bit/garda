import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";

/**
 * Workspace shell. Mounting the sidebar and header here (instead of inside each
 * page) keeps them alive across client-side navigation, so moving between
 * modules no longer tears down and rebuilds the whole chrome — that remount was
 * the visible "flash" between pages. The header derives the breadcrumb from the
 * pathname, so pages only render their own content.
 */
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
