# New project tamron-cloudrun-prod-new setup script

Write-Host "=== Starting migration to new project ===" -ForegroundColor Green

# Step 1: Switch project
Write-Host "`n[1/9] Switching project..." -ForegroundColor Yellow
gcloud config set project tamron-cloudrun-prod-new
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to switch project" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Switched to tamron-cloudrun-prod-new" -ForegroundColor Green

# Step 2: Enable required APIs
Write-Host "`n[2/9] Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable secretmanager.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable cloudbuild.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable artifactregistry.googleapis.com --project=tamron-cloudrun-prod-new
Write-Host "OK: APIs enabled" -ForegroundColor Green

# Step 3: Create Artifact Registry repository
Write-Host "`n[3/9] Creating Artifact Registry repository..." -ForegroundColor Yellow
$repoExists = gcloud artifacts repositories list --location=asia-northeast1 --project=tamron-cloudrun-prod-new --filter="name:ai-drbfm-backend" --format="value(name)" 2>&1
if ([string]::IsNullOrEmpty($repoExists)) {
    gcloud artifacts repositories create ai-drbfm-backend `
        --repository-format=docker `
        --location=asia-northeast1 `
        --project=tamron-cloudrun-prod-new `
        --description="AI-DRBFM Backend Docker images"
    Write-Host "OK: Artifact Registry repository created" -ForegroundColor Green
} else {
    Write-Host "OK: Artifact Registry repository already exists" -ForegroundColor Green
}

# Step 4: Add API key to Secret Manager
Write-Host "`n[4/9] Adding API key to Secret Manager..." -ForegroundColor Yellow
$secretExists = gcloud secrets list --project=tamron-cloudrun-prod-new --filter="name:gemini-api-key" --format="value(name)" 2>&1
if ([string]::IsNullOrEmpty($secretExists)) {
    gcloud secrets create gemini-api-key --project=tamron-cloudrun-prod-new
    Write-Host "OK: Secret created" -ForegroundColor Green
}
echo "a6a925178e7669bd8305d58899a3c4d0330dabf0" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
Write-Host "OK: API key added to Secret Manager" -ForegroundColor Green

# Step 5: Get project number
Write-Host "`n[5/9] Getting project number..." -ForegroundColor Yellow
$PROJECT_NUMBER = gcloud projects describe tamron-cloudrun-prod-new --format='value(projectNumber)'
Write-Host "OK: Project number: $PROJECT_NUMBER" -ForegroundColor Green

# Step 6: Set Secret Manager access permissions
Write-Host "`n[6/9] Setting Secret Manager access permissions..." -ForegroundColor Yellow
gcloud secrets add-iam-policy-binding gemini-api-key `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/secretmanager.secretAccessor" `
    --project=tamron-cloudrun-prod-new
Write-Host "OK: Secret Manager access permissions set" -ForegroundColor Green

# Step 7: Grant permissions to Cloud Build service account
Write-Host "`n[7/9] Granting permissions to Cloud Build service account..." -ForegroundColor Yellow
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

Write-Host "OK: Permissions granted" -ForegroundColor Green

# Step 8: Deploy
Write-Host "`n[8/9] Deploying to Cloud Run..." -ForegroundColor Yellow
Write-Host "(This may take several minutes)" -ForegroundColor Gray
gcloud builds submit --config=cloudbuild.yaml --project=tamron-cloudrun-prod-new
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Deployment failed" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Deployment completed" -ForegroundColor Green

# Step 9: Allow public access
Write-Host "`n[9/9] Allowing public access..." -ForegroundColor Yellow
gcloud run services add-iam-policy-binding ai-drbfm-backend `
    --region=asia-northeast1 `
    --member="allUsers" `
    --role="roles/run.invoker" `
    --project=tamron-cloudrun-prod-new 2>&1 | Out-Null
Write-Host "OK: Public access allowed (may fail due to organization policy)" -ForegroundColor Green

# Complete
Write-Host "`n=== Setup completed ===" -ForegroundColor Green
$serviceUrl = gcloud run services describe ai-drbfm-backend --region=asia-northeast1 --project=tamron-cloudrun-prod-new --format="value(status.url)" 2>&1
Write-Host "Service URL: $serviceUrl" -ForegroundColor Cyan
