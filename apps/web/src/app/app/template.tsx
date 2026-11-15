"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Per-navigation transition for the workspace. Next.js remounts a `template.tsx`
 * on every route change, which is what makes an enter animation possible without
 * an exit animation fighting the router.
 *
 * The animation is a short fade with a 6px lift — enough to read as a deliberate
 * transition, short enough (180ms) that it never feels like waiting. It is keyed
 * on the pathname so a query-string-only change (for example the simulator's
 * `?incident=` deep link) does not replay it.
 */
export default function WorkspaceTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-0"
    >
      {children}
    </motion.div>
  );
}
