# 繝・・繝ｭ繧､迥ｶ豕√∪縺ｨ繧・

## 迴ｾ蝨ｨ縺ｮ迥ｶ諷・

### 笨・螳御ｺ・＠縺ｦ縺・ｋ鬆・岼

1. **隱崎ｨｼ縺ｨ繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳・*
   - Google Cloud CLI隱崎ｨｼ螳御ｺ・笨・
   - 繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳壼ｮ御ｺ・笨・

2. **App Engine蛻晄悄蛹・*
   - App Engine蛻晄悄蛹門ｮ御ｺ・笨・
   - 繝・ヵ繧ｩ繝ｫ繝医し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝井ｽ懈・貂医∩ 笨・

3. **Secret Manager險ｭ螳・*
   - `gemini-api-key` 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ菴懈・貂医∩ 笨・
   - 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯蝉ｻ倅ｸ取ｸ医∩ 笨・

4. **讓ｩ髯占ｨｭ螳・*
   - Storage邂｡逅・・ｨｩ髯蝉ｻ倅ｸ取ｸ医∩ 笨・
   - Artifact Registry隱ｭ縺ｿ譖ｸ縺肴ｨｩ髯蝉ｻ倅ｸ取ｸ医∩ 笨・

### 笞・・迴ｾ蝨ｨ縺ｮ蝠城｡・

**Artifact Registry繝ｪ繝昴ず繝医Μ縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ繧ｨ繝ｩ繝ｼ**

繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ・・
```
Permission "artifactregistry.repositories.downloadArtifacts" denied on resource 
"projects/singular-server-480006-s8/locations/asia/repositories/asia.gcr.io" 
(or it may not exist)
```

## 隗｣豎ｺ譁ｹ豕・

### 譁ｹ豕・: Google Cloud Console縺ｧ繝薙Ν繝峨Ο繧ｰ繧堤｢ｺ隱搾ｼ域耳螂ｨ・・

莉･荳九・URL縺ｧ繝薙Ν繝峨Ο繧ｰ繧堤｢ｺ隱搾ｼ・
```
https://console.cloud.google.com/cloud-build/builds?project=singular-server-480006-s8
```

譛譁ｰ縺ｮ繝薙Ν繝峨ｒ繧ｯ繝ｪ繝・け縺励※縲∬ｩｳ邏ｰ縺ｪ繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ繧堤｢ｺ隱阪＠縺ｦ縺上□縺輔＞縲・

### 譁ｹ豕・: Artifact Registry API繧呈怏蜉ｹ蛹・

```powershell
gcloud services enable artifactregistry.googleapis.com --project=singular-server-480006-s8
```

### 譁ｹ豕・: 繝ｪ繝昴ず繝医Μ縺悟ｭ伜惠縺励↑縺・ｴ蜷・

繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ縺ｫ縲・or it may not exist)縲阪→縺ゅｋ縺ｮ縺ｧ縲√Μ繝昴ず繝医Μ縺悟ｭ伜惠縺励↑縺・庄閭ｽ諤ｧ縺後≠繧翫∪縺吶・

App Engine縺ｮ繝・・繝ｭ繧､譎ゅ↓閾ｪ蜍慕噪縺ｫ菴懈・縺輔ｌ繧九・縺壹〒縺吶′縲∵焔蜍輔〒菴懈・縺吶ｋ縺薙→繧ゅ〒縺阪∪縺呻ｼ・

```powershell
gcloud artifacts repositories create app-engine-tmp \
    --repository-format=docker \
    --location=asia \
    --project=singular-server-480006-s8
```

## 谺｡縺ｮ繧ｹ繝・ャ繝・

1. **Google Cloud Console縺ｧ繝薙Ν繝峨Ο繧ｰ繧堤｢ｺ隱・*
   - 繧医ｊ隧ｳ邏ｰ縺ｪ繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ繧堤｢ｺ隱・

2. **Artifact Registry API縺梧怏蜉ｹ縺狗｢ｺ隱・*
   - https://console.cloud.google.com/apis/library?project=singular-server-480006-s8
   - 縲窟rtifact Registry API縲阪ｒ讀懃ｴ｢縺励※譛牙柑蛹・

3. **蠢・ｦ√↓蠢懊§縺ｦ繝ｪ繝昴ず繝医Μ繧剃ｽ懈・**

4. **蜀榊ｺｦ繝・・繝ｭ繧､繧定ｩｦ陦・*

## 蜿り・ュ蝣ｱ

- 繝薙Ν繝峨Ο繧ｰURL: https://console.cloud.google.com/cloud-build/builds?project=singular-server-480006-s8
- App Engine繝繝・す繝･繝懊・繝・ https://console.cloud.google.com/appengine?project=singular-server-480006-s8


