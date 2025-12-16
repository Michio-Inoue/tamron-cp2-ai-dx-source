# 新しいプロジェクト tamron-cloudrun-prod-new のセットアップスクリプト

Write-Host "=== 新しいプロジェクトへの移行を開始します ===" -ForegroundColor Green

# ステップ1: プロジェクトを切り替え
Write-Host "`n[1/9] プロジェクトを切り替え中..." -ForegroundColor Yellow
gcloud config set project tamron-cloudrun-prod-new
if ($LASTEXITCODE -ne 0) {
    Write-Host "エラー: プロジェクトの切り替えに失敗しました" -ForegroundColor Red
    exit 1
}
Write-Host "✓ プロジェクトを tamron-cloudrun-prod-new に切り替えました" -ForegroundColor Green

# ステップ2: 必要なAPIを有効化
Write-Host "`n[2/9] 必要なAPIを有効化中..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable secretmanager.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable cloudbuild.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable artifactregistry.googleapis.com --project=tamron-cloudrun-prod-new
Write-Host "✓ APIを有効化しました" -ForegroundColor Green

# ステップ3: Artifact Registryリポジトリを作成
Write-Host "`n[3/9] Artifact Registryリポジトリを作成中..." -ForegroundColor Yellow
$repoExists = gcloud artifacts repositories list --location=asia-northeast1 --project=tamron-cloudrun-prod-new --filter="name:ai-drbfm-backend" --format="value(name)" 2>&1
if ([string]::IsNullOrEmpty($repoExists)) {
    gcloud artifacts repositories create ai-drbfm-backend `
        --repository-format=docker `
        --location=asia-northeast1 `
        --project=tamron-cloudrun-prod-new `
        --description="AI-DRBFM Backend Docker images"
    Write-Host "✓ Artifact Registryリポジトリを作成しました" -ForegroundColor Green
} else {
    Write-Host "✓ Artifact Registryリポジトリは既に存在します" -ForegroundColor Green
}

# ステップ4: Secret ManagerにAPIキーを追加
Write-Host "`n[4/9] Secret ManagerにAPIキーを追加中..." -ForegroundColor Yellow
$secretExists = gcloud secrets list --project=tamron-cloudrun-prod-new --filter="name:gemini-api-key" --format="value(name)" 2>&1
if ([string]::IsNullOrEmpty($secretExists)) {
    gcloud secrets create gemini-api-key --project=tamron-cloudrun-prod-new
    Write-Host "✓ Secretを作成しました" -ForegroundColor Green
}
echo "a6a925178e7669bd8305d58899a3c4d0330dabf0" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
Write-Host "✓ APIキーをSecret Managerに追加しました" -ForegroundColor Green

# ステップ5: プロジェクト番号を取得
Write-Host "`n[5/9] プロジェクト番号を取得中..." -ForegroundColor Yellow
$PROJECT_NUMBER = gcloud projects describe tamron-cloudrun-prod-new --format='value(projectNumber)'
Write-Host "✓ プロジェクト番号: $PROJECT_NUMBER" -ForegroundColor Green

# ステップ6: Secret Managerへのアクセス権限を設定
Write-Host "`n[6/9] Secret Managerへのアクセス権限を設定中..." -ForegroundColor Yellow
gcloud secrets add-iam-policy-binding gemini-api-key `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/secretmanager.secretAccessor" `
    --project=tamron-cloudrun-prod-new
Write-Host "✓ Secret Managerへのアクセス権限を設定しました" -ForegroundColor Green

# ステップ7: Cloud Buildサービスアカウントに権限を付与
Write-Host "`n[7/9] Cloud Buildサービスアカウントに権限を付与中..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" `
    --role="roles/storage.admin" 2>&1 | Out-Null

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" `
    --role="roles/artifactregistry.writer" 2>&1 | Out-Null

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/artifactregistry.writer" 2>&1 | Out-Null

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/run.admin" 2>&1 | Out-Null

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/iam.serviceAccountUser" 2>&1 | Out-Null

gcloud projects add-iam-policy-binding tamron-cloudrun-prod-new `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/logging.logWriter" 2>&1 | Out-Null

Write-Host "✓ 権限を付与しました" -ForegroundColor Green

# ステップ8: デプロイ
Write-Host "`n[8/9] Cloud Runにデプロイ中..." -ForegroundColor Yellow
Write-Host "（この処理には数分かかる場合があります）" -ForegroundColor Gray
gcloud builds submit --config=cloudbuild.yaml --project=tamron-cloudrun-prod-new
if ($LASTEXITCODE -ne 0) {
    Write-Host "エラー: デプロイに失敗しました" -ForegroundColor Red
    exit 1
}
Write-Host "✓ デプロイが完了しました" -ForegroundColor Green

# ステップ9: 公開アクセスを許可
Write-Host "`n[9/9] 公開アクセスを許可中..." -ForegroundColor Yellow
gcloud run services add-iam-policy-binding ai-drbfm-backend `
    --region=asia-northeast1 `
    --member="allUsers" `
    --role="roles/run.invoker" `
    --project=tamron-cloudrun-prod-new 2>&1 | Out-Null
Write-Host "✓ 公開アクセスを許可しました（組織ポリシーにより失敗する場合があります）" -ForegroundColor Green

# 完了
Write-Host "`n=== セットアップが完了しました ===" -ForegroundColor Green
$serviceUrl = gcloud run services describe ai-drbfm-backend --region=asia-northeast1 --project=tamron-cloudrun-prod-new --format="value(status.url)" 2>&1
Write-Host "サービスURL: $serviceUrl" -ForegroundColor Cyan

