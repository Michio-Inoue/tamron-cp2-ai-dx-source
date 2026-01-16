# Google Cloud Secret Manager繧剃ｽｿ逕ｨ縺励◆繝・・繝ｭ繧､繧ｬ繧､繝・

## 蜑肴署譚｡莉ｶ

1. Google Cloud Project縺御ｽ懈・縺輔ｌ縺ｦ縺・ｋ縺薙→
2. Secret Manager API縺梧怏蜉ｹ縺ｫ縺ｪ縺｣縺ｦ縺・ｋ縺薙→
3. Cloud Functions縺ｾ縺溘・App Engine縺ｮ繝・・繝ｭ繧､讓ｩ髯舌′縺ゅｋ縺薙→

## 謇矩・

### 1. Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ・

```bash
# Google Cloud CLI縺ｧ繝ｭ繧ｰ繧､繝ｳ
gcloud auth login

# 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳・
gcloud config set project YOUR_PROJECT_ID

# Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ・
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

### 2. Secret Manager縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌ｒ險ｭ螳・

Cloud Functions縺ｾ縺溘・App Engine縺ｮ繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓Secret Manager縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌ｒ莉倅ｸ趣ｼ・

```bash
# 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医・繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧貞叙蠕・
SERVICE_ACCOUNT=$(gcloud iam service-accounts list --filter="displayName:App Engine default service account" --format="value(email)")

# Secret Manager縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌ｒ莉倅ｸ・
gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

### 3. Cloud Functions縺ｫ繝・・繝ｭ繧､

```bash
cd backend

# 萓晏ｭ倬未菫ゅｒ繧､繝ｳ繧ｹ繝医・繝ｫ
npm install

# Cloud Functions縺ｫ繝・・繝ｭ繧､
gcloud functions deploy geminiProxy \
    --runtime nodejs20 \
    --trigger http \
    --allow-unauthenticated \
    --set-env-vars GEMINI_API_KEY_SECRET_NAME=gemini-api-key \
    --region asia-northeast1
```

### 4. App Engine縺ｫ繝・・繝ｭ繧､・医が繝励す繝ｧ繝ｳ・・

```bash
cd backend

# 萓晏ｭ倬未菫ゅｒ繧､繝ｳ繧ｹ繝医・繝ｫ
npm install

# App Engine縺ｫ繝・・繝ｭ繧､
gcloud app deploy app.yaml
```

### 5. 繝輔Ο繝ｳ繝医お繝ｳ繝峨さ繝ｼ繝峨・譖ｴ譁ｰ

`ai-drbfm.js`縺ｨ`license-management.js`繧呈峩譁ｰ縺励※縲√ヰ繝・け繧ｨ繝ｳ繝陰PI繧貞他縺ｳ蜃ｺ縺吶ｈ縺・↓螟画峩縺励∪縺吶・

## 迺ｰ蠅・､画焚縺ｮ險ｭ螳・

Cloud Functions縺ｾ縺溘・App Engine縺ｮ迺ｰ蠅・､画焚縺ｨ縺励※莉･荳九ｒ險ｭ螳夲ｼ・

- `GEMINI_API_KEY_SECRET_NAME`: Secret Manager縺ｮ繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ蜷搾ｼ医ョ繝輔か繝ｫ繝・ `gemini-api-key`・・
- `GOOGLE_CLOUD_PROJECT`: Google Cloud Project ID・郁・蜍戊ｨｭ螳壹＆繧後ｋ蝣ｴ蜷医≠繧奇ｼ・

## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### Secret Manager縺九ｉAPI繧ｭ繝ｼ縺悟叙蠕励〒縺阪↑縺・

1. 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓驕ｩ蛻・↑讓ｩ髯舌′縺ゅｋ縺狗｢ｺ隱・
2. 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ蜷阪′豁｣縺励＞縺狗｢ｺ隱・
3. 繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺梧ｭ｣縺励＞縺狗｢ｺ隱・

### CORS繧ｨ繝ｩ繝ｼ縺檎匱逕溘☆繧・

Cloud Functions縺ｾ縺溘・App Engine縺ｮCORS險ｭ螳壹ｒ遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・



