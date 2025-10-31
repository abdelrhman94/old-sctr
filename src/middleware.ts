import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { UserRole } from "./enums/enums";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/activate"];

const Authorization_Routes = [
  { path: "/dashboard" },
  {
    path: "/requests",
    roles: [
      UserRole.REVIEWER,
      UserRole.ORGANIZATION_ADMIN,
      UserRole.DIRECTOR_MANAGER,
      UserRole.SUB_USER
    ]
  },
  {
    path: "/studies",
    roles: []
  },
  {
    path: "/users",
    roles: [
      UserRole.REVIEWER,
      UserRole.ORGANIZATION_ADMIN,
      UserRole.DIRECTOR_MANAGER,
      UserRole.SUB_USER
    ]
  },
  {
    path: "/settings",
    roles: [
      UserRole.REVIEWER,
      UserRole.ORGANIZATION_ADMIN,
      UserRole.DIRECTOR_MANAGER,
      UserRole.SUB_USER
    ]
  }
];

function isAuthRoute(p: string) {
  return AUTH_ROUTES.some((r) => p.startsWith(r));
}

function stripLocale(pathname: string) {
  const first = pathname.split("/")[1];
  const locales: readonly string[] = routing.locales ?? [];
  if (locales.includes(first)) {
    const without = pathname.replace(`/${first}`, "") || "/";
    return without.startsWith("//") ? without.slice(1) : without;
  }
  return pathname;
}

function withLocale(req: NextRequest, targetPath: string) {
  const url = req.nextUrl.clone();
  const first = url.pathname.split("/")[1];
  const locales: readonly string[] = routing.locales ?? [];
  const locale = locales.includes(first) ? first : routing.defaultLocale;
  url.pathname = `/${locale}${targetPath.startsWith("/") ? targetPath : `/${targetPath}`}`;
  return url;
}

function parseRolesCookie(req: NextRequest): string[] {
  const raw = req.cookies.get("roles")?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function middleware(req: NextRequest) {
  const i18nResponse = handleI18nRouting(req);

  const token = req.cookies.get("token")?.value ?? null;
  const rolesFromCookie = parseRolesCookie(req);
  const url = req.nextUrl.clone();
  const path = stripLocale(url.pathname);

  if (path === "/") {
    return NextResponse.redirect(new URL(token ? "/dashboard" : "/login", req.url));
  }

  if (isAuthRoute(path) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const rule = Authorization_Routes.find((r) => path.startsWith(r.path));
  if (rule) {
    // 1) Must be logged-in
    if (!token) {
      return NextResponse.redirect(withLocale(req, "/login"));
    }

    // 2) If roles specified, user must have at least one
    if (rule.roles && rule.roles.length > 0) {
      const allowed = rolesFromCookie.some((r) => rule.roles!.includes(r as UserRole));
      if (!allowed) {
        return NextResponse.redirect(withLocale(req, "/unauthorized"));
      }
    }
  }

  return i18nResponse ?? NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"]
};
