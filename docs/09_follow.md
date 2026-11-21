# フォロー・フォロー解除

08 で他人のプロフィールに「フォロー」ボタンは出しています。このステップでは API を繋いで、押したあとの表示を更新します。編集はやりません。

## このステップで学ぶこと

- RSC でフォロー状態を取って、Client に初期値として渡す
- クリックは Client のまま。成功レスポンスでボタンを切り替える
- RSC から Auth 付き fetch する（Cookie のユーザー名 → `Authentication` ヘッダ）
- 数が動く表示は Client に移す。子から親へコールバックで知らせてフォロワー数を増減する

## 完成イメージ

他人のプロフィールで、未フォローなら「フォロー」、フォロー中なら「フォロー中」。押すとボタンとフォロワー数が切り替わる。リロードしても状態が残る。自分のページと未ログインではボタンは出ない（08 のまま）。

## 作る／触るファイル

| ファイル | 役割 | 誰が書くか |
| --- | --- | --- |
| `src/app/users/[username]/page.tsx` | 関係 API を RSC で取り、初期値を渡す | **学生が直す** |
| `src/components/ProfileActionButton.tsx` | 初期値を state に入れて、クリックで更新 | **学生が直す** |
| `src/types/user.ts` | `User` 型（`page.tsx` から移動） | **学生が作る**（手順 7） |
| `src/components/ProfileHeader.tsx` | ヘッダーを Client に移し、フォロワー数を持つ | **学生が作る**（手順 7） |

ボタンの見た目の置き場は 08 のままです。手順 7 で、ボタンを含むヘッダーごと Client Component に移します。

## 使う API

フォロー系は 🔐 Auth（`Authentication: username john`）が必要です。Swagger UI（`http://localhost:8081`）で試してください。

| メソッド | パス | 用途 |
| --- | --- | --- |
| `GET` | `/v1/users/relationships?username={username}` | 今フォローしているか |
| `POST` | `/v1/users/{username}/follow` | フォロー |
| `POST` | `/v1/users/{username}/unfollow` | フォロー解除（`DELETE` ではない） |

`GET /v1/users/{username}` にはフォロー中かどうかは入っていません。`followers_count` / `following_count` は実数ですが、ボタン判定には使いません。

関係の成功時（200）の例:

```json
[
  {
    "id": 2,
    "following": false,
    "followed_by": false
  }
]
```

`username` クエリはカンマ区切りで複数人取れますが、プロフィールでは相手1人だけでよいです。  
ボタンに使うのは **`following`** です。`followed_by` はこのステップでは使いません。

フォロー／解除の成功時（200）は配列ではなく、同じ形のオブジェクトが1件返ります。

```json
{
  "id": 2,
  "following": true,
  "followed_by": false
}
```

## 満たす条件

- [ ] ログインして他人のプロフィールを開くと、今のフォロー状態に合ったボタンが出る
- [ ] 「フォロー」を押すと「フォロー中」になり、フォロワー数が 1 増える
- [ ] 「フォロー中」を押すと「フォロー」に戻り、フォロワー数が 1 減る
- [ ] 自分のプロフィールと未ログインではボタンが出ない

失敗時のエラー表示は任意です。相手の **フォロー数**（その人がフォローしている人数）は、ここでは変わりません。

## 考え方

関係 API は **ログイン中の自分から見た状態** なので Auth が要ります。

Client で開いてから取ると、最初は必ず「フォロー」になり、取れたあとに「フォロー中」へ変わってチラつきます。  
だから **最初の1回は RSC（`page.tsx`）で取る**。クリック後のボタンは 04 と同じく、成功レスポンスで state を更新します（relationships の再取得は不要）。

フォロワー数も同じ話です。今は `page.tsx`（RSC）が出しているので、ボタンの state を変えても数字は動きません。  
08 で「削除ボタンを出すために一覧を `ProfileFeed`（Client）へ移した」のと同じ理由で、**ヘッダーも Client に移します**（手順 7）。

