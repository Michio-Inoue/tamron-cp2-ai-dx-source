# Gemini API繧ｭ繝ｼ縺ｮ蝠城｡・

## 繧ｨ繝ｩ繝ｼ

```
Your API key was reported as leaked. Please use another API key.
```

## 蜴溷屏

`ai-drbfm.html`縺ｫ險ｭ螳壹＆繧後※縺・ｋGemini API繧ｭ繝ｼ・・[REDACTED]`・峨ｂ縲・*貍乗ｴｩ縺励◆縺ｨ蝣ｱ蜻翫＆繧後※辟｡蜉ｹ**縺ｫ縺ｪ縺｣縺ｦ縺・∪縺吶・

## 隗｣豎ｺ譁ｹ豕・

### 譁ｰ縺励＞Gemini API繧ｭ繝ｼ繧貞叙蠕励☆繧句ｿ・ｦ√′縺ゅｊ縺ｾ縺・

1. **Google AI Studio縺ｫ繧｢繧ｯ繧ｻ繧ｹ**
   - https://aistudio.google.com/apikey

2. **譁ｰ縺励＞API繧ｭ繝ｼ繧剃ｽ懈・**
   - 縲靴reate API Key縲阪ｒ繧ｯ繝ｪ繝・け
   - 繝励Ο繧ｸ繧ｧ繧ｯ繝・`tamron-cloudrun-prod-new` 繧帝∈謚・
   - 譁ｰ縺励＞API繧ｭ繝ｼ繧偵さ繝斐・

3. **Secret Manager縺ｫ霑ｽ蜉**
   ```powershell
   echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
   ```

## 豕ｨ諢丈ｺ矩・

- 譌｢蟄倥・API繧ｭ繝ｼ縺ｯ貍乗ｴｩ縺励◆縺ｨ蝣ｱ蜻翫＆繧後※縺・ｋ縺溘ａ縲∵眠縺励＞API繧ｭ繝ｼ縺悟ｿ・ｦ√〒縺・
- 譁ｰ縺励＞API繧ｭ繝ｼ縺ｯ縲∝・髢九Μ繝昴ず繝医Μ繧・さ繝ｼ繝峨↓蜷ｫ繧√↑縺・〒縺上□縺輔＞
- Secret Manager縺ｧ螳牙・縺ｫ邂｡逅・＠縺ｦ縺上□縺輔＞

## 迴ｾ蝨ｨ縺ｮ迥ｶ諷・

- 笶・**Secret Manager縺ｮGemini API繧ｭ繝ｼ・医ヰ繝ｼ繧ｸ繝ｧ繝ｳ1・・*: 辟｡蜉ｹ・域ｼ乗ｴｩ蝣ｱ蜻奇ｼ・
- 笶・**Secret Manager縺ｮGemini API繧ｭ繝ｼ・医ヰ繝ｼ繧ｸ繝ｧ繝ｳ2・・*: 辟｡蜉ｹ・域ｼ乗ｴｩ蝣ｱ蜻奇ｼ・
- 笨・**繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI**: 豁｣蟶ｸ縺ｫ蜍穂ｽ・
- 笨・**隱崎ｨｼ繝溘ラ繝ｫ繧ｦ繧ｧ繧｢**: 豁｣蟶ｸ縺ｫ蜍穂ｽ・

## 谺｡縺ｮ繧ｹ繝・ャ繝・

譁ｰ縺励＞Gemini API繧ｭ繝ｼ繧貞叙蠕励＠縺ｦ縲ヾecret Manager縺ｫ霑ｽ蜉縺励※縺上□縺輔＞縲・
