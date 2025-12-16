# 新しいプロジェクトへの移行手順

## 新しいプロジェクト情報

- **プロジェクトID**: `tamron-cloudrun-prod-new`
- **ドメイン**: `tamron-compo2.com`
- **APIキー**: `a6a925178e7669bd8305d58899a3c4d0330dabf0`

## セットアップ手順

### ステップ1: プロジェクトを切り替え

```powershell
gcloud config set project tamron-cloudrun-prod-new
```

### ステップ2: 必要なAPIを有効化

```powershell
gcloud services enable run.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable secretmanager.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable cloudbuild.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable artifactregistry.googleapis.com --project=tamron-cloudrun-prod-new
```

### ステップ3: Artifact Registryリポジトリを作成

```powershell
gcloud artifacts repositories create ai-drbfm-backend `
    --repository-format=docker `
    --location=asia-northeast1 `
    --project=tamron-cloudrun-prod-new `
    --description="AI-DRBFM Backend Docker images"
```

### ステップ4: Secret ManagerにAPIキーを追加

```powershell
# Secretを作成
gcloud secrets create gemini-api-key --project=tamron-cloudrun-prod-new

# APIキーを追加
echo "a6a925178e7669bd8305d58899a3c4d0330dabf0" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### ステップ5: Secret Managerへのアクセス権限を設定

```powershell
# Cloud Runサービスアカウントに権限を付与
gcloud secrets add-iam-policy-binding gemini-api-key `
    --member="serviceAccount:$(gcloud projects describe tamron-cloudrun-prod-new --format='value(projectNumber)')-compute@developer.gserviceaccount.com" `
    --role="roles/secretmanager.secretAccessor" `
    --project=tamron-cloudrun-prod-new
```

### ステップ6: cloudbuild.yamlを確認

`cloudbuild.yaml`の`$PROJECT_ID`が新しいプロジェクトIDを参照することを確認してください。

### ステップ7: Cloud Buildサービスアカウントに権限を付与

```powershell
# プロジェクト番号を取得
$PROJECT_NUMBER = gcloud projects describe tamron-cloudrun-prod-new --format='value(projectNumber)'

# Cloud Buildサービスアカウントに権限を付与
gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" `
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" `
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/logging.logWriter"
```

### ステップ8: デプロイ

```powershell
gcloud builds submit --config=cloudbuild.yaml --project=tamron-cloudrun-prod-new
```

### ステップ9: 公開アクセスを許可

```powershell
gcloud run services add-iam-policy-binding ai-drbfm-backend `
    --region=asia-northeast1 `
    --member="allUsers" `
    --role="roles/run.invoker" `
    --project=tamron-cloudrun-prod-new
```

## 確認事項

- 新しいプロジェクトID: `tamron-cloudrun-prod-new`
- APIキー: `a6a925178e7669bd8305d58899a3c4d0330dabf0`
- リージョン: `asia-northeast1`

上記の手順を実行しますか？それとも、特定のステップから始めますか？

