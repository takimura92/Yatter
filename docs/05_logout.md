# ログアウト：用意済み機能の確認

03 のログインで出てきた `useAuth` は、SNS のログイン状態管理を教材側で用意したものです。ヘッダーの切り替えや Cookie の保存も、その中に入っています。

ログアウトも同じ `useAuth().logout` ですでに実装済みです。このステップでは **新しいコードは書かず**、その仕組みを読んで動作を確認します。

## このステップで学ぶこと

- この教材の認証はトークンではないので、ログアウト API は不要
- ブラウザ側で **Cookie を消す + Context の `user` を `null` にする**だけで未ログインに戻る
- その処理が、どのファイルのどの関数に分かれているか

## 背景

このバックエンドはトークンテーブルを使わない簡易認証（`Authentication: username john`）です。  
サーバーに「このトークンは無効」と伝える先がないので、ログアウト API はありません。

ログイン実装時の用意物のなかで、すでに次が入っています。

- `HeaderNav` … ログアウトボタンを出し、押したら `logout()` して `/login` へ遷移する
- `useAuth().logout` … Cookie（`yatter_username`）削除 + Context の `user` を `null` にする

## 作る／触るファイル

新規ファイルは作りません。次を **読んで**、呼び出しの流れを追います。

| ファイル | 読む箇所 | ここで分かること |
| --- | --- | --- |
| `src/components/HeaderNav.tsx` | `handleLogout` | UI は「`logout()` を呼んでから `router.push("/login")`」だけ |
| `src/auth/AuthProvider.tsx` | `logout` | 状態を消す本体（Cookie + Context） |
| `src/lib/authCookie.ts` | `clearUsernameCookie` | Cookie を `max-age=0` で消している |

`HeaderNav` がボタン、`AuthProvider` が状態、`authCookie` が永続化、という分担です。ログインのときと逆向きの操作になっています。

## 手順

### 1. コードを読む

流れは次のとおりです。

1. ヘッダーの「ログアウト」を押す（`HeaderNav`）
2. `handleLogout` が走る
   - `logout()`（`AuthProvider`）
     - `clearUsernameCookie()` で Cookie を消す
     - `setUser(null)` で Context を未ログインにする → ヘッダーが「ログイン」表示に切り替わる
   - `router.push("/login")` でログイン画面へ移動する

`HeaderNav` の該当箇所:

```tsx
// src/components/HeaderNav.tsx

const handleLogout = () => {
  logout();
  router.push("/login");
};

// ボタン側
onClick={handleLogout}
```

`logout` の中身:

```tsx
// src/auth/AuthProvider.tsx

function logout() {
  clearUsernameCookie();
  setUser(null);
}
```

### 2. 動作確認

1. ログインした状態にする
2. ヘッダーの「ログアウト」を押す
3. `/login` に遷移し、ヘッダーが「ログイン」表示に戻ることを確認する
4. リロードしても未ログインのままであることを確認する（Cookie が消えている）

- [ ] ログアウト後、ヘッダーが未ログイン表示になる
- [ ] リロードしてもログイン状態に戻らない

## メモ・詰まりポイント

- Swagger にログアウト API がなくても、この教材では正常（クライアント側のみ）
- Cookie だけ消して Context を残すと、リロードするまでヘッダーがログイン表示のままになる。両方消す必要がある
