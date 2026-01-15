# 迴ｾ蝨ｨ縺ｮ迥ｶ諷九∪縺ｨ繧・

## 笨・螳御ｺ・＠縺ｦ縺・ｋ鬆・岼

1. **隱崎ｨｼ**
   - Google Cloud CLI隱崎ｨｼ螳御ｺ・ｼ・inoue@tamron-compo2.com`・俄恣

2. **繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳・*
   - 繝励Ο繧ｸ繧ｧ繧ｯ繝・D: `singular-server-480006-s8` 笨・

3. **App Engine**
   - App Engine蛻晄悄蛹門ｮ御ｺ・笨・
   - 繝・ヵ繧ｩ繝ｫ繝医し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝井ｽ懈・貂医∩ 笨・
   - 繝帙せ繝亥錐: `singular-server-480006-s8.an.r.appspot.com` 笨・

4. **Secret Manager**
   - `gemini-api-key` 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ菴懈・貂医∩・域Φ螳夲ｼ俄恣
   - 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯蝉ｻ倅ｸ取ｸ医∩ 笨・

5. **繝舌ャ繧ｯ繧ｨ繝ｳ繝画ｺ門ｙ**
   - `backend/package.json` 蟄伜惠 笨・
   - `backend/node_modules` 蟄伜惠 笨・
   - `backend/app.yaml` 險ｭ螳壹ヵ繧｡繧､繝ｫ貅門ｙ貂医∩ 笨・

## 売 騾ｲ陦御ｸｭ縺ｾ縺溘・遒ｺ隱阪′蠢・ｦ√↑鬆・岼

1. **繝・・繝ｭ繧､迥ｶ諷・*
   - 繝・・繝ｭ繧､縺悟ｮ御ｺ・＠縺溘°遒ｺ隱阪′蠢・ｦ・
   - URL: `https://singular-server-480006-s8.an.r.appspot.com`

2. **API譛牙柑蛹・*
   - Secret Manager API: 遒ｺ隱阪′蠢・ｦ・
   - App Engine Admin API: 遒ｺ隱阪′蠢・ｦ・
   - Cloud Build API: 遒ｺ隱阪′蠢・ｦ・

## 搭 谺｡縺ｮ繧ｹ繝・ャ繝・

### 1. 繝・・繝ｭ繧､迥ｶ諷九・遒ｺ隱・

繝悶Λ繧ｦ繧ｶ縺ｧ莉･荳九↓繧｢繧ｯ繧ｻ繧ｹ・・
```
https://singular-server-480006-s8.an.r.appspot.com
```

豁｣蟶ｸ縺ｫ蜍穂ｽ懊＠縺ｦ縺・ｌ縺ｰ縲∽ｻ･荳九′陦ｨ遉ｺ縺輔ｌ縺ｾ縺呻ｼ・
```json
{"message":"AI-DRBFM Analysis Server"}
```

### 2. 繝・・繝ｭ繧､縺悟ｮ御ｺ・＠縺ｦ縺・↑縺・ｴ蜷・

PowerShell縺ｧ莉･荳九ｒ螳溯｡鯉ｼ・
```powershell
cd backend
gcloud app deploy app.yaml
```

### 3. 繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺溷ｴ蜷・

繝ｭ繧ｰ繧堤｢ｺ隱搾ｼ・
```powershell
gcloud app logs tail -s default --project=singular-server-480006-s8
```

## 剥 遒ｺ隱阪さ繝槭Φ繝・

### 繝・・繝ｭ繧､縺輔ｌ縺溘ヰ繝ｼ繧ｸ繝ｧ繝ｳ繧堤｢ｺ隱・
```powershell
gcloud app versions list --project=singular-server-480006-s8
```

### 繝薙Ν繝峨・迥ｶ諷九ｒ遒ｺ隱・
```powershell
gcloud builds list --project=singular-server-480006-s8 --limit=5
```

### 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ隧ｳ邏ｰ繧堤｢ｺ隱・
```powershell
gcloud app describe --project=singular-server-480006-s8
```

## 投 騾ｲ謐礼憾豕・

- **繧ｻ繝・ヨ繧｢繝・・**: 邏・0%螳御ｺ・
- **繝・・繝ｭ繧､**: 遒ｺ隱堺ｸｭ


