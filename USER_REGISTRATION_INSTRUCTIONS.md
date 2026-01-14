# ユーザー一括登録手順

## 前提条件

Node.jsがインストールされている必要があります。

### Node.jsのインストール確認

```powershell
node --version
```

インストールされていない場合は、以下からダウンロードしてください：
https://nodejs.org/

## ユーザー登録方法

### 方法1: 一括登録スクリプトを使用（推奨）

1. **backendディレクトリに移動**
   ```powershell
   cd backend
   ```

2. **一括登録スクリプトを実行**
   ```powershell
   node bulk-create-users.js
   ```

   または、個別に登録する場合：
   ```powershell
   node create-user.js <ユーザー名> init00@tamron
   ```

### 方法2: 初期ユーザーデータを生成

1. **backendディレクトリに移動**
   ```powershell
   cd backend
   ```

2. **users.jsonファイルを生成**
   ```powershell
   node generate-users.js
   ```

   これにより、`backend/users.json`ファイルが作成されます。

3. **users.jsonをデプロイに含める**
   - `users.json`は既に`.gitignore`に追加されているため、Gitにはコミットされません
   - デプロイ時に`users.json`がコンテナに含まれるように、`.dockerignore`を確認してください

## 登録されるユーザー

以下の19名のユーザーが登録されます（パスワード: `init00@tamron`）：

- 0400259
- 2400125
- 0800623
- 2000156
- 9700402
- 9800244
- 1200153
- 0700674
- 0400671
- 2300051
- 1700111
- 1800242
- 2500213
- 2100048
- 2300291
- 1900216
- 1200245
- 0400275
- 2500353

## 注意事項

1. **パスワード**: すべてのユーザーは初期パスワード `init00@tamron` で登録されます
2. **セキュリティ**: 初回ログイン後、パスワードの変更を推奨します（現在のシステムではパスワード変更機能は未実装）
3. **ファイルの場所**: `backend/users.json`に保存されます
4. **Git管理**: `users.json`は`.gitignore`に追加されているため、Gitにはコミットされません
