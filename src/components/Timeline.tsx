import type { ReactNode } from "react";

type TimelineProps = {
  children?: ReactNode;
};

/**
 * タイムライン（投稿一覧）の枠レイアウト
 * 中身の取得・並べ方は page.tsx 側で行う
 */
export function Timeline({ children }: TimelineProps) {
  return (
    <main className="mx-auto min-h-[calc(100vh-3.5rem)] w-full max-w-2xl border-x border-gray-200 bg-white">
      {children}
    </main>
  );
}
