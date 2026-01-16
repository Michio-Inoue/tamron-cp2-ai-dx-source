# 繝・・繝ｭ繧､迥ｶ諷九・遒ｺ隱肴婿豕・

## 迴ｾ蝨ｨ縺ｮ迥ｶ諷九ｒ遒ｺ隱阪☆繧区婿豕・

### 1. App Engine縺ｮ繝舌・繧ｸ繝ｧ繝ｳ遒ｺ隱・

```powershell
gcloud app versions list --project=singular-server-480006-s8
```

### 2. 繝・・繝ｭ繧､縺輔ｌ縺欟RL縺ｮ遒ｺ隱・

```powershell
gcloud app describe --project=singular-server-480006-s8
```

### 3. 繝薙Ν繝峨・迥ｶ諷狗｢ｺ隱・

```powershell
gcloud builds list --project=singular-server-480006-s8 --limit=5
```

### 4. 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ蜍穂ｽ懃｢ｺ隱・

繝悶Λ繧ｦ繧ｶ縺ｧ莉･荳九↓繧｢繧ｯ繧ｻ繧ｹ・・
```
https://singular-server-480006-s8.appspot.com
```

豁｣蟶ｸ縺ｫ蜍穂ｽ懊＠縺ｦ縺・ｌ縺ｰ縲∽ｻ･荳九′陦ｨ遉ｺ縺輔ｌ縺ｾ縺呻ｼ・
```json
{"message":"AI-DRBFM Analysis Server"}
```

### 5. 繝ｭ繧ｰ縺ｮ遒ｺ隱・

```powershell
gcloud app logs tail -s default --project=singular-server-480006-s8
```

## 繝・・繝ｭ繧､縺ｮ迥ｶ諷・

- **騾ｲ陦御ｸｭ**: 繝薙Ν繝峨→繝・・繝ｭ繧､縺悟ｮ溯｡御ｸｭ
- **謌仙粥**: 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺梧ｭ｣蟶ｸ縺ｫ繝・・繝ｭ繧､縺輔ｌ縲√い繧ｯ繧ｻ繧ｹ蜿ｯ閭ｽ
- **螟ｱ謨・*: 繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ縺瑚｡ｨ遉ｺ縺輔ｌ繧・

## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### 繝・・繝ｭ繧､縺悟､ｱ謨励＠縺溷ｴ蜷・

1. 繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ繧堤｢ｺ隱・
2. 繝薙Ν繝峨Ο繧ｰ繧堤｢ｺ隱搾ｼ・
   ```powershell
   gcloud builds log BUILD_ID --project=singular-server-480006-s8
   ```
3. 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ繝ｭ繧ｰ繧堤｢ｺ隱搾ｼ・
   ```powershell
   gcloud app logs tail -s default --project=singular-server-480006-s8
   ```

### 繧医￥縺ゅｋ繧ｨ繝ｩ繝ｼ

- **Secret Manager縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ繧ｨ繝ｩ繝ｼ**: 讓ｩ髯舌′豁｣縺励￥莉倅ｸ弱＆繧後※縺・ｋ縺狗｢ｺ隱・
- **萓晏ｭ倬未菫ゅ・繧ｨ繝ｩ繝ｼ**: `npm install` 繧貞・螳溯｡・
- **API縺梧怏蜉ｹ蛹悶＆繧後※縺・↑縺・*: 蠢・ｦ√↑API縺梧怏蜉ｹ縺ｫ縺ｪ縺｣縺ｦ縺・ｋ縺狗｢ｺ隱・


