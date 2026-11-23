import { ProfileFeed } from "@/components/ProfileFeeds";
import { Timeline } from "@/components/Timeline";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Yweet } from "@/types/yweet";
import { User } from "@/types/user"
import Link from "next/link";
import { cookies } from "next/headers";
import {
    AUTH_COOKIE_KEY,
    parseUsernameCookieValue,
    toAuthenticationHeader,
} from "@/lib/authCookie";


type PageProps = {
    params: Promise<{ username: string }>;
};

type Relationship = {
    id: number;
    following: boolean;
    followed_by: boolean;
};


export default async function UserPage({ params }: PageProps) {
    const { username } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userRes = await fetch(`${baseUrl}/v1/users/${username}`, {
    cache: "no-store",
});
    const cookieStore = await cookies();
    const loginUsername = parseUsernameCookieValue(
        cookieStore.get(AUTH_COOKIE_KEY)?.value
    );

  // 確認する（ターミナルに出る）
    console.log(username, userRes.status);
    const yweetRes =await fetch(`${baseUrl}/v1/users/${username}/yweets`,
    {
        cache: "no-store",
    });
    const yweets = (await yweetRes.json()) as Yweet[];

    console.log(yweets)

    let isFollowing = false;
    if (loginUsername && loginUsername !== username) {
        const relationshipRes = await fetch(
            `${baseUrl}/v1/users/relationships?username=${encodeURIComponent(username)}`,
            {
                cache: "no-store",
                headers: {
                    Authentication: toAuthenticationHeader(loginUsername),
                },
            }
        );
        if (relationshipRes.ok) {
            const relationships = (await relationshipRes.json()) as Relationship[];
            isFollowing = relationships[0]?.following ?? false;
        }
    }


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
        <ProfileHeader user={user} initialFollowing={isFollowing}/>
    </div>
    <div className="border-b border-gray-200">
      {/* プロフィール（手順 2） */}
    </div>
    <ProfileFeed initialYweets={yweets}/>
</Timeline>
);
}