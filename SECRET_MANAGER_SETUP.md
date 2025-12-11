# Google Cloud Secret Manager セットアップガイド

## 概要

このガイドでは、Google Cloud Secret Managerを使用してGemini APIキーを安全に管理する方法を説明します。

## 前提条件

1. Google Cloud Projectが作成されていること
2. Google Cloud CLI (`gcloud`) がインストールされていること
3. Secret Manager APIが有効になっていること

## セットアップ手順

### 1. Google Cloud CLIでログイン

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Secret Manager APIを有効化

```bash
gcloud services enable secretmanager.googleapis.com
```

### 3. Secret ManagerにAPIキーを保存

```bash
# APIキーをSecret Managerに保存
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
    --data-file=- \
    --replication-policy="automatic"
```

または、Google Cloud Consoleから：
1. [Secret Manager](https://console.cloud.google.com/security/secret-manager)にアクセス
2. 「シークレットを作成」をクリック
3. 名前: `gemini-api-key`
4. シークレットの値: あなたのGemini APIキーを入力
5. 「作成」をクリック

### 4. サービスアカウントに権限を付与

#### App Engineの場合

```bash
# App Engineのデフォルトサービスアカウントに権限を付与
SERVICE_ACCOUNT="YOUR_PROJECT_ID@appspot.gserviceaccount.com"

gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

#### Cloud Functionsの場合

```bash
# Cloud Functionsのデフォルトサービスアカウントに権限を付与
SERVICE_ACCOUNT="YOUR_PROJECT_ID@appspot.gserviceaccount.com"

gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

または、Cloud Functionsのデプロイ時に指定：

```bash
gcloud functions deploy geminiProxy \
    --runtime nodejs20 \
    --trigger http \
    --allow-unauthenticated \
    --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
    --region asia-northeast1
```

### 5. 環境変数の設定

#### App Engine (`app.yaml`)

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'
```

#### Cloud Functions

環境変数として設定：

```bash
gcloud functions deploy geminiProxy \
    --set-env-vars GEMINI_API_KEY_SECRET_NAME=gemini-api-key \
    --region asia-northeast1
```

### 6. ローカル開発環境の設定

ローカル開発時は、環境変数から直接APIキーを取得できます：

```bash
# .envファイルを作成（.gitignoreに追加済み）
echo "GEMINI_API_KEY=your_api_key_here" > backend/.env
```

または、環境変数として設定：

```bash
export GEMINI_API_KEY="your_api_key_here"
```

## デプロイ

### App Engineにデプロイ

```bash
cd backend
gcloud app deploy app.yaml
```

### Cloud Functionsにデプロイ

```bash
cd backend
npm install
gcloud functions deploy geminiProxy \
    --runtime nodejs20 \
    --trigger http \
    --allow-unauthenticated \
    --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
    --region asia-northeast1
```

## トラブルシューティング

### Secret ManagerからAPIキーが取得できない

1. サービスアカウントに適切な権限があるか確認：
   ```bash
   gcloud secrets get-iam-policy gemini-api-key
   ```

2. シークレット名が正しいか確認：
   ```bash
   gcloud secrets list
   ```

3. プロジェクトIDが正しいか確認：
   ```bash
   gcloud config get-value project
   ```

### ローカル環境で動作しない

ローカル環境では、環境変数 `GEMINI_API_KEY` を設定してください：

```bash
export GEMINI_API_KEY="your_api_key_here"
```

または、`.env`ファイルを作成：

```bash
echo "GEMINI_API_KEY=your_api_key_here" > backend/.env
```

## セキュリティのベストプラクティス

1. **APIキーのローテーション**: 定期的にAPIキーを更新し、Secret Managerの新しいバージョンを作成
2. **最小権限の原則**: 必要なサービスアカウントにのみアクセス権限を付与
3. **監査ログ**: Secret Managerのアクセスログを定期的に確認
4. **環境分離**: 開発、ステージング、本番環境で異なるシークレットを使用


