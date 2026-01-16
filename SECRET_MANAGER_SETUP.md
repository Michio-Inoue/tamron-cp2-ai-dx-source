# Google Cloud Secret Manager 繧ｻ繝・ヨ繧｢繝・・繧ｬ繧､繝・

## 讎りｦ・

縺薙・繧ｬ繧､繝峨〒縺ｯ縲；oogle Cloud Secret Manager繧剃ｽｿ逕ｨ縺励※Gemini API繧ｭ繝ｼ繧貞ｮ牙・縺ｫ邂｡逅・☆繧区婿豕輔ｒ隱ｬ譏弱＠縺ｾ縺吶・

## 蜑肴署譚｡莉ｶ

1. Google Cloud Project縺御ｽ懈・縺輔ｌ縺ｦ縺・ｋ縺薙→
2. Google Cloud CLI (`gcloud`) 縺後う繝ｳ繧ｹ繝医・繝ｫ縺輔ｌ縺ｦ縺・ｋ縺薙→
3. Secret Manager API縺梧怏蜉ｹ縺ｫ縺ｪ縺｣縺ｦ縺・ｋ縺薙→

## 繧ｻ繝・ヨ繧｢繝・・謇矩・

### 1. Google Cloud CLI縺ｧ繝ｭ繧ｰ繧､繝ｳ

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Secret Manager API繧呈怏蜉ｹ蛹・

```bash
gcloud services enable secretmanager.googleapis.com
```

### 3. Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ・

```bash
# API繧ｭ繝ｼ繧担ecret Manager縺ｫ菫晏ｭ・
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
    --data-file=- \
    --replication-policy="automatic"
```

縺ｾ縺溘・縲；oogle Cloud Console縺九ｉ・・
1. [Secret Manager](https://console.cloud.google.com/security/secret-manager)縺ｫ繧｢繧ｯ繧ｻ繧ｹ
2. 縲後す繝ｼ繧ｯ繝ｬ繝・ヨ繧剃ｽ懈・縲阪ｒ繧ｯ繝ｪ繝・け
3. 蜷榊燕: `gemini-api-key`
4. 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺ｮ蛟､: 縺ゅ↑縺溘・Gemini API繧ｭ繝ｼ繧貞・蜉・
5. 縲御ｽ懈・縲阪ｒ繧ｯ繝ｪ繝・け

### 4. 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・

#### App Engine縺ｮ蝣ｴ蜷・

```bash
# App Engine縺ｮ繝・ヵ繧ｩ繝ｫ繝医し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・
SERVICE_ACCOUNT="YOUR_PROJECT_ID@appspot.gserviceaccount.com"

gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

#### Cloud Functions縺ｮ蝣ｴ蜷・

```bash
# Cloud Functions縺ｮ繝・ヵ繧ｩ繝ｫ繝医し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・
SERVICE_ACCOUNT="YOUR_PROJECT_ID@appspot.gserviceaccount.com"

gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

縺ｾ縺溘・縲，loud Functions縺ｮ繝・・繝ｭ繧､譎ゅ↓謖・ｮ夲ｼ・

```bash
gcloud functions deploy geminiProxy \
    --runtime nodejs20 \
    --trigger http \
    --allow-unauthenticated \
    --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
    --region asia-northeast1
```

### 5. 迺ｰ蠅・､画焚縺ｮ險ｭ螳・

#### App Engine (`app.yaml`)

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'
```

#### Cloud Functions

迺ｰ蠅・､画焚縺ｨ縺励※險ｭ螳夲ｼ・

```bash
gcloud functions deploy geminiProxy \
    --set-env-vars GEMINI_API_KEY_SECRET_NAME=gemini-api-key \
    --region asia-northeast1
```

### 6. 繝ｭ繝ｼ繧ｫ繝ｫ髢狗匱迺ｰ蠅・・險ｭ螳・

繝ｭ繝ｼ繧ｫ繝ｫ髢狗匱譎ゅ・縲∫腸蠅・､画焚縺九ｉ逶ｴ謗･API繧ｭ繝ｼ繧貞叙蠕励〒縺阪∪縺呻ｼ・

```bash
# .env繝輔ぃ繧､繝ｫ繧剃ｽ懈・・・gitignore縺ｫ霑ｽ蜉貂医∩・・
echo "GEMINI_API_KEY=your_api_key_here" > backend/.env
```

縺ｾ縺溘・縲∫腸蠅・､画焚縺ｨ縺励※險ｭ螳夲ｼ・

```bash
export GEMINI_API_KEY="your_api_key_here"
```

## 繝・・繝ｭ繧､

### App Engine縺ｫ繝・・繝ｭ繧､

```bash
cd backend
gcloud app deploy app.yaml
```

### Cloud Functions縺ｫ繝・・繝ｭ繧､

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

## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### Secret Manager縺九ｉAPI繧ｭ繝ｼ縺悟叙蠕励〒縺阪↑縺・

1. 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓驕ｩ蛻・↑讓ｩ髯舌′縺ゅｋ縺狗｢ｺ隱搾ｼ・
   ```bash
   gcloud secrets get-iam-policy gemini-api-key
   ```

2. 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ蜷阪′豁｣縺励＞縺狗｢ｺ隱搾ｼ・
   ```bash
   gcloud secrets list
   ```

3. 繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺梧ｭ｣縺励＞縺狗｢ｺ隱搾ｼ・
   ```bash
   gcloud config get-value project
   ```

### 繝ｭ繝ｼ繧ｫ繝ｫ迺ｰ蠅・〒蜍穂ｽ懊＠縺ｪ縺・

繝ｭ繝ｼ繧ｫ繝ｫ迺ｰ蠅・〒縺ｯ縲∫腸蠅・､画焚 `GEMINI_API_KEY` 繧定ｨｭ螳壹＠縺ｦ縺上□縺輔＞・・

```bash
export GEMINI_API_KEY="your_api_key_here"
```

縺ｾ縺溘・縲～.env`繝輔ぃ繧､繝ｫ繧剃ｽ懈・・・

```bash
echo "GEMINI_API_KEY=your_api_key_here" > backend/.env
```

## 繧ｻ繧ｭ繝･繝ｪ繝・ぅ縺ｮ繝吶せ繝医・繝ｩ繧ｯ繝・ぅ繧ｹ

1. **API繧ｭ繝ｼ縺ｮ繝ｭ繝ｼ繝・・繧ｷ繝ｧ繝ｳ**: 螳壽悄逧・↓API繧ｭ繝ｼ繧呈峩譁ｰ縺励ヾecret Manager縺ｮ譁ｰ縺励＞繝舌・繧ｸ繝ｧ繝ｳ繧剃ｽ懈・
2. **譛蟆乗ｨｩ髯舌・蜴溷援**: 蠢・ｦ√↑繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓縺ｮ縺ｿ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌ｒ莉倅ｸ・
3. **逶｣譟ｻ繝ｭ繧ｰ**: Secret Manager縺ｮ繧｢繧ｯ繧ｻ繧ｹ繝ｭ繧ｰ繧貞ｮ壽悄逧・↓遒ｺ隱・
4. **迺ｰ蠅・・髮｢**: 髢狗匱縲√せ繝・・繧ｸ繝ｳ繧ｰ縲∵悽逡ｪ迺ｰ蠅・〒逡ｰ縺ｪ繧九す繝ｼ繧ｯ繝ｬ繝・ヨ繧剃ｽｿ逕ｨ



