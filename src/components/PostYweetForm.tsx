"use client";

import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import { Yweet } from "@/types/yweet";
import { useState } from "react";

type PostYweetFormProps = {
    onPosted : (yweet: Yweet) => void;
};

export function PostYweetForm({ onPosted}:PostYweetFormProps){
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getAuthenticationHeader } = useAuth();


    const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if (content.trim() === ""){
            setError("本文を入力してください");
            return;
        }

        const authentication = getAuthenticationHeader();
        if (!authentication) {
            setError("投稿するにはログインが必要です");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/yweets`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json", Authentication: authentication,
                    },
                    body: JSON.stringify({
                        yweet: content,
                    }),
                }
            );
        if (!res.ok) {
            setError("投稿に失敗しました");
            return;
        }

        const created = (await res.json()) as Yweet;
        onPosted(created);
        setContent("");
        } finally {
            // 成功・失敗どちらでも送信中フラグを戻す
            setIsSubmitting(false)
        }
    }

    return (
        <form className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3"
        onSubmit={handleSubmit}>
                <Textarea 
                name="yweet" 
                placeholder="いまどうしてる？"
                value={content}
                onChange={(e)=>setContent(e.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>投稿する</Button>
                </div>
        </form>
    )
}