"use client";

import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/Button";
import { useState } from "react";

type ProfileActionButtonProps = {
    username: string;
    initialFollowing: boolean;
    /** フォロー状態が変わったことを親に伝える */
    onFollowChange: (folowing: boolean) => void;
};

type Relationship = {
    id: number;
    following: boolean;
    followed_by: boolean;
};

export function ProfileActionButton({ username, initialFollowing, onFollowChange }: ProfileActionButtonProps) {
    const { user, getAuthenticationHeader } = useAuth();
    const [isFollowing, setIsFollowing ] = useState(initialFollowing);
    const [isSubmitting, setIsSubmitting ] = useState(false);

    async function handleClick(){
        const authentication = getAuthenticationHeader();
        if (!authentication) return;

        const action = isFollowing ? "unfollow" : "follow";
        setIsSubmitting(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/${username}/${action}`,
                {
                    method: "POST",
                    headers:{
                        Authentication: authentication,
                    },
                }
            );
            if (!res.ok) return;
            const relationship = (await res.json()) as Relationship;
            setIsFollowing(relationship.following);
            onFollowChange(relationship.following);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!user || user.username === username) {
        return null;
    }

    if (isFollowing) {
        return (
        <Button
        type="button"
        className="border border-gray-300 !bg-white !text-gray-900 hover:!bg-gray-50"
        disabled={isSubmitting}
        onClick={handleClick}
        >
            フォロー中
        </Button>
        );
    }
    
    return (
    <Button type="button" disabled={isSubmitting} onClick={handleClick}>
        フォロー
    </Button>
    );
}
