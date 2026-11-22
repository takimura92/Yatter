"use client"

import { useState } from "react";
import { YweetCard } from "@/components/YweetCard";
import type { Yweet } from "@/types/yweet";
import { useAuth } from "@/auth/AuthProvider";
import { PostYweetForm } from "./PostYweetForm";
import { ConfirmDialog } from "./ConfirmDialog";

type TimelineFeedProps = {
    initialYweets: Yweet[];
};

export function TimelineFeed({ initialYweets }: TimelineFeedProps) {
    const { user, getAuthenticationHeader } = useAuth();
    const isLoggedIn = !!user;
    const [yweets, setYweets] = useState<Yweet[]>(initialYweets);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const isOpen = deletingId !== null;
    console.log("isOpen", isOpen, "deletingId", deletingId);
    const [isDone, setIsDone] = useState(false);

    function handlePosted(created: Yweet){
        setYweets((prev) => [created, ...prev]);
    }

    function handleDeleteClick(id: number) {
        setIsDone(false);
        setDeletingId(id);
    }

    function handleCancel() {
        setDeletingId(null);
        setIsDone(false)
    }

    async function handleConfirm(){
        if (deletingId === null) return;

        const authentication = getAuthenticationHeader();
        if (!authentication) {
            setDeletingId(null);
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/yweets/${deletingId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authentication: authentication,
                    },
                }
            );
            
            if (!res.ok) {
                throw new Error("削除に失敗しました");
            }

            setYweets((prev) => prev.filter((yweet) => yweet.id !== deletingId));
            setIsDone(true);
        } catch (error){
            console.error("削除エラー:", error);
            alert("投稿の削除に失敗しました");
            setDeletingId(null);
            setIsDone(false);
        }
    }

    return (
    <>
    {/* ログイン中だけ、一覧の上に投稿フォームを表示する */}
    {isLoggedIn && <PostYweetForm onPosted = {handlePosted} />}
        {yweets.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">
                まだ Yweet がありません
            </p>
        ) : (
            yweets.map((yweet) => {
                const isOwn = user?.username === yweet.user.username;
            return(
            <YweetCard
                key={yweet.id}
                username={yweet.user.username}
                content={yweet.content}
                avatarUrl={yweet.user.avatar}
                onDelete={isOwn ? () => handleDeleteClick(yweet.id) : undefined}
                />
            )})
            )}
        <ConfirmDialog
            isOpen={isOpen}
            message={isDone ? "削除しました" : "この Yweet を削除しますか？"}
            showConfirm={!isDone}
            cancelLabel={isDone ? "閉じる" : "キャンセル"}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    </>
    );
}
