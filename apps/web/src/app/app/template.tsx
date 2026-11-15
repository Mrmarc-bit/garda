/**
 * Per-navigation enter transition for the workspace.
 *
 * Next.js mounts a fresh `template.tsx` for every route change, which is what
 * makes a pure-CSS enter animation possible without an exit animation fighting
 * the router.
 *
 * This is deliberately CSS (`.workspace-enter` in `globals.css`) and NOT a
 * JavaScript animation library. A JS-driven `initial={{ opacity: 0 }}` leaves the
 * page invisible until hydration finishes and the animation starts, which on a
 * slow connection showed an empty workspace instead of the loading placeholder.
 * A CSS keyframe is applied by the stylesheet the moment the element is painted,
 * so the content is never stuck transparent, and the global
 * `prefers-reduced-motion` block collapses it to an instant swap for users who
 * ask for that.
 */
export default function WorkspaceTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="workspace-enter min-w-0">{children}</div>;
}