Cookie の読み方は root の `layout.tsx` と同じです。`cookies()` と、用意済みの `authCookie` を使います。

## 手順

### 1. Swagger で API を試す

- ユーザーを2人作る（例: `john` と別の名前）
- Authorize で `username john`
- `GET /users/relationships?username=相手` を実行する
- `POST /users/{相手}/follow` → もう一度 relationships → `following` が `true`
- `POST /users/{相手}/unfollow` → `following` が `false`

### 2. RSC で Cookie を読む

`src/app/layout.tsx` を開いて、`cookies()` の使い方をコピーします。プロフィールページでも同じです。

```tsx
// src/app/users/[username]/page.tsx

import { cookies } from "next/headers";
import {
  AUTH_COOKIE_KEY,
  parseUsernameCookieValue,
  toAuthenticationHeader,
} from "@/lib/authCookie";

const cookieStore = await cookies();
const loginUsername = parseUsernameCookieValue(
  cookieStore.get(AUTH_COOKIE_KEY)?.value
);
```

`loginUsername` が `null` なら未ログインです。自分のページ（`loginUsername === username`）では関係を取る必要はありません。

### 3. 関係の fetch を足す

08 と同じく、ユーザーと Yweet の `fetch` のあとに **直列で** もう1本足します。`Promise.all` は 08 でも任意なので、ここでは使いません。Auth ヘッダは `toAuthenticationHeader(loginUsername)` です（07 の `"username john"` と同じ文字列になります）。

```tsx
// src/app/users/[username]/page.tsx

type Relationship = {
  id: number;
  following: boolean;
  followed_by: boolean;
};

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
```

08 の任意で `getUser(username)` / `getYweetsByUsername(username)` と `Promise.all` にしている場合は、同じ配列に関係の fetch を1本足すだけでよいです。関数名は 08 に合わせます。

ボタンに渡します。

```tsx
// src/app/users/[username]/page.tsx

<ProfileActionButton
  username={user.username}
  initialFollowing={isFollowing}
/>
```

- [ ] フォローしていない相手を開くと、最初から「フォロー」
- [ ] Swagger でフォローしてからリロードすると「フォロー中」

### 4. ボタン側は初期値を state に入れる

08 の `ProfileActionButton` に props を足します。

```tsx
// src/components/ProfileActionButton.tsx

type ProfileActionButtonProps = {
  username: string;
  initialFollowing: boolean;
};

export function ProfileActionButton({
  username,
  initialFollowing,
}: ProfileActionButtonProps) {
  const { user, getAuthenticationHeader } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || user.username === username) {
    return null;
  }

  // ...
}
```

未ログイン・自分のページでは、今までどおり `return null` です。

### 5. クリックでフォロー／解除する

今 `isFollowing` なら `unfollow`、そうでなければ `follow` です。どちらも **POST** です。

連打防止に `isSubmitting` を足して、送信中は `disabled` にします（04 の投稿と同じ）。認証ヘッダは 07 と同じ `getAuthenticationHeader()` です。

