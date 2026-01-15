# Google Cloud Platform 縺ｸ縺ｮ繝・・繝ｭ繧､謇矩・

## 迴ｾ蝨ｨ縺ｮ迥ｶ諷・

笨・**貅門ｙ螳御ｺ・*
- 繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI (`/api/gemini`) 縺悟ｮ溯｣・ｸ医∩
- Secret Manager蟇ｾ蠢懈ｸ医∩
- App Engine險ｭ螳壹ヵ繧｡繧､繝ｫ (`app.yaml`) 貅門ｙ貂医∩
- 繝・・繝ｭ繧､繝｡繝ｳ繝医ぎ繧､繝画ｺ門ｙ貂医∩

笞・・**豕ｨ諢丈ｺ矩・*
- 繝輔Ο繝ｳ繝医お繝ｳ繝峨・迴ｾ蝨ｨ縲∫峩謗･Gemini API繧貞他縺ｳ蜃ｺ縺励※縺・∪縺・
- 譛ｬ逡ｪ迺ｰ蠅・〒縺ｯ縲√ヵ繝ｭ繝ｳ繝医お繝ｳ繝峨ｒ繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI邨檎罰縺ｧ蜻ｼ縺ｳ蜃ｺ縺吶ｈ縺・↓螟画峩縺吶ｋ縺薙→繧呈耳螂ｨ縺励∪縺・

## 繝・・繝ｭ繧､謇矩・

### 1. Google Cloud 繝励Ο繧ｸ繧ｧ繧ｯ繝医・貅門ｙ

```bash
# Google Cloud CLI縺ｧ繝ｭ繧ｰ繧､繝ｳ
gcloud auth login

# 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳夲ｼ・OUR_PROJECT_ID繧貞ｮ滄圀縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｫ鄂ｮ縺肴鋤縺茨ｼ・
gcloud config set project YOUR_PROJECT_ID

# 蠢・ｦ√↑API繧呈怏蜉ｹ蛹・
gcloud services enable secretmanager.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ・

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

### 3. 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・

```bash
# App Engine縺ｮ繝・ヵ繧ｩ繝ｫ繝医し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・
PROJECT_ID=$(gcloud config get-value project)
SERVICE_ACCOUNT="${PROJECT_ID}@appspot.gserviceaccount.com"

gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

### 4. 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨ｒApp Engine縺ｫ繝・・繝ｭ繧､

```bash
cd backend

# 萓晏ｭ倬未菫ゅｒ繧､繝ｳ繧ｹ繝医・繝ｫ
npm install

# App Engine縺ｫ繝・・繝ｭ繧､
gcloud app deploy app.yaml
```

繝・・繝ｭ繧､縺悟ｮ御ｺ・☆繧九→縲√ヰ繝・け繧ｨ繝ｳ繝陰PI縺ｮURL縺瑚｡ｨ遉ｺ縺輔ｌ縺ｾ縺呻ｼ井ｾ・ `https://YOUR_PROJECT_ID.appspot.com`・・

### 5. 繝輔Ο繝ｳ繝医お繝ｳ繝峨・繝・・繝ｭ繧､・医が繝励す繝ｧ繝ｳ・・

#### 譁ｹ豕・: App Engine縺ｧ髱咏噪繝輔ぃ繧､繝ｫ繧偵・繧ｹ繝・ぅ繝ｳ繧ｰ

`app.yaml`縺ｫ髱咏噪繝輔ぃ繧､繝ｫ縺ｮ險ｭ螳壹ｒ霑ｽ蜉・・

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'

# 髱咏噪繝輔ぃ繧､繝ｫ縺ｮ險ｭ螳壹ｒ霑ｽ蜉
handlers:
  - url: /(.*\.(html|js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))
    static_files: \1
    upload: (.*\.(html|js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))
    secure: always

  - url: /.*
    script: auto
```

縺昴・蠕後√ヵ繝ｭ繝ｳ繝医お繝ｳ繝峨ヵ繧｡繧､繝ｫ繧蛋backend/public`繝・ぅ繝ｬ繧ｯ繝医Μ縺ｫ驟咲ｽｮ縺励※繝・・繝ｭ繧､縲・

#### 譁ｹ豕・: Firebase Hosting繧剃ｽｿ逕ｨ・域耳螂ｨ・・

```bash
# Firebase CLI繧偵う繝ｳ繧ｹ繝医・繝ｫ
npm install -g firebase-tools

# Firebase縺ｫ繝ｭ繧ｰ繧､繝ｳ
firebase login

# Firebase繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ蛻晄悄蛹・
firebase init hosting

# 繝・・繝ｭ繧､
firebase deploy --only hosting
```

#### 譁ｹ豕・: Cloud Storage + Cloud CDN繧剃ｽｿ逕ｨ

