# Cloud Run 縺ｸ縺ｮ繝・・繝ｭ繧､譁ｹ豕・

## App Engine vs Cloud Run

迴ｾ蝨ｨ縲、pp Engine縺ｧ繝・・繝ｭ繧､縺励ｈ縺・→縺励※縺・∪縺吶′縲，loud Run縺ｫ蛻・ｊ譖ｿ縺医ｋ縺薙→繧ょ庄閭ｽ縺ｧ縺吶・

### App Engine縺ｮ蛻ｩ轤ｹ
- 繧ｷ繝ｳ繝励Ν縺ｪ險ｭ螳夲ｼ・pp.yaml縺ｮ縺ｿ・・
- 閾ｪ蜍輔せ繧ｱ繝ｼ繝ｪ繝ｳ繧ｰ
- 繧ｵ繝ｼ繝舌・繝ｬ繧ｹ

### Cloud Run縺ｮ蛻ｩ轤ｹ
- 繧医ｊ譟碑ｻ溘↑險ｭ螳・
- Docker繧ｳ繝ｳ繝・リ繝吶・繧ｹ
- 繧医ｊ邏ｰ縺九＞蛻ｶ蠕｡縺悟庄閭ｽ

## Cloud Run縺ｫ蛻・ｊ譖ｿ縺医ｋ蝣ｴ蜷医・謇矩・

### 繧ｹ繝・ャ繝・: Dockerfile縺ｮ菴懈・

`backend/Dockerfile` 繧剃ｽ懈・・・

```dockerfile
FROM node:20-slim

WORKDIR /app

# package.json縺ｨpackage-lock.json繧偵さ繝斐・
COPY package*.json ./

# 萓晏ｭ倬未菫ゅｒ繧､繝ｳ繧ｹ繝医・繝ｫ
RUN npm ci --only=production

# 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ繧ｳ繝ｼ繝峨ｒ繧ｳ繝斐・
COPY . .

# 繝昴・繝医ｒ蜈ｬ髢・
EXPOSE 8080

# 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ繧定ｵｷ蜍・
CMD ["node", "server.js"]
```

### 繧ｹ繝・ャ繝・: .dockerignore縺ｮ菴懈・

`backend/.dockerignore` 繧剃ｽ懈・・・

```
node_modules
npm-debug.log
.env
.gcloudignore
.git
.gitignore
```

### 繧ｹ繝・ャ繝・: cloudbuild.yaml縺ｮ菴懈・

`backend/cloudbuild.yaml` 繧剃ｽ懈・・医Θ繝ｼ繧ｶ繝ｼ縺梧署遉ｺ縺励◆蜀・ｮｹ繧偵・繝ｼ繧ｹ縺ｫ・会ｼ・

```yaml
steps:
  # 1. Docker 繧､繝｡繝ｼ繧ｸ繧偵ン繝ｫ繝峨☆繧・
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'asia-northeast1-docker.pkg.dev/$PROJECT_ID/ai-drbfm-backend/app:latest', '.']

  # 2. Artifact Registry 縺ｫ繧､繝｡繝ｼ繧ｸ繧偵・繝・す繝･縺吶ｋ
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'asia-northeast1-docker.pkg.dev/$PROJECT_ID/ai-drbfm-backend/app:latest']

  # 3. Cloud Run 縺ｫ繝・・繝ｭ繧､縺吶ｋ
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

### 繧ｹ繝・ャ繝・: Artifact Registry縺ｮ貅門ｙ

```powershell
# Artifact Registry繝ｪ繝昴ず繝医Μ繧剃ｽ懈・
gcloud artifacts repositories create ai-drbfm-backend \
    --repository-format=docker \
    --location=asia-northeast1 \
    --project=singular-server-480006-s8
```

### 繧ｹ繝・ャ繝・: Cloud Build縺ｧ繝・・繝ｭ繧､

```powershell
cd backend
gcloud builds submit --config=cloudbuild.yaml --project=singular-server-480006-s8
```

## 謗ｨ螂ｨ莠矩・

**迴ｾ蝨ｨ縺ｮ迥ｶ豕√〒縺ｯ縲、pp Engine繧堤ｶ夊｡後☆繧九％縺ｨ繧呈耳螂ｨ縺励∪縺吶・*

逅・罰・・
1. 譌｢縺ｫApp Engine縺ｮ蛻晄悄蛹悶′螳御ｺ・＠縺ｦ縺・ｋ
2. app.yaml縺ｮ險ｭ螳壹′縺ｻ縺ｼ螳御ｺ・＠縺ｦ縺・ｋ・・ervice_account縺ｮ蝠城｡後ｒ菫ｮ豁｣貂医∩・・
3. 繧医ｊ繧ｷ繝ｳ繝励Ν縺ｧ縲√☆縺舌↓繝・・繝ｭ繧､縺ｧ縺阪ｋ

App Engine縺ｧ邯夊｡後☆繧句ｴ蜷医・縲∽ｿｮ豁｣縺励◆app.yaml縺ｧ蜀榊ｺｦ繝・・繝ｭ繧､繧貞ｮ溯｡後＠縺ｦ縺上□縺輔＞縲・


