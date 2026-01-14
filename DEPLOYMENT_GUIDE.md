# Google Cloud Secret Managerを使用したデプロイガイド

## 前提条件

1. Google Cloud Projectが作成されていること
2. Secret Manager APIが有効になっていること
3. Cloud FunctionsまたはApp Engineのデプロイ権限があること

## 手順

### 1. Secret ManagerにAPIキーを保存

```bash
# Google Cloud CLIでログイン
gcloud auth login

# プロジェクトを設定
gcloud config set project YOUR_PROJECT_ID

# Secret ManagerにAPIキーを保存
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

### 2. Secret Managerへのアクセス権限を設定

Cloud FunctionsまたはApp EngineのサービスアカウントにSecret Managerへのアクセス権限を付与：

```bash
# サービスアカウントのメールアドレスを取得
SERVICE_ACCOUNT=$(gcloud iam service-accounts list --filter="displayName:App Engine default service account" --format="value(email)")

# Secret Managerへのアクセス権限を付与
gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

### 3. Cloud Functionsにデプロイ

```bash
cd backend

# 依存関係をインストール
npm install

# Cloud Functionsにデプロイ
gcloud functions deploy geminiProxy \
    --runtime nodejs20 \
    --trigger http \
    --allow-unauthenticated \
    --set-env-vars GEMINI_API_KEY_SECRET_NAME=gemini-api-key \
    --region asia-northeast1
```

### 4. App Engineにデプロイ（オプション）

```bash
cd backend

# 依存関係をインストール
npm install

# App Engineにデプロイ
gcloud app deploy app.yaml
```

### 5. フロントエンドコードの更新

`ai-drbfm.js`と`license-management.js`を更新して、バックエンドAPIを呼び出すように変更します。

## 環境変数の設定

Cloud FunctionsまたはApp Engineの環境変数として以下を設定：

- `GEMINI_API_KEY_SECRET_NAME`: Secret Managerのシークレット名（デフォルト: `gemini-api-key`）
- `GOOGLE_CLOUD_PROJECT`: Google Cloud Project ID（自動設定される場合あり）

## トラブルシューティング

### Secret ManagerからAPIキーが取得できない

1. サービスアカウントに適切な権限があるか確認
2. シークレット名が正しいか確認
3. プロジェクトIDが正しいか確認

### CORSエラーが発生する

Cloud FunctionsまたはApp EngineのCORS設定を確認してください。



