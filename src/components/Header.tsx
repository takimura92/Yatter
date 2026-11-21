import Link from "next/link";
import type { ReactNode } from "react";

type HeaderProps = {
  /** 右側（ログイン／ログアウトなど）。HeaderNav などから渡す */
  children?: ReactNode;
};

/**
 * 全ページ共通ヘッダー（見た目用）
 * 右側の中身は children で受け取る（ロジックは HeaderNav 側）
 */
export function Header({ children }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-blue-500">
          Yatter
        </Link>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
