# 譁ｰ縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝医∈縺ｮ遘ｻ陦梧焔鬆・

## 譁ｰ縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝域ュ蝣ｱ

- **繝励Ο繧ｸ繧ｧ繧ｯ繝・D**: `tamron-cloudrun-prod-new`
- **繝峨Γ繧､繝ｳ**: `tamron-compo2.com`
- **API繧ｭ繝ｼ**: `a6a925178e7669bd8305d58899a3c4d0330dabf0`

## 繧ｻ繝・ヨ繧｢繝・・謇矩・

### 繧ｹ繝・ャ繝・: 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ蛻・ｊ譖ｿ縺・

```powershell
gcloud config set project tamron-cloudrun-prod-new
```

### 繧ｹ繝・ャ繝・: 蠢・ｦ√↑API繧呈怏蜉ｹ蛹・

```powershell
gcloud services enable run.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable secretmanager.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable cloudbuild.googleapis.com --project=tamron-cloudrun-prod-new
gcloud services enable artifactregistry.googleapis.com --project=tamron-cloudrun-prod-new
```

### 繧ｹ繝・ャ繝・: Artifact Registry繝ｪ繝昴ず繝医Μ繧剃ｽ懈・

```powershell
gcloud artifacts repositories create ai-drbfm-backend `
    --repository-format=docker `
    --location=asia-northeast1 `
    --project=tamron-cloudrun-prod-new `
    --description="AI-DRBFM Backend Docker images"
```

### 繧ｹ繝・ャ繝・: Secret Manager縺ｫAPI繧ｭ繝ｼ繧定ｿｽ蜉

```powershell
# Secret繧剃ｽ懈・
gcloud secrets create gemini-api-key --project=tamron-cloudrun-prod-new

# API繧ｭ繝ｼ繧定ｿｽ蜉
echo "a6a925178e7669bd8305d58899a3c4d0330dabf0" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### 繧ｹ繝・ャ繝・: Secret Manager縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌ｒ險ｭ螳・

```powershell
# Cloud Run繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・
gcloud secrets add-iam-policy-binding gemini-api-key `
    --member="serviceAccount:$(gcloud projects describe tamron-cloudrun-prod-new --format='value(projectNumber)')-compute@developer.gserviceaccount.com" `
    --role="roles/secretmanager.secretAccessor" `
    --project=tamron-cloudrun-prod-new
```

### 繧ｹ繝・ャ繝・: cloudbuild.yaml繧堤｢ｺ隱・

`cloudbuild.yaml`縺ｮ`$PROJECT_ID`縺梧眠縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝・D繧貞盾辣ｧ縺吶ｋ縺薙→繧堤｢ｺ隱阪＠縺ｦ縺上□縺輔＞縲・

### 繧ｹ繝・ャ繝・: Cloud Build繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・

```powershell
# 繝励Ο繧ｸ繧ｧ繧ｯ繝育分蜿ｷ繧貞叙蠕・
$PROJECT_NUMBER = gcloud projects describe tamron-cloudrun-prod-new --format='value(projectNumber)'

# Cloud Build繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・
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

### 繧ｹ繝・ャ繝・: 繝・・繝ｭ繧､

```powershell
gcloud builds submit --config=cloudbuild.yaml --project=tamron-cloudrun-prod-new
```

### 繧ｹ繝・ャ繝・: 蜈ｬ髢九い繧ｯ繧ｻ繧ｹ繧定ｨｱ蜿ｯ

```powershell
gcloud run services add-iam-policy-binding ai-drbfm-backend `
    --region=asia-northeast1 `
    --member="allUsers" `
    --role="roles/run.invoker" `
    --project=tamron-cloudrun-prod-new
```

## 遒ｺ隱堺ｺ矩・

- 譁ｰ縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝・D: `tamron-cloudrun-prod-new`
- API繧ｭ繝ｼ: `a6a925178e7669bd8305d58899a3c4d0330dabf0`
- 繝ｪ繝ｼ繧ｸ繝ｧ繝ｳ: `asia-northeast1`

荳願ｨ倥・謇矩・ｒ螳溯｡後＠縺ｾ縺吶°・溘◎繧後→繧ゅ∫音螳壹・繧ｹ繝・ャ繝励°繧牙ｧ九ａ縺ｾ縺吶°・・


