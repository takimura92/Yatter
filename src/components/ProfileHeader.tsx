"use client";

import { useState } from "react";
import { ProfileActionButton } from "@/components/ProfileActionButton";
import type { User } from "@/types/user";

type ProfileHeaderProps = {
    user: User;
    initialFollowing: boolean;
};

export function ProfileHeader({ user, initialFollowing }: ProfileHeaderProps) {
    const [followersCount, setFollowersCount] = useState(user.followers_count);

    function handleFollowChange(following: boolean) {
        setFollowersCount((prev) => (following ? prev + 1 : prev - 1));
    }

    return (
        <div className="border-b border-gray-200">
            {/* 08 のヘッダー JSX をそのまま置く */}
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
                    <ProfileActionButton username={user.username} initialFollowing={initialFollowing} onFollowChange={handleFollowChange}/>
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
                {followersCount}
            </span>{" "}
            フォロワ-
            </p>
        </div>
            {/* フォロワー数は {user.followers_count} ではなく {followersCount} にする */}
        </div>
        );
    }
