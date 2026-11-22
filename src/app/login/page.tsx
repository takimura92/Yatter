"use client"

import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();

        try{
            await login(username, password);
            router.push("/");
        } catch(error){
            console.error(error)
            alert("ログインに失敗しました")
        }
}
    return(
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-sm flex-col justify-center px-4">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
        ログイン
        </h1>
        <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        >
        <label className="flex flex-col gap-1 text-sm text-gray-700">
            ユーザー名
            <Input
            type="text"
            name="username"
            placeholder="john"
            autoComplete="username"
            onChange={(e)=>{setUsername(e.target.value)}
    }/>
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700">
            パスワード
            <Input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
            onChange={(e)=>{setPassword(e.target.value)}}
            />
        </label>
        <Button type="submit" className="w-full">
            ログイン
        </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
            アカウントがない場合は{""}
            <Link href={"/signup"} className="text-blue-500 hover:underline">
            新規登録
            </Link>
        </p>
    </div>
    );
}