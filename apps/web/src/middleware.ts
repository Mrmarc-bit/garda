import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection for the authenticated application shell.
 *
 * This is a *redirect* layer, not the authorization boundary: it only checks that
 * a session cookie exists, because the Edge runtime cannot reach the SQLite
 * ledger. Every byte of data behind `/app` is fetched from the API, which
 * resolves the session server-side on each request and returns 401 without one.
 * A forged cookie therefore buys an empty shell, not access.
 */

const SESSION_COOKIE = "garda_session";

/** Routes that require a session. */
function isProtected(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/app/");
}

/** Routes an authenticated operator should not see again. */
function isGuestOnly(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isProtected(pathname) && !hasSession) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (isGuestOnly(pathname) && hasSession) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/app";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export const config = {
  // Skip Next.js internals and the API rewrite target; everything else is
  // inspected so the security headers apply to rendered pages.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
