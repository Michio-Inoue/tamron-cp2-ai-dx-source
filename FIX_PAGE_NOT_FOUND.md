# "Page not found" エラーの解決方法

## 問題の原因

「Page not found」エラーが発生する主な原因：

1. **デプロイが完了していない**
   - デプロイが途中で中断された
   - デプロイが失敗した

2. **サービスが存在しない**
   - App Engineサービスが正しく作成されていない

3. **アプリケーションが起動していない**
   - アプリケーションの起動に失敗している

## 解決方法

### 方法1: デプロイを再実行

```powershell
cd backend
gcloud app deploy app.yaml --project=singular-server-480006-s8
```

デプロイには5〜10分かかります。

### 方法2: デプロイ状態を確認

```powershell
# サービス一覧を確認
gcloud app services list --project=singular-server-480006-s8

# バージョン一覧を確認
gcloud app versions list --project=singular-server-480006-s8

# ビルドの状態を確認
gcloud builds list --project=singular-server-480006-s8 --limit=5
```

### 方法3: ログを確認

```powershell
# 最新のログを確認
gcloud app logs read -s default --project=singular-server-480006-s8 --limit=50
```

## 確認事項

### 1. app.yamlの設定

`backend/app.yaml` が正しく設定されているか確認：

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'

service_account: default
```

### 2. package.jsonの設定

`backend/package.json` に `start` スクリプトがあるか確認：

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 3. server.jsの設定

`backend/server.js` が正しく設定されているか確認：

- `app.listen()` が正しく設定されている
- ルートエンドポイント（`/`）が定義されている

## デプロイ後の確認

デプロイが完了したら：

1. **サービス一覧を確認**：
   ```powershell
   gcloud app services list --project=singular-server-480006-s8
   ```

2. **URLにアクセス**：
   ```
   https://singular-server-480006-s8.an.r.appspot.com
   ```

3. **正常な応答を確認**：
   ```json
   {"message":"AI-DRBFM Analysis Server"}
   ```

## トラブルシューティング

### デプロイが失敗する場合

1. **エラーメッセージを確認**
2. **ビルドログを確認**：
   ```powershell
   gcloud builds list --project=singular-server-480006-s8 --limit=1
   gcloud builds log BUILD_ID --project=singular-server-480006-s8
   ```

### よくあるエラー

- **Secret Managerへのアクセスエラー**: 権限が正しく付与されているか確認
- **依存関係のエラー**: `npm install` を再実行
- **ポートのエラー**: App Engineは自動的にPORT環境変数を設定します

