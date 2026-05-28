import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  PRIVATE_ROUTES,
  PUBLIC_ROUTES,
  ROUTES,
} from "./api/endpoints";

function isRouteMatch(pathname: string, routes: readonly string[]) {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );
}

/**
 * Proxy to handle route protection and redirection
 * based on authentication state.
 *
 * Next.js 16+: Middleware is renamed to Proxy.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check authentication
  const accessToken =
    request.cookies.get("accessToken")?.value;

  const isAuthenticated = !!accessToken;

  // Route checks
  const isPublicRoute = isRouteMatch(
    pathname,
    PUBLIC_ROUTES,
  );

  const isPrivateRoute = isRouteMatch(
    pathname,
    PRIVATE_ROUTES,
  );

  /**
   * If authenticated user visits public routes
   * redirect them to tasks/dashboard.
   */
  if (isAuthenticated) {
    if (
      pathname === ROUTES.home ||
      isPublicRoute
    ) {
      return NextResponse.redirect(
        new URL(ROUTES.tasks, request.url),
      );
    }
  }

  /**
   * If unauthenticated user visits private routes
   * redirect to login page.
   */
  if (!isAuthenticated) {
    if (isPrivateRoute) {
      const loginUrl = new URL(
        ROUTES.login,
        request.url,
      );

      // Save original destination
      loginUrl.searchParams.set(
        "callbackUrl",
        pathname,
      );

      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue request
  return NextResponse.next();
}

/**
 * Routes handled by proxy
 */
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - api
     * - static files
     * - image optimization
     * - metadata files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};