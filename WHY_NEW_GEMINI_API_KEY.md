# 縺ｪ縺懈眠縺励＞Gemini API繧ｭ繝ｼ縺悟ｿ・ｦ√↑縺ｮ縺・

## 迴ｾ蝨ｨ縺ｮ迥ｶ豕・

### 繧ｨ繝ｩ繝ｼ
```
API key not valid. Please pass a valid API key.
```

### 蜴溷屏

Secret Manager縺ｫ菫晏ｭ倥＆繧後※縺・ｋGemini API繧ｭ繝ｼ・・a6a925178e7669bd8305d58899a3c4d0330dabf0`・峨′**辟｡蜉ｹ**縺ｫ縺ｪ縺｣縺ｦ縺・∪縺吶・

## 縺ｪ縺懃┌蜉ｹ縺ｫ縺ｪ縺｣縺溘・縺・

### 1. API繧ｭ繝ｼ縺梧ｼ乗ｴｩ縺励◆蜿ｯ閭ｽ諤ｧ

莉･蜑阪・繧ｨ繝ｩ繝ｼ繝ｭ繧ｰ縺ｫ莉･荳九・繝｡繝・そ繝ｼ繧ｸ縺後≠繧翫∪縺励◆・・
```
Your API key was reported as leaked. Please use another API key.
```

縺薙ｌ縺ｯ縲、PI繧ｭ繝ｼ縺悟・髢九Μ繝昴ず繝医Μ繧・さ繝ｼ繝峨↓蜷ｫ縺ｾ繧後※縺・◆蜿ｯ閭ｽ諤ｧ縺後≠繧翫；oogle縺後そ繧ｭ繝･繝ｪ繝・ぅ荳翫・逅・罰縺ｧ辟｡蜉ｹ蛹悶＠縺溘％縺ｨ繧堤､ｺ縺励※縺・∪縺吶・

### 2. 迴ｾ蝨ｨ縺ｮ螳溯｣・

迴ｾ蝨ｨ縺ｮ螳溯｣・〒縺ｯ・・

1. **繝輔Ο繝ｳ繝医お繝ｳ繝・* 竊・繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI繧貞他縺ｳ蜃ｺ縺呻ｼ・PI繧ｭ繝ｼ隱崎ｨｼ繧剃ｽｿ逕ｨ・・
2. **繝舌ャ繧ｯ繧ｨ繝ｳ繝・* 竊・Secret Manager縺九ｉGemini API繧ｭ繝ｼ繧貞叙蠕・
3. **繝舌ャ繧ｯ繧ｨ繝ｳ繝・* 竊・Gemini API繧貞他縺ｳ蜃ｺ縺・

縺､縺ｾ繧翫・*繝舌ャ繧ｯ繧ｨ繝ｳ繝峨′Secret Manager縺九ｉ蜿門ｾ励＠縺檬emini API繧ｭ繝ｼ繧剃ｽｿ逕ｨ**縺励※縺・∪縺吶・

### 3. 蝠城｡檎せ

Secret Manager縺ｫ菫晏ｭ倥＆繧後※縺・ｋGemini API繧ｭ繝ｼ縺檎┌蜉ｹ縺ｪ縺溘ａ縲√ヰ繝・け繧ｨ繝ｳ繝峨′Gemini API繧貞他縺ｳ蜃ｺ縺吶％縺ｨ縺後〒縺阪∪縺帙ｓ縲・

## 隗｣豎ｺ譁ｹ豕・

### 繧ｪ繝励す繝ｧ繝ｳ1: 譁ｰ縺励＞Gemini API繧ｭ繝ｼ繧貞叙蠕励＠縺ｦSecret Manager縺ｫ霑ｽ蜉・域耳螂ｨ・・

1. **Google AI Studio縺ｧ譁ｰ縺励＞API繧ｭ繝ｼ繧剃ｽ懈・**
   - https://aistudio.google.com/apikey

2. **Secret Manager縺ｫ霑ｽ蜉**
   ```powershell
   echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
   ```

### 繧ｪ繝励す繝ｧ繝ｳ2: 譌｢蟄倥・API繧ｭ繝ｼ繧剃ｽｿ逕ｨ・・ai-drbfm.html`縺ｫ險ｭ螳壹＆繧後※縺・ｋ繧ゅ・・・

`ai-drbfm.html`縺ｫ縺ｯ蛻･縺ｮGemini API繧ｭ繝ｼ・・[REDACTED]`・峨′險ｭ螳壹＆繧後※縺・∪縺吶・

縺薙・繧ｭ繝ｼ縺梧怏蜉ｹ縺ｧ縺ゅｌ縺ｰ縲ヾecret Manager縺ｫ霑ｽ蜉縺ｧ縺阪∪縺呻ｼ・

```powershell
echo "[REDACTED]" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

## 縺ｾ縺ｨ繧・

- **迴ｾ蝨ｨ縺ｮSecret Manager縺ｮGemini API繧ｭ繝ｼ**: 辟｡蜉ｹ
- **逅・罰**: 繧ｻ繧ｭ繝･繝ｪ繝・ぅ荳翫・逅・罰縺ｧ辟｡蜉ｹ蛹悶＆繧後◆蜿ｯ閭ｽ諤ｧ
- **隗｣豎ｺ**: 譁ｰ縺励＞譛牙柑縺ｪAPI繧ｭ繝ｼ繧担ecret Manager縺ｫ霑ｽ蜉縺吶ｋ蠢・ｦ√′縺ゅｋ

譁ｰ縺励＞API繧ｭ繝ｼ繧定ｿｽ蜉縺吶ｌ縺ｰ縲√ヰ繝・け繧ｨ繝ｳ繝峨′閾ｪ蜍慕噪縺ｫ譛譁ｰ繝舌・繧ｸ繝ｧ繝ｳ繧剃ｽｿ逕ｨ縺励∪縺吶・
