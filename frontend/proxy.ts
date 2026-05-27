import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PRIVATE_ROUTES, PUBLIC_ROUTES, ROUTES } from "./api/endpoints";

function isRouteMatch(pathname: string, routes: readonly string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function getSafeNextPath(request: NextRequest) {
  const nextPath = request.nextUrl.searchParams.get("next");

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return ROUTES.tasks;
  }

  return nextPath;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get("accessToken")?.value);
  const isPublicRoute = isRouteMatch(pathname, PUBLIC_ROUTES);
  const isPrivateRoute = isRouteMatch(pathname, PRIVATE_ROUTES);

  if (pathname === ROUTES.home) {
    return NextResponse.redirect(
      new URL(hasAccessToken ? ROUTES.tasks : ROUTES.login, request.url),
    );
  }

  if (isPublicRoute && hasAccessToken) {
    return NextResponse.redirect(new URL(getSafeNextPath(request), request.url));
  }

  if (isPrivateRoute && !hasAccessToken) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/tasks/:path*"],
};
