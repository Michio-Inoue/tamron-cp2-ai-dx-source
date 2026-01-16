# App Engine繝・・繝ｭ繧､蝠城｡後・隗｣豎ｺ譁ｹ豕・

## 蝠城｡後・蛻・梵

繝ｦ繝ｼ繧ｶ繝ｼ縺ｮ蛻・梵縺ｫ繧医ｋ縺ｨ・・
- App Engine縺悟商縺Гontainer Registry (GCR) 蠖｢蠑擾ｼ・asia.gcr.io`・峨ｒ蜿ら・縺励※縺・ｋ
- 縺薙ｌ縺ｯ蟒・ｭ｢莠亥ｮ壹・蠖｢蠑上〒縲∫樟蝨ｨ縺ｯArtifact Registry繧剃ｽｿ逕ｨ縺吶ｋ蠢・ｦ√′縺ゅｋ
- 繧ｨ繝ｩ繝ｼ縺ｯ繧ｭ繝｣繝・す繝･繧､繝｡繝ｼ繧ｸ縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ縺ｫ髢｢縺吶ｋ繧ゅ・

## 隗｣豎ｺ譁ｹ豕・

### 譁ｹ豕・: App Engine縺ｮ險ｭ螳壹ｒ譏守､ｺ逧・↓謖・ｮ・

`app.yaml` 縺ｫ譏守､ｺ逧・↑險ｭ螳壹ｒ霑ｽ蜉縺励※縲、rtifact Registry繧貞ｼｷ蛻ｶ・・

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'

# 繝薙Ν繝芽ｨｭ螳壹ｒ譏守､ｺ逧・↓謖・ｮ・
# 縺薙ｌ縺ｫ繧医ｊ縲∝商縺ЖCR蠖｢蠑上・蜿ら・繧貞屓驕ｿ縺ｧ縺阪ｋ蜿ｯ閭ｽ諤ｧ縺後≠繧翫∪縺・
```

### 譁ｹ豕・: 繧ｭ繝｣繝・す繝･繧堤┌蜉ｹ蛹悶＠縺ｦ繝・・繝ｭ繧､

繧ｭ繝｣繝・す繝･繧剃ｽｿ逕ｨ縺帙★縺ｫ繝・・繝ｭ繧､繧定ｩｦ陦鯉ｼ・

```powershell
gcloud app deploy app.yaml --project=singular-server-480006-s8 --no-promote --version=$(Get-Date -Format "yyyyMMddHHmmss")
```

### 譁ｹ豕・: Google Cloud Console縺ｧ險ｭ螳壹ｒ遒ｺ隱・

1. **App Engine險ｭ螳壹ｒ遒ｺ隱・*・・
   ```
   https://console.cloud.google.com/appengine/settings?project=singular-server-480006-s8
   ```

2. **Cloud Build險ｭ螳壹ｒ遒ｺ隱・*・・
   ```
   https://console.cloud.google.com/cloud-build/settings?project=singular-server-480006-s8
   ```

3. **蜿､縺・ｨｭ螳壹′縺ゅｌ縺ｰ蜑企勁縺ｾ縺溘・譖ｴ譁ｰ**

### 譁ｹ豕・: 譛蟆城剞縺ｮ繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｧ繝・せ繝・

縺ｾ縺壹∵怙蟆城剞縺ｮ繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｧ繝・・繝ｭ繧､繧定ｩｦ陦後＠縺ｦ縲∝撫鬘後ｒ迚ｹ螳夲ｼ・

1. 譁ｰ縺励＞`app.yaml`繧剃ｽ懈・・域怙蟆城剞縺ｮ險ｭ螳夲ｼ・
2. 邁｡蜊倥↑`server.js`縺ｧ繝・せ繝・
3. 謌仙粥縺励◆繧峨∵ｮｵ髫守噪縺ｫ讖溯・繧定ｿｽ蜉

## 謗ｨ螂ｨ縺輔ｌ繧区焔鬆・

1. **縺ｾ縺壹；oogle Cloud Console縺ｧ莉･荳九ｒ遒ｺ隱・*・・
   - App Engine險ｭ螳・
   - Cloud Build險ｭ螳・
   - 蜿､縺・ヨ繝ｪ繧ｬ繝ｼ繧・ｨｭ螳壹′縺ｪ縺・°

2. **繧ｭ繝｣繝・す繝･繧堤┌蜉ｹ蛹悶＠縺ｦ繝・・繝ｭ繧､繧定ｩｦ陦・*

3. **縺昴ｌ縺ｧ繧ょ､ｱ謨励☆繧句ｴ蜷医・縲，loud Run縺ｫ蛻・ｊ譖ｿ縺医ｒ讀懆ｨ・*

## 莉｣譖ｿ譯・ Cloud Run縺ｫ蛻・ｊ譖ｿ縺・

App Engine縺ｧ縺ｮ繝・・繝ｭ繧､縺檎ｶ壹￠縺ｦ螟ｱ謨励☆繧句ｴ蜷医・縲，loud Run縺ｫ蛻・ｊ譖ｿ縺医ｋ縺薙→繧呈､懆ｨ弱＠縺ｦ縺上□縺輔＞縲・loud Run縺ｯ・・
- 繧医ｊ譟碑ｻ溘↑險ｭ螳壹′蜿ｯ閭ｽ
- Docker繧ｳ繝ｳ繝・リ繝吶・繧ｹ縺ｧ縲√％縺ｮ蝠城｡後ｒ蝗樣∩縺ｧ縺阪ｋ
- 繧医ｊ隧ｳ邏ｰ縺ｪ繝ｭ繧ｰ縺ｨ繝・ヰ繝・げ縺悟庄閭ｽ

隧ｳ邏ｰ縺ｯ `CLOUD_RUN_DEPLOYMENT.md` 繧貞盾辣ｧ縺励※縺上□縺輔＞縲・

