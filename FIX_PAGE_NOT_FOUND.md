# "Page not found" 繧ｨ繝ｩ繝ｼ縺ｮ隗｣豎ｺ譁ｹ豕・

## 蝠城｡後・蜴溷屏

縲訓age not found縲阪お繝ｩ繝ｼ縺檎匱逕溘☆繧倶ｸｻ縺ｪ蜴溷屏・・

1. **繝・・繝ｭ繧､縺悟ｮ御ｺ・＠縺ｦ縺・↑縺・*
   - 繝・・繝ｭ繧､縺碁比ｸｭ縺ｧ荳ｭ譁ｭ縺輔ｌ縺・
   - 繝・・繝ｭ繧､縺悟､ｱ謨励＠縺・

2. **繧ｵ繝ｼ繝薙せ縺悟ｭ伜惠縺励↑縺・*
   - App Engine繧ｵ繝ｼ繝薙せ縺梧ｭ｣縺励￥菴懈・縺輔ｌ縺ｦ縺・↑縺・

3. **繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺瑚ｵｷ蜍輔＠縺ｦ縺・↑縺・*
   - 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ襍ｷ蜍輔↓螟ｱ謨励＠縺ｦ縺・ｋ

## 隗｣豎ｺ譁ｹ豕・

### 譁ｹ豕・: 繝・・繝ｭ繧､繧貞・螳溯｡・

```powershell
cd backend
gcloud app deploy app.yaml --project=singular-server-480006-s8
```

繝・・繝ｭ繧､縺ｫ縺ｯ5縲・0蛻・°縺九ｊ縺ｾ縺吶・

### 譁ｹ豕・: 繝・・繝ｭ繧､迥ｶ諷九ｒ遒ｺ隱・

```powershell
# 繧ｵ繝ｼ繝薙せ荳隕ｧ繧堤｢ｺ隱・
gcloud app services list --project=singular-server-480006-s8

# 繝舌・繧ｸ繝ｧ繝ｳ荳隕ｧ繧堤｢ｺ隱・
gcloud app versions list --project=singular-server-480006-s8

# 繝薙Ν繝峨・迥ｶ諷九ｒ遒ｺ隱・
gcloud builds list --project=singular-server-480006-s8 --limit=5
```

### 譁ｹ豕・: 繝ｭ繧ｰ繧堤｢ｺ隱・

```powershell
# 譛譁ｰ縺ｮ繝ｭ繧ｰ繧堤｢ｺ隱・
gcloud app logs read -s default --project=singular-server-480006-s8 --limit=50
```

## 遒ｺ隱堺ｺ矩・

### 1. app.yaml縺ｮ險ｭ螳・

`backend/app.yaml` 縺梧ｭ｣縺励￥險ｭ螳壹＆繧後※縺・ｋ縺狗｢ｺ隱搾ｼ・

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'

service_account: default
```

### 2. package.json縺ｮ險ｭ螳・

`backend/package.json` 縺ｫ `start` 繧ｹ繧ｯ繝ｪ繝励ヨ縺後≠繧九°遒ｺ隱搾ｼ・

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 3. server.js縺ｮ險ｭ螳・

`backend/server.js` 縺梧ｭ｣縺励￥險ｭ螳壹＆繧後※縺・ｋ縺狗｢ｺ隱搾ｼ・

- `app.listen()` 縺梧ｭ｣縺励￥險ｭ螳壹＆繧後※縺・ｋ
- 繝ｫ繝ｼ繝医お繝ｳ繝峨・繧､繝ｳ繝茨ｼ・/`・峨′螳夂ｾｩ縺輔ｌ縺ｦ縺・ｋ

## 繝・・繝ｭ繧､蠕後・遒ｺ隱・

繝・・繝ｭ繧､縺悟ｮ御ｺ・＠縺溘ｉ・・

1. **繧ｵ繝ｼ繝薙せ荳隕ｧ繧堤｢ｺ隱・*・・
   ```powershell
   gcloud app services list --project=singular-server-480006-s8
   ```

2. **URL縺ｫ繧｢繧ｯ繧ｻ繧ｹ**・・
   ```
   https://singular-server-480006-s8.an.r.appspot.com
   ```

3. **豁｣蟶ｸ縺ｪ蠢懃ｭ斐ｒ遒ｺ隱・*・・
   ```json
   {"message":"AI-DRBFM Analysis Server"}
   ```

## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### 繝・・繝ｭ繧､縺悟､ｱ謨励☆繧句ｴ蜷・

1. **繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ繧堤｢ｺ隱・*
2. **繝薙Ν繝峨Ο繧ｰ繧堤｢ｺ隱・*・・
   ```powershell
   gcloud builds list --project=singular-server-480006-s8 --limit=1
   gcloud builds log BUILD_ID --project=singular-server-480006-s8
   ```

### 繧医￥縺ゅｋ繧ｨ繝ｩ繝ｼ

- **Secret Manager縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ繧ｨ繝ｩ繝ｼ**: 讓ｩ髯舌′豁｣縺励￥莉倅ｸ弱＆繧後※縺・ｋ縺狗｢ｺ隱・
- **萓晏ｭ倬未菫ゅ・繧ｨ繝ｩ繝ｼ**: `npm install` 繧貞・螳溯｡・
- **繝昴・繝医・繧ｨ繝ｩ繝ｼ**: App Engine縺ｯ閾ｪ蜍慕噪縺ｫPORT迺ｰ蠅・､画焚繧定ｨｭ螳壹＠縺ｾ縺・


