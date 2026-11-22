"use client";

import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/Button";

type ProfileActionButtonProps = {
    username: string;
};

export function ProfileActionButton({ username }: ProfileActionButtonProps) {
    const { user } = useAuth();

    if (!user || user.username === username) {
        return null;
    }

    return <Button type="button">フォロー</Button>;
}
