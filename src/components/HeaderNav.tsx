"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { Header } from "@/components/Header";

/** Header にログイン状態に応じた右側 UI を渡す */
export function HeaderNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (user) {
    return (
      <Header>
        <span className="text-sm text-gray-600">@{user.username}</span>
        <button
          type="button"
          className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      </Header>
    );
  }

  return (
    <Header>
      <Link
        href="/signup"
        className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        新規登録
      </Link>
      <Link
        href="/login"
        className="rounded-full px-4 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50"
      >
        ログイン
      </Link>
    </Header>
  );
}
