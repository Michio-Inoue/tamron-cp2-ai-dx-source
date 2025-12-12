# App Engineデプロイ問題の解決方法

## 問題の分析

ユーザーの分析によると：
- App Engineが古いContainer Registry (GCR) 形式（`asia.gcr.io`）を参照している
- これは廃止予定の形式で、現在はArtifact Registryを使用する必要がある
- エラーはキャッシュイメージへのアクセスに関するもの

## 解決方法

### 方法1: App Engineの設定を明示的に指定

`app.yaml` に明示的な設定を追加して、Artifact Registryを強制：

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'

# ビルド設定を明示的に指定
# これにより、古いGCR形式の参照を回避できる可能性があります
```

### 方法2: キャッシュを無効化してデプロイ

キャッシュを使用せずにデプロイを試行：

```powershell
gcloud app deploy app.yaml --project=singular-server-480006-s8 --no-promote --version=$(Get-Date -Format "yyyyMMddHHmmss")
```

### 方法3: Google Cloud Consoleで設定を確認

1. **App Engine設定を確認**：
   ```
   https://console.cloud.google.com/appengine/settings?project=singular-server-480006-s8
   ```

2. **Cloud Build設定を確認**：
   ```
   https://console.cloud.google.com/cloud-build/settings?project=singular-server-480006-s8
   ```

3. **古い設定があれば削除または更新**

### 方法4: 最小限のアプリケーションでテスト

まず、最小限のアプリケーションでデプロイを試行して、問題を特定：

1. 新しい`app.yaml`を作成（最小限の設定）
2. 簡単な`server.js`でテスト
3. 成功したら、段階的に機能を追加

## 推奨される手順

1. **まず、Google Cloud Consoleで以下を確認**：
   - App Engine設定
   - Cloud Build設定
   - 古いトリガーや設定がないか

2. **キャッシュを無効化してデプロイを試行**

3. **それでも失敗する場合は、Cloud Runに切り替えを検討**

## 代替案: Cloud Runに切り替え

App Engineでのデプロイが続けて失敗する場合は、Cloud Runに切り替えることを検討してください。Cloud Runは：
- より柔軟な設定が可能
- Dockerコンテナベースで、この問題を回避できる
- より詳細なログとデバッグが可能

詳細は `CLOUD_RUN_DEPLOYMENT.md` を参照してください。

