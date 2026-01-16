# 譁ｰ縺励＞Gemini API繧ｭ繝ｼ縺ｮ霑ｽ蜉謇矩・

## 迴ｾ蝨ｨ縺ｮ迥ｶ豕・

- 笶・Secret Manager縺ｮGemini API繧ｭ繝ｼ・医ヰ繝ｼ繧ｸ繝ｧ繝ｳ1・・ 辟｡蜉ｹ・域ｼ乗ｴｩ蝣ｱ蜻奇ｼ・
- 笶・Secret Manager縺ｮGemini API繧ｭ繝ｼ・医ヰ繝ｼ繧ｸ繝ｧ繝ｳ2・・ 辟｡蜉ｹ・域ｼ乗ｴｩ蝣ｱ蜻奇ｼ・
- 笨・繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI: 豁｣蟶ｸ縺ｫ蜍穂ｽ・
- 笨・隱崎ｨｼ繝溘ラ繝ｫ繧ｦ繧ｧ繧｢: 豁｣蟶ｸ縺ｫ蜍穂ｽ・

## 譁ｰ縺励＞Gemini API繧ｭ繝ｼ縺ｮ蜿門ｾ励→霑ｽ蜉

### 繧ｹ繝・ャ繝・: 譁ｰ縺励＞API繧ｭ繝ｼ繧貞叙蠕・

1. **Google AI Studio縺ｫ繧｢繧ｯ繧ｻ繧ｹ**
   ```
   https://aistudio.google.com/apikey
   ```

2. **譁ｰ縺励＞API繧ｭ繝ｼ繧剃ｽ懈・**
   - 縲靴reate API Key縲阪・繧ｿ繝ｳ繧偵け繝ｪ繝・け
   - 繝励Ο繧ｸ繧ｧ繧ｯ繝・`tamron-cloudrun-prod-new` 繧帝∈謚・
   - 譁ｰ縺励＞API繧ｭ繝ｼ繧偵さ繝斐・・・[REDACTED]...`縺ｧ蟋九∪繧区枚蟄怜・・・

### 繧ｹ繝・ャ繝・: Secret Manager縺ｫ霑ｽ蜉

譁ｰ縺励＞API繧ｭ繝ｼ繧貞叙蠕励＠縺溘ｉ縲∽ｻ･荳九・繧ｳ繝槭Φ繝峨〒Secret Manager縺ｫ霑ｽ蜉縺励※縺上□縺輔＞・・

```powershell
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

**萓具ｼ・*
```powershell
echo "[REDACTED]" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### 繧ｹ繝・ャ繝・: 遒ｺ隱・

霑ｽ蜉蠕後√ヰ繝ｼ繧ｸ繝ｧ繝ｳ縺御ｽ懈・縺輔ｌ縺溘％縺ｨ繧堤｢ｺ隱搾ｼ・

```powershell
gcloud secrets versions list gemini-api-key --project=tamron-cloudrun-prod-new
```

### 繧ｹ繝・ャ繝・: 繝・せ繝・

譁ｰ縺励＞API繧ｭ繝ｼ繧定ｿｽ蜉縺励◆蠕後∵焚遘貞ｾ・▲縺ｦ縺九ｉ繝輔Ο繝ｳ繝医お繝ｳ繝峨°繧陰PI繧貞他縺ｳ蜃ｺ縺励※繝・せ繝医＠縺ｦ縺上□縺輔＞縲・

## 豕ｨ諢丈ｺ矩・

- 譁ｰ縺励＞API繧ｭ繝ｼ縺ｯ縲∝・髢九Μ繝昴ず繝医Μ繧・さ繝ｼ繝峨↓蜷ｫ繧√↑縺・〒縺上□縺輔＞
- Secret Manager縺ｧ螳牙・縺ｫ邂｡逅・＠縺ｦ縺上□縺輔＞
- 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨↓縺ｯ5蛻・俣縺ｮ繧ｭ繝｣繝・す繝･縺後≠繧九◆繧√∝渚譏縺ｾ縺ｧ謨ｰ遘偵°縺九ｋ蝣ｴ蜷医′縺ゅｊ縺ｾ縺・

## 迴ｾ蝨ｨ縺ｮ險ｭ螳・

- **繝舌ャ繧ｯ繧ｨ繝ｳ繝蔚RL**: `https://ai-drbfm-backend-43iql33sfa-an.a.run.app`
- **繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI繧ｭ繝ｼ**: `Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru`・域ｭ｣蟶ｸ・・
- **Gemini API繧ｭ繝ｼ**: 譁ｰ縺励＞繧ｭ繝ｼ縺悟ｿ・ｦ・
