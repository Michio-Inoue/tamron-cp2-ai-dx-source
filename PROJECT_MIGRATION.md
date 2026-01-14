# プロジェクトとキーの変更手順

## 必要な情報

以下の情報を教えてください：

1. **新しいプロジェクトID**: 例: `new-project-id`
2. **新しいAPIキー**: 新しいGemini APIキー
3. **移行方法**: 
   - 既存のサービスを新しいプロジェクトに移行する
   - 新しいプロジェクトで新規にデプロイする

## 手順（新しいプロジェクトで新規デプロイする場合）

### ステップ1: 新しいプロジェクトを設定

```powershell
gcloud config set project NEW_PROJECT_ID
```

### ステップ2: 必要なAPIを有効化

```powershell
gcloud services enable run.googleapis.com --project=NEW_PROJECT_ID
gcloud services enable secretmanager.googleapis.com --project=NEW_PROJECT_ID
gcloud services enable cloudbuild.googleapis.com --project=NEW_PROJECT_ID
gcloud services enable artifactregistry.googleapis.com --project=NEW_PROJECT_ID
```

### ステップ3: Artifact Registryリポジトリを作成

```powershell
gcloud artifacts repositories create ai-drbfm-backend `
    --repository-format=docker `
    --location=asia-northeast1 `
    --project=NEW_PROJECT_ID `
    --description="AI-DRBFM Backend Docker images"
```

### ステップ4: Secret ManagerにAPIキーを追加

```powershell
# Secretを作成（まだ存在しない場合）
gcloud secrets create gemini-api-key --project=NEW_PROJECT_ID

# APIキーを追加
echo "YOUR_NEW_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=NEW_PROJECT_ID
```

### ステップ5: cloudbuild.yamlを更新

`cloudbuild.yaml`の`$PROJECT_ID`が新しいプロジェクトIDを参照するように確認してください。

### ステップ6: デプロイ

```powershell
gcloud builds submit --config=cloudbuild.yaml --project=NEW_PROJECT_ID
```

## 手順（既存のサービスを移行する場合）

既存のサービスを新しいプロジェクトに移行する場合は、上記の手順に加えて、既存のリソースをエクスポート/インポートする必要があります。

## 確認事項

新しいプロジェクトIDとAPIキーを教えていただければ、自動的に設定を更新します。


