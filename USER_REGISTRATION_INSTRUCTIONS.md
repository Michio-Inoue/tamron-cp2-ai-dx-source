# ユーザー一括登録手頁E

## 前提条件

Node.jsがインスト�EルされてぁE��忁E��があります、E

### Node.jsのインスト�Eル確誁E

```powershell
node --version
```

インスト�EルされてぁE��ぁE��合�E、以下からダウンロードしてください�E�E
https://nodejs.org/

## ユーザー登録方況E

### 方況E: 一括登録スクリプトを使用�E�推奨�E�E

1. **backendチE��レクトリに移勁E*
   ```powershell
   cd backend
   ```

2. **一括登録スクリプトを実衁E*
   ```powershell
   node bulk-create-users.js
   ```

   また�E、個別に登録する場合！E
   ```powershell
   node create-user.js <ユーザー吁E init00@tamron
   ```

### 方況E: 初期ユーザーチE�Eタを生戁E

1. **backendチE��レクトリに移勁E*
   ```powershell
   cd backend
   ```

2. **users.jsonファイルを生戁E*
   ```powershell
   node generate-users.js
   ```

   これにより、`backend/users.json`ファイルが作�Eされます、E

3. **users.jsonをデプロイに含める**
   - `users.json`は既に`.gitignore`に追加されてぁE��ため、Gitにはコミットされません
   - チE�Eロイ時に`users.json`がコンチE��に含まれるように、`.dockerignore`を確認してください

## 登録されるユーザー

以下�E19名�Eユーザーが登録されます（パスワーチE `init00@tamron`�E�！E

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

## 注意事頁E

1. **パスワーチE*: すべてのユーザーは初期パスワーチE`init00@tamron` で登録されまぁE
2. **セキュリチE��**: 初回ログイン後、パスワード�E変更を推奨します（現在のシスチE��ではパスワード変更機�Eは未実裁E��E
3. **ファイルの場所**: `backend/users.json`に保存されまぁE
4. **Git管琁E*: `users.json`は`.gitignore`に追加されてぁE��ため、Gitにはコミットされません
