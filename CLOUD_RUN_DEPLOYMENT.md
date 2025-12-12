# Cloud Run へのデプロイ方法

## App Engine vs Cloud Run

現在、App Engineでデプロイしようとしていますが、Cloud Runに切り替えることも可能です。

### App Engineの利点
- シンプルな設定（app.yamlのみ）
- 自動スケーリング
- サーバーレス

### Cloud Runの利点
- より柔軟な設定
- Dockerコンテナベース
- より細かい制御が可能

## Cloud Runに切り替える場合の手順

### ステップ1: Dockerfileの作成

`backend/Dockerfile` を作成：

```dockerfile
FROM node:20-slim

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# アプリケーションコードをコピー
COPY . .

# ポートを公開
EXPOSE 8080

# アプリケーションを起動
CMD ["node", "server.js"]
```

### ステップ2: .dockerignoreの作成

`backend/.dockerignore` を作成：

```
node_modules
npm-debug.log
.env
.gcloudignore
.git
.gitignore
```

### ステップ3: cloudbuild.yamlの作成

`backend/cloudbuild.yaml` を作成（ユーザーが提示した内容をベースに）：

```yaml
steps:
  # 1. Docker イメージをビルドする
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'asia-northeast1-docker.pkg.dev/$PROJECT_ID/ai-drbfm-backend/app:latest', '.']

  # 2. Artifact Registry にイメージをプッシュする
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'asia-northeast1-docker.pkg.dev/$PROJECT_ID/ai-drbfm-backend/app:latest']

  # 3. Cloud Run にデプロイする
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'ai-drbfm-backend'
      - '--image'
      - 'asia-northeast1-docker.pkg.dev/$PROJECT_ID/ai-drbfm-backend/app:latest'
      - '--region'
      - 'asia-northeast1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'GEMINI_API_KEY_SECRET_NAME=gemini-api-key,NODE_ENV=production'
      - '--set-secrets'
      - 'GEMINI_API_KEY=gemini-api-key:latest'

images:
  - 'asia-northeast1-docker.pkg.dev/$PROJECT_ID/ai-drbfm-backend/app:latest'
```

### ステップ4: Artifact Registryの準備

```powershell
# Artifact Registryリポジトリを作成
gcloud artifacts repositories create ai-drbfm-backend \
    --repository-format=docker \
    --location=asia-northeast1 \
    --project=singular-server-480006-s8
```

### ステップ5: Cloud Buildでデプロイ

```powershell
cd backend
gcloud builds submit --config=cloudbuild.yaml --project=singular-server-480006-s8
```

## 推奨事項

**現在の状況では、App Engineを続行することを推奨します。**

理由：
1. 既にApp Engineの初期化が完了している
2. app.yamlの設定がほぼ完了している（service_accountの問題を修正済み）
3. よりシンプルで、すぐにデプロイできる

App Engineで続行する場合は、修正したapp.yamlで再度デプロイを実行してください。

