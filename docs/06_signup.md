# サインアップ：ログインの復習

03 のログインと同じ作りです。手順の写経はしません。`src/app/login/page.tsx` を見ながら、差分だけ実装してください。

## このステップで学ぶこと

- ログインと同じ型のフォームページを、別ルートで作る
- 登録 API のあとに、用意済みの `useAuth().login` でログイン状態にする

## 作る／触るファイル

| ファイル | 役割 | 誰が書くか |
| --- | --- | --- |
| `src/app/signup/page.tsx` | 新規登録ページ（`"use client"`） | **自分で作る** |
| `src/app/login/page.tsx` | ログイン（参考・新規登録へのリンク） | 03 で作ったもの |
| `src/components/HeaderNav.tsx` | 未ログイン時の「新規登録」リンク | 差し込みのみ |
| `src/middleware.ts` | ログイン中なら `/login` `/signup` を `/` へ戻す | 用意済み |

使うコンポーネント・hook はログインと同じです。

- `Input` / `Button`（用意済み）
- `useAuth`（`login`）
- `useRouter`

## 使う API

| メソッド | パス | 用途 |
| --- | --- | --- |
| `POST` | `/v1/users` | ユーザー登録 |

Swagger UI（`http://localhost:8081`）の `POST /users` を確認してください。body はログインと同じく `username` と `password` です。

成功時（`201`）は作成したユーザーが返り、`username` が含まれます。トークンはありません。ログイン状態にするには、登録成功後に `useAuth().login(username, password)` を呼ぶのが簡単です（Cookie と Context は 03 と同じ）。

## 満たす条件

- [ ] 任意のアカウントを新規作成できる
- [ ] 作成後はログイン状態になる（タイムラインへ戻る）
- [ ] ログアウト状態から作成したアカウントでログインできる

ログイン中に `/login` や `/signup` を直接開いたときのリダイレクトは、用意済みの `src/middleware.ts` が Cookie を読んで行います。フォーム側には書かなくてよいです。

## 手順

1. `src/app/signup/page.tsx` を作る
2. ログインのフォームをコピーして、見出しと送信先 API を登録用に変える
3. 成功したら `login` → `router.push("/")`
4. ログイン画面のフォーム下に `/signup` へのリンクを足す（登録画面からは `/login` へ戻す）

`src/app/login/page.tsx` の先頭で `Link` を import し、`</form>` の直後に足します。

```tsx
// src/app/login/page.tsx

import Link from "next/link";

// </form> の直後
<p className="mt-4 text-center text-sm text-gray-600">
  アカウントがない場合は{" "}
  <Link href="/signup" className="text-blue-500 hover:underline">
    新規登録
  </Link>
</p>
```

登録ページ側は向きを逆にします。

```tsx
// src/app/signup/page.tsx

<p className="mt-4 text-center text-sm text-gray-600">
  アカウントがある場合は{" "}
  <Link href="/login" className="text-blue-500 hover:underline">
    ログイン
  </Link>
</p>
```

5. 未ログイン時のヘッダー（`HeaderNav`）にも「新規登録」を足す

```tsx
// src/components/HeaderNav.tsx（user がいないときの return）

<Header>
  <Link
    href="/signup"
    className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
  >
    新規登録
  </Link>
  <Link
    href="/login"
    className="rounded-full px-4 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50"
  >
    ログイン
  </Link>
</Header>
```

## 動作確認

- [ ] 未使用のユーザー名で登録できる
- [ ] 登録直後にヘッダーがログイン表示になる
- [ ] ログイン画面と新規登録画面をリンクで行き来できる
- [ ] （確認用）ログインしたまま `/signup` を開くと `/` に戻る
