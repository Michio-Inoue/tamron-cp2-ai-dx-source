# Google Cloud 繧ｻ繝・ヨ繧｢繝・・謇矩・

## 繝励Ο繧ｸ繧ｧ繧ｯ繝域ュ蝣ｱ
- **繝励Ο繧ｸ繧ｧ繧ｯ繝亥錐**: Tamron-cp2-AI-DX
- **繝励Ο繧ｸ繧ｧ繧ｯ繝・D**: `singular-server-480006-s8`

## 謇句虚繧ｻ繝・ヨ繧｢繝・・謇矩・

### 繧ｹ繝・ャ繝・: 蜀崎ｪ崎ｨｼ縺ｨ繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳・

PowerShell縺ｾ縺溘・繧ｳ繝槭Φ繝峨・繝ｭ繝ｳ繝励ヨ縺ｧ莉･荳九ｒ螳溯｡鯉ｼ・

```bash
# 1. 蜀崎ｪ崎ｨｼ・医ヶ繝ｩ繧ｦ繧ｶ縺碁幕縺阪∪縺呻ｼ・
gcloud auth login

# 2. 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳・
gcloud config set project singular-server-480006-s8

# 3. 險ｭ螳壹ｒ遒ｺ隱・
gcloud config get-value project
```

### 繧ｹ繝・ャ繝・: 蠢・ｦ√↑API繧呈怏蜉ｹ蛹・

```bash
gcloud services enable secretmanager.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 繧ｹ繝・ャ繝・: Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ・

```bash
# 譁ｹ豕・: 繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺九ｉ・域耳螂ｨ・・
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=- --replication-policy="automatic"

# 譁ｹ豕・: Google Cloud Console縺九ｉ
# 1. https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8 縺ｫ繧｢繧ｯ繧ｻ繧ｹ
# 2. 縲後す繝ｼ繧ｯ繝ｬ繝・ヨ繧剃ｽ懈・縲阪ｒ繧ｯ繝ｪ繝・け
# 3. 蜷榊燕: gemini-api-key
# 4. 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺ｮ蛟､: 縺ゅ↑縺溘・Gemini API繧ｭ繝ｼ繧貞・蜉・
# 5. 縲御ｽ懈・縲阪ｒ繧ｯ繝ｪ繝・け
```

**豕ｨ諢・*: `YOUR_GEMINI_API_KEY` 繧貞ｮ滄圀縺ｮAPI繧ｭ繝ｼ縺ｫ鄂ｮ縺肴鋤縺医※縺上□縺輔＞縲・

### 繧ｹ繝・ャ繝・: 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・

```bash
gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### 繧ｹ繝・ャ繝・: 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨ｒ繝・・繝ｭ繧､

```bash
cd backend
npm install
gcloud app deploy app.yaml
```

## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### 蜀崎ｪ崎ｨｼ縺悟ｿ・ｦ√↑蝣ｴ蜷・

```bash
# 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ繝・ヵ繧ｩ繝ｫ繝郁ｪ崎ｨｼ諠・ｱ繧定ｨｭ螳・
gcloud auth application-default login
```

### 繝励Ο繧ｸ繧ｧ繧ｯ繝医↓繧｢繧ｯ繧ｻ繧ｹ縺ｧ縺阪↑縺・ｴ蜷・

1. 繝励Ο繧ｸ繧ｧ繧ｯ繝医・謇譛芽・∪縺溘・邱ｨ髮・・ｨｩ髯舌′縺ゅｋ縺狗｢ｺ隱・
2. 豁｣縺励＞Google繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ・noue@tamron-compo2.com・峨〒繝ｭ繧ｰ繧､繝ｳ縺励※縺・ｋ縺狗｢ｺ隱・

### Secret Manager縺梧里縺ｫ蟄伜惠縺吶ｋ蝣ｴ蜷・

```bash
# 譌｢蟄倥・繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺ｫ譁ｰ縺励＞繝舌・繧ｸ繝ｧ繝ｳ繧定ｿｽ蜉
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
```

## 谺｡縺ｮ繧ｹ繝・ャ繝・

繝・・繝ｭ繧､縺悟ｮ御ｺ・＠縺溘ｉ・・
1. 繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI縺ｮURL繧堤｢ｺ隱搾ｼ井ｾ・ `https://singular-server-480006-s8.appspot.com`・・
2. 繝輔Ο繝ｳ繝医お繝ｳ繝峨ｒ繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI邨檎罰縺ｧ蜻ｼ縺ｳ蜃ｺ縺吶ｈ縺・↓螟画峩・医が繝励す繝ｧ繝ｳ・・
3. 蜍穂ｽ懃｢ｺ隱・


