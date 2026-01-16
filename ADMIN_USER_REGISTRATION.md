# 管琁E��E��: ユーザー登録方況E

## 概要E

ユーザーは管琁E��E��事前に登録する忁E��があります。一般ユーザーはログインペ�Eジから新規登録することはできません、E

## ユーザー登録方況E

### 方況E: コマンドラインスクリプトを使用�E�推奨�E�E

サーバ�E上で以下�Eコマンドを実行します！E

```bash
cd backend
node create-user.js <username> <password>
```

**侁E**
```bash
node create-user.js admin password123
node create-user.js user1 mypassword456
```

### 方況E: 直接users.jsonを編雁E��上級老E��け！E

`backend/users.json`ファイルを直接編雁E��ます。ただし、パスワード�Ebcryptでハッシュ化する忁E��があります、E

**注愁E*: こ�E方法�E推奨されません。パスワード�Eハッシュ化が正しく行われなぁE��能性があります、E

## ユーザーチE�Eタの保存場所

- **ファイル**: `backend/users.json`
- **形弁E*: JSON形弁E
- **構造**:
```json
{
  "username1": {
    "password": "$2b$10$hashed_password_here",
    "createdAt": "2024-01-14T01:00:00.000Z"
  },
  "username2": {
    "password": "$2b$10$hashed_password_here",
    "createdAt": "2024-01-14T02:00:00.000Z"
  }
}
```

## セキュリチE��注意事頁E

1. **パスワード要件**: 6斁E��以丁E
2. **ファイルの保護**: `users.json`は機寁E��報を含むため、E��刁E��保護してください
3. **Git管琁E*: `users.json`は`.gitignore`に追加されてぁE��ため、Gitにはコミットされません

## トラブルシューチE��ング

### ユーザーが既に存在する場吁E

```
エラー: ユーザー名が既に使用されてぁE��ぁE
```

ↁE別のユーザー名を使用するか、既存ユーザーのパスワードをリセチE��してください、E

### パスワードが短すぎる場吁E

```
エラー: パスワード�E6斁E��以上である忁E��がありまぁE
```

ↁE6斁E��以上�Eパスワードを使用してください、E
