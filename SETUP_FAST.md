# 鬮倬溘そ繝・ヨ繧｢繝・・譁ｹ豕・

## 蝠城｡後・蜴溷屏

繧ｳ繝槭Φ繝峨′驕・＞/繧ｭ繝｣繝ｳ繧ｻ繝ｫ縺輔ｌ繧狗炊逕ｱ・・
1. **隱崎ｨｼ縺悟ｿ・ｦ・* - 蟇ｾ隧ｱ逧・↑謫堺ｽ懊′蠢・ｦ√↑蝣ｴ蜷医∬・蜍募ｮ溯｡後〒縺阪∪縺帙ｓ
2. **繝阪ャ繝医Ρ繝ｼ繧ｯ驕・ｻｶ** - Google Cloud API縺ｸ縺ｮ謗･邯壹′驕・＞蜿ｯ閭ｽ諤ｧ
3. **讓ｩ髯千｢ｺ隱・* - 繝励Ο繧ｸ繧ｧ繧ｯ繝医∈縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌・遒ｺ隱阪↓譎る俣縺後°縺九ｋ

## 隗｣豎ｺ遲厄ｼ哦oogle Cloud Console繧剃ｽｿ逕ｨ・域怙繧る溘＞譁ｹ豕包ｼ・

繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺ｧ縺ｯ縺ｪ縺上・*Google Cloud Console・・eb UI・・*繧剃ｽｿ逕ｨ縺吶ｋ縺ｨ縲√ｈ繧企溘￥遒ｺ螳溘↓險ｭ螳壹〒縺阪∪縺吶・

### 繧ｹ繝・ャ繝・: Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ・

1. 繝悶Λ繧ｦ繧ｶ縺ｧ莉･荳九↓繧｢繧ｯ繧ｻ繧ｹ・・
   ```
   https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8
   ```

2. 縲後す繝ｼ繧ｯ繝ｬ繝・ヨ繧剃ｽ懈・縲阪ｒ繧ｯ繝ｪ繝・け

3. 莉･荳九・諠・ｱ繧貞・蜉幢ｼ・
   - **蜷榊燕**: `gemini-api-key`
   - **繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺ｮ蛟､**: `[REDACTED]`
   - **繝ｪ繝ｼ繧ｸ繝ｧ繝ｳ**: `閾ｪ蜍描

4. 縲御ｽ懈・縲阪ｒ繧ｯ繝ｪ繝・け・域焚遘偵〒螳御ｺ・ｼ・

### 繧ｹ繝・ャ繝・: 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・

1. 菴懈・縺励◆繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ `gemini-api-key` 繧偵け繝ｪ繝・け

2. 縲梧ｨｩ髯舌阪ち繝悶ｒ繧ｯ繝ｪ繝・け

3. 縲後・繝ｪ繝ｳ繧ｷ繝代Ν繧定ｿｽ蜉縲阪ｒ繧ｯ繝ｪ繝・け

4. 莉･荳九ｒ蜈･蜉幢ｼ・
   - **譁ｰ縺励＞繝励Μ繝ｳ繧ｷ繝代Ν**: `singular-server-480006-s8@appspot.gserviceaccount.com`
   - **繝ｭ繝ｼ繝ｫ**: `Secret Manager 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ 繧｢繧ｯ繧ｻ繧ｵ繝ｼ`

5. 縲御ｿ晏ｭ倥阪ｒ繧ｯ繝ｪ繝・け

### 繧ｹ繝・ャ繝・: 蠢・ｦ√↑API繧呈怏蜉ｹ蛹・

1. 莉･荳九↓繧｢繧ｯ繧ｻ繧ｹ・・
   ```
   https://console.cloud.google.com/apis/library?project=singular-server-480006-s8
   ```

2. 莉･荳九・API繧呈､懃ｴ｢縺励※譛牙柑蛹厄ｼ亥推API縺ｧ縲梧怏蜉ｹ縺ｫ縺吶ｋ縲阪ｒ繧ｯ繝ｪ繝・け・会ｼ・
   - `Secret Manager API`
   - `App Engine Admin API`
   - `Cloud Build API`

### 繧ｹ繝・ャ繝・: 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨ｒ繝・・繝ｭ繧､・医さ繝槭Φ繝峨Λ繧､繝ｳ・・

API縺梧怏蜉ｹ蛹悶＆繧後◆繧峨∽ｻ･荳九・繧ｳ繝槭Φ繝峨ｒ螳溯｡鯉ｼ・

```bash
cd backend
npm install
gcloud app deploy app.yaml
```

## 繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺ｧ螳溯｡後☆繧句ｴ蜷茨ｼ亥ｯｾ隧ｱ縺悟ｿ・ｦ・ｼ・

繧ゅ＠繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺ｧ螳溯｡後☆繧句ｴ蜷医・縲・*荳蠎ｦ縺ｫ1縺､縺壹▽**螳溯｡後＠縺ｦ縺上□縺輔＞・・

```bash
# 1. 繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳夲ｼ域焚遘抵ｼ・
gcloud config set project singular-server-480006-s8

# 2. API譛牙柑蛹厄ｼ亥推API縺ｧ30遘偵・蛻・ｨ句ｺｦ・・
gcloud services enable secretmanager.googleapis.com --project=singular-server-480006-s8
gcloud services enable appengine.googleapis.com --project=singular-server-480006-s8
gcloud services enable cloudbuild.googleapis.com --project=singular-server-480006-s8

# 3. Secret Manager・域焚遘抵ｼ・
echo "[REDACTED]" | gcloud secrets create gemini-api-key --data-file=- --replication-policy="automatic" --project=singular-server-480006-s8

# 4. 讓ｩ髯蝉ｻ倅ｸ趣ｼ域焚遘抵ｼ・
gcloud secrets add-iam-policy-binding gemini-api-key --member="serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=singular-server-480006-s8
```

## 謗ｨ螂ｨ譁ｹ豕・

**Google Cloud Console・・eb UI・峨ｒ菴ｿ逕ｨ縺吶ｋ縺薙→繧貞ｼｷ縺乗耳螂ｨ縺励∪縺吶・*
- 繧医ｊ騾溘＞・域焚遘偵〒螳御ｺ・ｼ・
- 隕冶ｦ夂噪縺ｫ遒ｺ隱阪〒縺阪ｋ
- 繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ縺悟・縺九ｊ繧・☆縺・
- 蟇ｾ隧ｱ逧・↑謫堺ｽ懊′荳崎ｦ・


