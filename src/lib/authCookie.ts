export const AUTH_COOKIE_KEY = "yatter_username";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

export function parseUsernameCookieValue(
  raw: string | undefined | null
): string | null {
  if (!raw) return null;
  const value = decodeURIComponent(raw);
  return value.length > 0 ? value : null;
}

/** ブラウザ専用。RSC では cookies() を使う */
export function getUsernameFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_COOKIE_KEY}=`));

  if (!match) return null;

  return parseUsernameCookieValue(match.split("=").slice(1).join("="));
}

export function setUsernameCookie(username: string): void {
  document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(username)}; path=/; max-age=${MAX_AGE_SEC}`;
}

export function clearUsernameCookie(): void {
  document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0`;
}

/** バックエンドの Authentication ヘッダ用（例: "username john"） */
export function toAuthenticationHeader(username: string): string {
  return `username ${username}`;
}
