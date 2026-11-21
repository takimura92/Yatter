import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE_KEY,
  parseUsernameCookieValue,
} from "@/lib/authCookie";

const GUEST_ONLY_PATHS = new Set(["/login", "/signup"]);

/**
 * ログイン中に /login ・ /signup へ来たらタイムラインへ戻す。
 * Cookie は読むだけ（書き換えない）。
 */
export function middleware(request: NextRequest) {
  const username = parseUsernameCookieValue(
    request.cookies.get(AUTH_COOKIE_KEY)?.value
  );

  if (username && GUEST_ONLY_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup"],
};
