# 迴ｾ蝨ｨ縺ｮ繝・・繝ｭ繧､迥ｶ諷・

## 蝠城｡後・蛻・梵邨先棡

繝ｦ繝ｼ繧ｶ繝ｼ縺ｮ蛻・梵縺ｫ繧医ｊ縲∽ｻ･荳九・蝠城｡後′迚ｹ螳壹＆繧後∪縺励◆・・

### 荳ｻ縺ｪ蝠城｡・

1. **蜿､縺Гontainer Registry (GCR) 縺ｮ蜿ら・**
   - `asia.gcr.io/singular-server-480006-s8/app-engine-tmp/...` 縺ｨ縺・≧蜿､縺・ｽ｢蠑上ｒ菴ｿ逕ｨ
   - Artifact Registry (`asia-northeast1-docker.pkg.dev`) 縺ｧ縺ｯ縺ｪ縺上∝ｻ・ｭ｢莠亥ｮ壹・GCR縺ｫ繧｢繧ｯ繧ｻ繧ｹ縺励ｈ縺・→縺励※縺・ｋ

2. **App Engine縺ｮ閾ｪ蜍輔ン繝ｫ繝芽ｨｭ螳・*
   - `gcloud app deploy` 繧ｳ繝槭Φ繝峨′蜿､縺ЖCR繧剃ｽｿ逕ｨ縺吶ｋ險ｭ螳壹↓縺ｪ縺｣縺ｦ縺・ｋ
   - Cloud Build繝医Μ繧ｬ繝ｼ縺ｨ縺ｯ蛻･縺ｮ莉慕ｵ・∩縺ｧ蜍穂ｽ懊＠縺ｦ縺・ｋ

3. **繝薙Ν繝臥腸蠅・・荳堺ｸ閾ｴ**
   - `serverless-runtimes/google-22-full/builder/nodejs` 縺ｯApp Engine Flexible Environment逕ｨ
   - 迴ｾ蝨ｨ縺ｯApp Engine Standard Environment繧剃ｽｿ逕ｨ縺励※縺・ｋ縺ｯ縺・

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

5. **Artifact Registry**
   - Artifact Registry API譛牙柑 笨・
   - `app-engine-tmp` 繝ｪ繝昴ず繝医Μ菴懈・貂医∩ 笨・

### 笞・・迴ｾ蝨ｨ縺ｮ蝠城｡・

1. **繝・・繝ｭ繧､縺ｮ螟ｱ謨・*
   - App Engine縺ｸ縺ｮ繝・・繝ｭ繧､縺悟､ｱ謨励＠縺ｦ縺・ｋ
   - 蜿､縺ЖCR縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ繧ｨ繝ｩ繝ｼ縺悟次蝗

2. **Cloud Build繝医Μ繧ｬ繝ｼ**
   - 蜿､縺・ヨ繝ｪ繧ｬ繝ｼ縺悟ｭ伜惠縺吶ｋ蜿ｯ閭ｽ諤ｧ
   - App Engine閾ｪ蜍輔ョ繝励Ο繧､險ｭ螳壹→縺ｮ遶ｶ蜷・

## 謗ｨ螂ｨ縺輔ｌ繧句ｯｾ蠢・

### 繧ｪ繝励す繝ｧ繝ｳ1: App Engine縺ｮ繝・・繝ｭ繧､險ｭ螳壹ｒ菫ｮ豁｣・育樟蝨ｨ縺ｮ繧｢繝励Ο繝ｼ繝√ｒ邯咏ｶ夲ｼ・

1. **蜿､縺ЖCR縺ｮ蜿ら・繧貞屓驕ｿ**
   - App Engine縺ｮ繝・・繝ｭ繧､險ｭ螳壹ｒ遒ｺ隱・
   - Artifact Registry繧剃ｽｿ逕ｨ縺吶ｋ繧医≧縺ｫ險ｭ螳・

2. **繝・・繝ｭ繧､譁ｹ豕輔・螟画峩**
   - `gcloud app deploy` 縺ｮ莉｣繧上ｊ縺ｫ縲∵・遉ｺ逧・↓Artifact Registry繧剃ｽｿ逕ｨ

### 繧ｪ繝励す繝ｧ繝ｳ2: Cloud Run縺ｫ蛻・ｊ譖ｿ縺茨ｼ域耳螂ｨ・・

1. **Cloud Run縺ｫ繝・・繝ｭ繧､**
   - 繧医ｊ譟碑ｻ溘↑險ｭ螳壹′蜿ｯ閭ｽ
   - Artifact Registry繧堤峩謗･菴ｿ逕ｨ
   - 蜿､縺ЖCR縺ｮ蝠城｡後ｒ蝗樣∩

2. **cloudbuild.yaml繧剃ｽｿ逕ｨ**
   - 譌｢縺ｫ貅門ｙ縺輔ｌ縺ｦ縺・ｋ險ｭ螳壹ｒ菴ｿ逕ｨ
   - Artifact Registry縺ｨCloud Run縺ｸ縺ｮ繝・・繝ｭ繧､

### 繧ｪ繝励す繝ｧ繝ｳ3: Cloud Build繝医Μ繧ｬ繝ｼ縺ｮ遒ｺ隱阪→菫ｮ豁｣

1. **蜿､縺・ヨ繝ｪ繧ｬ繝ｼ縺ｮ遒ｺ隱阪→辟｡蜉ｹ蛹・*
   - Cloud Build繝医Μ繧ｬ繝ｼ繧堤｢ｺ隱・
   - App Engine繧ЖCR繧貞盾辣ｧ縺励※縺・ｋ蜿､縺・ヨ繝ｪ繧ｬ繝ｼ繧堤┌蜉ｹ蛹・

2. **譁ｰ縺励＞繝医Μ繧ｬ繝ｼ縺ｮ菴懈・**
   - GitHub騾｣謳ｺ縺ｫ繧医ｋ譁ｰ縺励＞繝医Μ繧ｬ繝ｼ繧剃ｽ懈・
   - Artifact Registry縺ｨCloud Run繧剃ｽｿ逕ｨ

## 谺｡縺ｮ繧ｹ繝・ャ繝・

1. **Cloud Build繝医Μ繧ｬ繝ｼ繧堤｢ｺ隱・*
   - 蜿､縺・ヨ繝ｪ繧ｬ繝ｼ縺後↑縺・°遒ｺ隱・
   - 蠢・ｦ√↓蠢懊§縺ｦ辟｡蜉ｹ蛹・

2. **繝・・繝ｭ繧､譁ｹ豕輔ｒ豎ｺ螳・*
   - App Engine繧堤ｶ夊｡後☆繧九°
   - Cloud Run縺ｫ蛻・ｊ譖ｿ縺医ｋ縺・

3. **繝・・繝ｭ繧､繧貞・螳溯｡・*