```tsx
// src/components/ProfileActionButton.tsx

async function handleClick() {
  const authentication = getAuthenticationHeader();
  if (!authentication) return;

  const action = isFollowing ? "unfollow" : "follow";
  setIsSubmitting(true);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/${username}/${action}`,
      {
        method: "POST",
        headers: {
          Authentication: authentication,
        },
      }
    );
    if (!res.ok) return;
    const relationship = (await res.json()) as Relationship;
    setIsFollowing(relationship.following);
  } finally {
    setIsSubmitting(false);
  }
}
```

型は `page.tsx` と同じ `Relationship` を、このファイルにも書いてください。  
成功したら `relationship.following` で state を更新します。もう一度 relationships を取りにいかなくてよいです。件数の更新は手順 7 です。

### 6. ボタンの表示を切り替える

フォロー中は白ボタンにします。`Button` のデフォルトは白文字なので、07 のキャンセルと同じく `!text-gray-900` で上書きします。

```tsx
// src/components/ProfileActionButton.tsx

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
```

### 7. フォロワー数も動かす

件数は 08 で書いた `page.tsx`（RSC）のヘッダーにあります。RSC はサーバーで一度動くだけなので、ボタンの `isFollowing` を変えても数字は変わりません。  
08 で「削除ボタンを出すために一覧を `ProfileFeed`（Client）に移した」のと同じです。**動かしたい表示は Client に移します。**

変わるのは相手の **フォロワー数** だけです。フォロー数（相手がフォローしている人数）はここでは動きません。

#### 7-1. `User` 型を共通ファイルに移す

04 で `Yweet` を `src/types/yweet.ts` に移したのと同じです。`page.tsx` と新しいコンポーネントの両方で使うので切り出します。

- `src/types/user.ts` を作る
- 08 で `page.tsx` に書いた `User` 型を移して `export` する
- `page.tsx` は `import type { User } from "@/types/user";` に直す

#### 7-2. ヘッダーを `ProfileHeader` に移す

- `src/components/ProfileHeader.tsx` を作る（先頭に `"use client"`）
- 08 で書いたヘッダーの JSX（`<div className="border-b border-gray-200">` からフォロワー数まで）を **そのまま** 移す
- `followersCount` を `useState` で持ち、表示を `{followersCount}` に差し替える
- `ProfileActionButton` に `onFollowChange` を渡す

```tsx
// src/components/ProfileHeader.tsx

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

      {/* ボタンには onFollowChange を足す */}
      <ProfileActionButton
        username={user.username}
        initialFollowing={initialFollowing}
        onFollowChange={handleFollowChange}
      />

      {/* フォロワー数は {user.followers_count} ではなく {followersCount} にする */}
    </div>
  );
}
```

`page.tsx` は、ヘッダーの `<div>` をまるごと置き換えます。**fetch は RSC のまま**で、移すのは表示だけです。

```tsx
// src/app/users/[username]/page.tsx

import { ProfileHeader } from "@/components/ProfileHeader";

<ProfileHeader user={user} initialFollowing={isFollowing} />
```

#### 7-3. ボタンから親に知らせる

一覧の state を `TimelineFeed` が持ち、成功を知るのは `PostYweetForm` だった 04 と同じ形です。あのときの `onPosted` にあたるのが `onFollowChange` です。

```tsx
// src/components/ProfileActionButton.tsx

type ProfileActionButtonProps = {
  username: string;
  initialFollowing: boolean;
  /** フォロー状態が変わったことを親に伝える */
  onFollowChange: (following: boolean) => void;
};

// handleClick の成功時（手順 5）
setIsFollowing(relationship.following);
onFollowChange(relationship.following);
```

- ボタンの見た目は今までどおり自分の `isFollowing` で切り替える
- 数を持つのは親（`ProfileHeader`）だけ
- フォロー／解除の API は件数を返さないので、`+1` / `-1` で足し引きする

### 8. 動作確認

- [ ] john でログインし、別人の `/users/...` を開く
- [ ] 「フォロー」→「フォロー中」になり、フォロワー数がすぐ増える
- [ ] 「フォロー中」→「フォロー」になり、フォロワー数がすぐ減る
- [ ] リロードしても、ボタンと件数が最後の状態のまま出る
- [ ] `/users/john`（自分）ではボタンが出ない

## メモ・詰まりポイント

- 解除は `DELETE` ではなく `POST /unfollow`
- ボタン判定には `GET /users/{username}` ではなく `relationships` の `following` を使う
- 件数は `GET /users/{username}` の実数。RSC のままでは動かないので、表示を Client（`ProfileHeader`）に移して `+1` / `-1` する
- RSC の Auth は Cookie → `toAuthenticationHeader`。Client の Auth は `getAuthenticationHeader()`。中身の文字列は同じ
- `page.tsx` で `cookies()` を使うと、このページはリクエストごとに動的になります（`cache: "no-store"` と揃っている）
