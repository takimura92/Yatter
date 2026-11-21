type YweetCardProps = {
  username: string;
  content: string;
  /** 未指定または空のときはデフォルトアバターを表示 */
  avatarUrl?: string;
};

/**
 * Yweet 1件分のカード（見た目用）
 * 削除ボタンは 07 で追加する
 */
export function YweetCard({ username, content, avatarUrl }: YweetCardProps) {
  const src = avatarUrl && avatarUrl.length > 0 ? avatarUrl : "/avatar-default.svg";

  return (
    <article className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex gap-3">
        <img
          src={src}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-gray-900">@{username}</p>
          <p className="mt-1 whitespace-pre-wrap break-words text-gray-800">
            {content}
          </p>
        </div>
      </div>
    </article>
  );
}
