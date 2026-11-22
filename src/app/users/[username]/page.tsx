import { ProfileActionButton } from "@/components/ProfileActionButton";
import { ProfileFeed } from "@/components/ProfileFeeds";
import { Timeline } from "@/components/Timeline";
import { YweetCard } from "@/components/YweetCard";
import { Yweet } from "@/types/yweet";
import Link from "next/link";

type User = {
    id: number;
    username: string;
    display_name: string;
    note: string;
    avatar: string;
    header: string;
    followers_count: number;
    following_count: number;
};

type PageProps = {
    params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: PageProps) {
    const { username } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userRes = await fetch(`${baseUrl}/v1/users/${username}`, {
    cache: "no-store",
});

  // 確認する（ターミナルに出る）
    console.log(username, userRes.status);
    const yweetRes =await fetch(`${baseUrl}/v1/users/${username}/yweets`,
    {
        cache: "no-store",
    });
    const yweets = (await yweetRes.json()) as Yweet[];

    console.log(yweets)


if (userRes.status === 404) {
    return (
    <Timeline>
        <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">
                ユーザーが見つかりませんでした
            </p>
            <p className="mt-4">
            <Link href="/" className="text-sm text-blue-500 hover:underline">
                トップへ戻る
            </Link>
            </p>
        </div>
    </Timeline>
    );
}

const user = (await userRes.json()) as User;

return (
<Timeline>
    <div className="border-b border-gray-200">
        {user.header ? (
            <img
            src={user.header}
            alt=""
            className="h-36 w-full object-cover"
            />
        ) : (
        <div className="h-36 w-full bg-gray-200" />
        )}
        <div className="px-4 pb-4">
            <div className="flex items-start justify-between">
                <img
                src={
                    user.avatar && user.avatar.length > 0
                    ? user.avatar
                    : "/avatar-default.svg"
                }
                alt=""
                width={80}
                height={80}
                className="-mt-10 h-20 w-20 rounded-full border-4 border-white object-cover"
                />
                <div className="pt-3">
                    <ProfileActionButton username={user.username} />
                </div>
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900">
                {user.display_name || `@${user.username}`}
            </p>
            <p className="text-sm text-gray-500">@{user.username}</p>
                {user.note ? (
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-gray-800">
                {user.note}
            </p>
        ) : null}
        <p className="mt-3 text-sm text-gray-500">
            <span className="font-bold text-gray-900">
                {user.following_count}
            </span>{" "}
            フォロー
            <span className="ml-4 font-bold text-gray-900">
                {user.followers_count}
            </span>{" "}
            フォロワ-
            </p>
        </div>
    </div>
    <div className="border-b border-gray-200">
      {/* プロフィール（手順 2） */}
    </div>
    <ProfileFeed initialYweets={yweets}/>
</Timeline>
);
}