# 蜍穂ｽ懃｢ｺ隱咲ｵ先棡縺ｨ蠢・ｦ√↑蟇ｾ蠢・

## 迴ｾ蝨ｨ縺ｮ迥ｶ豕・

笨・**Cloud Run繧ｵ繝ｼ繝薙せ縺ｯ豁｣蟶ｸ縺ｫ繝・・繝ｭ繧､縺輔ｌ縺ｦ縺・∪縺・*
- 繧ｵ繝ｼ繝薙せ蜷・ `ai-drbfm-backend`
- 繝ｪ繝ｼ繧ｸ繝ｧ繝ｳ: `asia-northeast1`
- URL: `https://ai-drbfm-backend-636nanwcsq-an.a.run.app`
- 繝ｪ繝薙ず繝ｧ繝ｳ: `ai-drbfm-backend-00003-km9`
- 繧ｹ繝・・繧ｿ繧ｹ: 豁｣蟶ｸ縺ｫ襍ｷ蜍穂ｸｭ・医Ο繧ｰ縺ｧ遒ｺ隱肴ｸ医∩・・

笞・・**譛ｪ隱崎ｨｼ繧｢繧ｯ繧ｻ繧ｹ縺ｮ險ｭ螳壹′螟ｱ謨励＠縺ｦ縺・∪縺・*
- 邨・ｹ斐・繝ｪ繧ｷ繝ｼ縺ｫ繧医ｊ縲～allUsers`縺ｸ縺ｮIAM繝昴Μ繧ｷ繝ｼ險ｭ螳壹′蛻ｶ髯舌＆繧後※縺・ｋ蜿ｯ閭ｽ諤ｧ縺後≠繧翫∪縺・
- 迴ｾ蝨ｨ縲√し繝ｼ繝薙せ縺ｯ隱崎ｨｼ縺悟ｿ・ｦ√↑迥ｶ諷九〒縺・

## 蠢・ｦ√↑蟇ｾ蠢・

### 繧ｪ繝励す繝ｧ繝ｳ1: Google Cloud Console縺九ｉIAM繝昴Μ繧ｷ繝ｼ繧定ｨｭ螳夲ｼ域耳螂ｨ・・

1. **Google Cloud Console縺ｫ繧｢繧ｯ繧ｻ繧ｹ**
   - URL: https://console.cloud.google.com/run/detail/asia-northeast1/ai-drbfm-backend?project=singular-server-480006-s8

2. **縲梧ｨｩ髯舌阪ち繝悶ｒ繧ｯ繝ｪ繝・け**

3. **縲後・繝ｪ繝ｳ繧ｷ繝代Ν繧定ｿｽ蜉縲阪ｒ繧ｯ繝ｪ繝・け**

4. **莉･荳九・險ｭ螳壹ｒ蜈･蜉・*
   - **繝励Μ繝ｳ繧ｷ繝代Ν**: `allUsers`
   - **繝ｭ繝ｼ繝ｫ**: `Cloud Run 襍ｷ蜍募・`

5. **縲御ｿ晏ｭ倥阪ｒ繧ｯ繝ｪ繝・け**

### 繧ｪ繝励す繝ｧ繝ｳ2: 隱崎ｨｼ繝医・繧ｯ繝ｳ繧剃ｽｿ逕ｨ縺励※繝・せ繝・

隱崎ｨｼ縺悟ｿ・ｦ√↑迥ｶ諷九〒繧ゅ∬ｪ崎ｨｼ繝医・繧ｯ繝ｳ繧剃ｽｿ逕ｨ縺励※API繧偵ユ繧ｹ繝医〒縺阪∪縺呻ｼ・

```powershell
# 隱崎ｨｼ繝医・繧ｯ繝ｳ繧貞叙蠕・
$token = gcloud auth print-identity-token

# API繧貞他縺ｳ蜃ｺ縺・
$headers = @{ Authorization = "Bearer $token" }
Invoke-WebRequest -Uri "https://ai-drbfm-backend-636nanwcsq-an.a.run.app/" -Method GET -Headers $headers
```

### 繧ｪ繝励す繝ｧ繝ｳ3: 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ菴ｿ逕ｨ

繝輔Ο繝ｳ繝医お繝ｳ繝峨°繧牙他縺ｳ蜃ｺ縺吝ｴ蜷医・縲√し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医・隱崎ｨｼ諠・ｱ繧剃ｽｿ逕ｨ縺吶ｋ縺薙→繧ゅ〒縺阪∪縺吶・

## 蜍穂ｽ懃｢ｺ隱肴ｸ医∩鬆・岼

笨・繧ｵ繝ｼ繝薙せ縺ｯ豁｣蟶ｸ縺ｫ襍ｷ蜍輔＠縺ｦ縺・ｋ・医Ο繧ｰ縺ｧ遒ｺ隱搾ｼ・
笨・Docker繧､繝｡繝ｼ繧ｸ縺ｯ豁｣蟶ｸ縺ｫ繝薙Ν繝峨＆繧後※縺・ｋ
笨・Artifact Registry縺ｸ縺ｮ繝励ャ繧ｷ繝･縺ｯ謌仙粥
笨・Cloud Run縺ｸ縺ｮ繝・・繝ｭ繧､縺ｯ謌仙粥
笨・Secret Manager縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌・險ｭ螳壽ｸ医∩

## 谺｡縺ｮ繧ｹ繝・ャ繝・

1. **IAM繝昴Μ繧ｷ繝ｼ繧定ｨｭ螳・*・井ｸ願ｨ倥・繧ｪ繝励す繝ｧ繝ｳ1繧呈耳螂ｨ・・
2. **API繧ｨ繝ｳ繝峨・繧､繝ｳ繝医・繝・せ繝・*
   - `GET /` - 繝倥Ν繧ｹ繝√ぉ繝・け
   - `POST /api/gemini` - Gemini API繝励Ο繧ｭ繧ｷ
3. **繝輔Ο繝ｳ繝医お繝ｳ繝峨・譖ｴ譁ｰ**
   - `ai-drbfm.js`繧呈峩譁ｰ縺励※縲，loud Run縺ｮ繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI繧剃ｽｿ逕ｨ縺吶ｋ繧医≧縺ｫ螟画峩

## 蜿り・ュ蝣ｱ

- Cloud Run繧ｳ繝ｳ繧ｽ繝ｼ繝ｫ: https://console.cloud.google.com/run?project=singular-server-480006-s8
- IAM繝昴Μ繧ｷ繝ｼ縺ｮ險ｭ螳・ https://cloud.google.com/run/docs/securing/managing-access


