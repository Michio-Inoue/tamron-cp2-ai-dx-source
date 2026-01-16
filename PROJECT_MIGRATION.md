# 繝励Ο繧ｸ繧ｧ繧ｯ繝医→繧ｭ繝ｼ縺ｮ螟画峩謇矩・

## 蠢・ｦ√↑諠・ｱ

莉･荳九・諠・ｱ繧呈蕗縺医※縺上□縺輔＞・・

1. **譁ｰ縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝・D**: 萓・ `new-project-id`
2. **譁ｰ縺励＞API繧ｭ繝ｼ**: 譁ｰ縺励＞Gemini API繧ｭ繝ｼ
3. **遘ｻ陦梧婿豕・*: 
   - 譌｢蟄倥・繧ｵ繝ｼ繝薙せ繧呈眠縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝医↓遘ｻ陦後☆繧・
   - 譁ｰ縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝医〒譁ｰ隕上↓繝・・繝ｭ繧､縺吶ｋ

## 謇矩・ｼ域眠縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝医〒譁ｰ隕上ョ繝励Ο繧､縺吶ｋ蝣ｴ蜷茨ｼ・

### 繧ｹ繝・ャ繝・: 譁ｰ縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳・

```powershell
gcloud config set project NEW_PROJECT_ID
```

### 繧ｹ繝・ャ繝・: 蠢・ｦ√↑API繧呈怏蜉ｹ蛹・

```powershell
gcloud services enable run.googleapis.com --project=NEW_PROJECT_ID
gcloud services enable secretmanager.googleapis.com --project=NEW_PROJECT_ID
gcloud services enable cloudbuild.googleapis.com --project=NEW_PROJECT_ID
gcloud services enable artifactregistry.googleapis.com --project=NEW_PROJECT_ID
```

### 繧ｹ繝・ャ繝・: Artifact Registry繝ｪ繝昴ず繝医Μ繧剃ｽ懈・

```powershell
gcloud artifacts repositories create ai-drbfm-backend `
    --repository-format=docker `
    --location=asia-northeast1 `
    --project=NEW_PROJECT_ID `
    --description="AI-DRBFM Backend Docker images"
```

### 繧ｹ繝・ャ繝・: Secret Manager縺ｫAPI繧ｭ繝ｼ繧定ｿｽ蜉

```powershell
# Secret繧剃ｽ懈・・医∪縺蟄伜惠縺励↑縺・ｴ蜷茨ｼ・
gcloud secrets create gemini-api-key --project=NEW_PROJECT_ID

# API繧ｭ繝ｼ繧定ｿｽ蜉
echo "YOUR_NEW_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=NEW_PROJECT_ID
```

### 繧ｹ繝・ャ繝・: cloudbuild.yaml繧呈峩譁ｰ

`cloudbuild.yaml`縺ｮ`$PROJECT_ID`縺梧眠縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝・D繧貞盾辣ｧ縺吶ｋ繧医≧縺ｫ遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・

### 繧ｹ繝・ャ繝・: 繝・・繝ｭ繧､

```powershell
gcloud builds submit --config=cloudbuild.yaml --project=NEW_PROJECT_ID
```

## 謇矩・ｼ域里蟄倥・繧ｵ繝ｼ繝薙せ繧堤ｧｻ陦後☆繧句ｴ蜷茨ｼ・

譌｢蟄倥・繧ｵ繝ｼ繝薙せ繧呈眠縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝医↓遘ｻ陦後☆繧句ｴ蜷医・縲∽ｸ願ｨ倥・謇矩・↓蜉縺医※縲∵里蟄倥・繝ｪ繧ｽ繝ｼ繧ｹ繧偵お繧ｯ繧ｹ繝昴・繝・繧､繝ｳ繝昴・繝医☆繧句ｿ・ｦ√′縺ゅｊ縺ｾ縺吶・

## 遒ｺ隱堺ｺ矩・

譁ｰ縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｨAPI繧ｭ繝ｼ繧呈蕗縺医※縺・◆縺縺代ｌ縺ｰ縲∬・蜍慕噪縺ｫ險ｭ螳壹ｒ譖ｴ譁ｰ縺励∪縺吶・


