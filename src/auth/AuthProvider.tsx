"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  clearUsernameCookie,
  setUsernameCookie,
  toAuthenticationHeader,
} from "@/lib/authCookie";

export type AuthUser = {
  username: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  /** 認証付き API 用。未ログインなら null */
  getAuthenticationHeader: () => string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
  /** layout（RSC）が Cookie から読んだ初期ユーザー名 */
  initialUsername?: string | null;
};

export function AuthProvider({
  children,
  initialUsername = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(
    initialUsername ? { username: initialUsername } : null
  );

  async function login(username: string, password: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${baseUrl}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("ログインに失敗しました");
    }

    const data = (await res.json()) as { username: string };
    setUsernameCookie(data.username);
    setUser({ username: data.username });
  }

  function logout() {
    clearUsernameCookie();
    setUser(null);
  }

  function getAuthenticationHeader() {
    if (!user) return null;
    return toAuthenticationHeader(user.username);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        getAuthenticationHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
