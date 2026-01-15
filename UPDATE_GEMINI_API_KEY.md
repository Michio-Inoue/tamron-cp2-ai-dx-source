# Gemini API繧ｭ繝ｼ縺ｮ譖ｴ譁ｰ謇矩・

## 迴ｾ蝨ｨ縺ｮ迥ｶ諷・

- **Secret Manager縺ｮGemini API繧ｭ繝ｼ**: `a6a925178e7669bd8305d58899a3c4d0330dabf0`・育┌蜉ｹ・・
- **繧ｨ繝ｩ繝ｼ**: `API key not valid. Please pass a valid API key.`

## 隗｣豎ｺ譁ｹ豕・

### 繧ｹ繝・ャ繝・: 譁ｰ縺励＞Gemini API繧ｭ繝ｼ繧貞叙蠕・

1. **Google AI Studio縺ｫ繧｢繧ｯ繧ｻ繧ｹ**
   ```
   https://aistudio.google.com/apikey
   ```

2. **譁ｰ縺励＞API繧ｭ繝ｼ繧剃ｽ懈・**
   - 縲靴reate API Key縲阪・繧ｿ繝ｳ繧偵け繝ｪ繝・け
   - 繝励Ο繧ｸ繧ｧ繧ｯ繝・`tamron-cloudrun-prod-new` 繧帝∈謚・
   - 譁ｰ縺励＞API繧ｭ繝ｼ繧偵さ繝斐・

### 繧ｹ繝・ャ繝・: Secret Manager縺ｫ譁ｰ縺励＞API繧ｭ繝ｼ繧定ｿｽ蜉

譁ｰ縺励＞API繧ｭ繝ｼ繧貞叙蠕励＠縺溘ｉ縲∽ｻ･荳九・繧ｳ繝槭Φ繝峨〒Secret Manager縺ｫ霑ｽ蜉縺励※縺上□縺輔＞・・

```powershell
# 譁ｰ縺励＞API繧ｭ繝ｼ繧担ecret Manager縺ｫ霑ｽ蜉
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

**萓具ｼ・*
```powershell
echo "[REDACTED]" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### 繧ｹ繝・ャ繝・: 遒ｺ隱・

譁ｰ縺励＞API繧ｭ繝ｼ繧定ｿｽ蜉縺励◆蠕後√ヰ繝・け繧ｨ繝ｳ繝峨・閾ｪ蜍慕噪縺ｫ譛譁ｰ繝舌・繧ｸ繝ｧ繝ｳ縺ｮAPI繧ｭ繝ｼ繧剃ｽｿ逕ｨ縺励∪縺吶・

Secret Manager縺ｯ`latest`繝舌・繧ｸ繝ｧ繝ｳ繧貞叙蠕励☆繧九◆繧√∵眠縺励＞繝舌・繧ｸ繝ｧ繝ｳ繧定ｿｽ蜉縺吶ｌ縺ｰ閾ｪ蜍慕噪縺ｫ菴ｿ逕ｨ縺輔ｌ縺ｾ縺吶・

### 繧ｹ繝・ャ繝・: 繝・せ繝・

繝輔Ο繝ｳ繝医お繝ｳ繝峨°繧牙・蠎ｦAPI繧貞他縺ｳ蜃ｺ縺励※縲∵ｭ｣蟶ｸ縺ｫ蜍穂ｽ懊☆繧九％縺ｨ繧堤｢ｺ隱阪＠縺ｦ縺上□縺輔＞縲・

## 豕ｨ諢丈ｺ矩・

- 蜿､縺БPI繧ｭ繝ｼ縺ｯ蜑企勁縺帙★縲∵眠縺励＞繝舌・繧ｸ繝ｧ繝ｳ縺ｨ縺励※霑ｽ蜉縺励※縺上□縺輔＞
- 縺薙ｌ縺ｫ繧医ｊ縲∝撫鬘後′逋ｺ逕溘＠縺溷ｴ蜷医↓繝ｭ繝ｼ繝ｫ繝舌ャ繧ｯ縺悟庄閭ｽ縺ｧ縺・
- 譁ｰ縺励＞API繧ｭ繝ｼ繧定ｿｽ蜉縺励◆蠕後∵焚遘貞ｾ・▲縺ｦ縺九ｉ繝・せ繝医＠縺ｦ縺上□縺輔＞・医く繝｣繝・す繝･縺ｮ縺溘ａ・・

## 迴ｾ蝨ｨ縺ｮ險ｭ螳・

- **繝舌ャ繧ｯ繧ｨ繝ｳ繝蔚RL**: `https://ai-drbfm-backend-43iql33sfa-an.a.run.app`
- **繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI繧ｭ繝ｼ**: `Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru`・域ｭ｣蟶ｸ・・
- **Gemini API繧ｭ繝ｼ**: 辟｡蜉ｹ・域峩譁ｰ縺悟ｿ・ｦ・ｼ・