```bash
# 繝舌こ繝・ヨ繧剃ｽ懈・
gsutil mb -p YOUR_PROJECT_ID -c STANDARD -l asia-northeast1 gs://YOUR_BUCKET_NAME

# 繝輔Ο繝ｳ繝医お繝ｳ繝峨ヵ繧｡繧､繝ｫ繧偵い繝・・繝ｭ繝ｼ繝・
gsutil -m cp -r *.html *.js *.css gs://YOUR_BUCKET_NAME/

# 繝舌こ繝・ヨ繧貞・髢・
gsutil iam ch allUsers:objectViewer gs://YOUR_BUCKET_NAME

# Cloud CDN繧呈怏蜉ｹ蛹厄ｼ医が繝励す繝ｧ繝ｳ・・
```

### 6. 繝輔Ο繝ｳ繝医お繝ｳ繝峨ｒ繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI邨檎罰縺ｧ蜻ｼ縺ｳ蜃ｺ縺吶ｈ縺・↓螟画峩・域耳螂ｨ・・

迴ｾ蝨ｨ縲√ヵ繝ｭ繝ｳ繝医お繝ｳ繝峨・逶ｴ謗･Gemini API繧貞他縺ｳ蜃ｺ縺励※縺・∪縺吶′縲√そ繧ｭ繝･繝ｪ繝・ぅ縺ｮ縺溘ａ縲√ヰ繝・け繧ｨ繝ｳ繝陰PI邨檎罰縺ｧ蜻ｼ縺ｳ蜃ｺ縺吶ｈ縺・↓螟画峩縺吶ｋ縺薙→繧呈耳螂ｨ縺励∪縺吶・

`ai-drbfm.js`縺ｮAPI蜻ｼ縺ｳ蜃ｺ縺鈴Κ蛻・ｒ莉･荳九・繧医≧縺ｫ螟画峩・・

```javascript
// 螟画峩蜑・
const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
    { ... }
);

// 螟画峩蠕・
const BACKEND_URL = 'https://YOUR_PROJECT_ID.appspot.com'; // 縺ｾ縺溘・繝舌ャ繧ｯ繧ｨ繝ｳ繝峨・URL
const response = await fetch(`${BACKEND_URL}/api/gemini`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        prompt: prompt,
        model: 'gemini-2.5-flash',
        apiVersion: 'v1beta',
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096
    })
});
```

## 繝・・繝ｭ繧､蠕後・遒ｺ隱・

1. 繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI縺悟虚菴懊＠縺ｦ縺・ｋ縺狗｢ｺ隱搾ｼ・
   ```bash
   curl https://YOUR_PROJECT_ID.appspot.com/
   ```

2. 繝輔Ο繝ｳ繝医お繝ｳ繝峨↓繧｢繧ｯ繧ｻ繧ｹ縺励※蜍穂ｽ懃｢ｺ隱・

3. 繝悶Λ繧ｦ繧ｶ縺ｮ髢狗匱閠・ヤ繝ｼ繝ｫ縺ｧ繧ｨ繝ｩ繝ｼ縺後↑縺・°遒ｺ隱・

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

### CORS繧ｨ繝ｩ繝ｼ縺檎匱逕溘☆繧・

繝舌ャ繧ｯ繧ｨ繝ｳ繝峨・CORS險ｭ螳壹ｒ遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲Ａbackend/server.js`縺ｧCORS縺梧怏蜉ｹ縺ｫ縺ｪ縺｣縺ｦ縺・ｋ縺薙→繧堤｢ｺ隱阪・

### 繝・・繝ｭ繧､縺悟､ｱ謨励☆繧・

1. 繝ｭ繧ｰ繧堤｢ｺ隱搾ｼ・
   ```bash
   gcloud app logs tail -s default
   ```

2. 繝薙Ν繝峨Ο繧ｰ繧堤｢ｺ隱搾ｼ・
   ```bash
   gcloud builds list
   ```

## 谺｡縺ｮ繧ｹ繝・ャ繝・

1. 繝輔Ο繝ｳ繝医お繝ｳ繝峨ｒ繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI邨檎罰縺ｧ蜻ｼ縺ｳ蜃ｺ縺吶ｈ縺・↓螟画峩
2. 繧ｫ繧ｹ繧ｿ繝繝峨Γ繧､繝ｳ縺ｮ險ｭ螳夲ｼ医が繝励す繝ｧ繝ｳ・・
3. SSL險ｼ譏取嶌縺ｮ險ｭ螳夲ｼ郁・蜍慕噪縺ｫ險ｭ螳壹＆繧後∪縺呻ｼ・
4. 繝｢繝九ち繝ｪ繝ｳ繧ｰ縺ｨ繧｢繝ｩ繝ｼ繝医・險ｭ螳・


