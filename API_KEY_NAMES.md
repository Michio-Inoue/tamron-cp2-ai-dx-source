# Secret Manager縺ｮAPI繧ｭ繝ｼ蜷・

## 迴ｾ蝨ｨ縺ｮAPI繧ｭ繝ｼ

Secret Manager縺ｫ菫晏ｭ倥＆繧後※縺・ｋAPI繧ｭ繝ｼ縺ｯ莉･荳九・2縺､縺ｧ縺呻ｼ・

### 1. Gemini API繧ｭ繝ｼ
- **繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ蜷・*: `gemini-api-key`
- **逕ｨ騾・*: Gemini API繧貞他縺ｳ蜃ｺ縺吶◆繧√↓菴ｿ逕ｨ
- **迴ｾ蝨ｨ縺ｮ迥ｶ諷・*: 辟｡蜉ｹ・域ｼ乗ｴｩ蝣ｱ蜻翫↓繧医ｊ辟｡蜉ｹ蛹厄ｼ・
- **繝舌・繧ｸ繝ｧ繝ｳ**: 2・井ｸ｡譁ｹ縺ｨ繧ら┌蜉ｹ・・

### 2. 繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI繧ｭ繝ｼ
- **繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ蜷・*: `backend-api-key`
- **逕ｨ騾・*: 繝輔Ο繝ｳ繝医お繝ｳ繝峨°繧峨ヰ繝・け繧ｨ繝ｳ繝陰PI縺ｫ繧｢繧ｯ繧ｻ繧ｹ縺吶ｋ髫帙・隱崎ｨｼ縺ｫ菴ｿ逕ｨ
- **迴ｾ蝨ｨ縺ｮ迥ｶ諷・*: 豁｣蟶ｸ
- **蛟､**: `Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru`

## 譁ｰ縺励＞Gemini API繧ｭ繝ｼ繧定ｿｽ蜉縺吶ｋ蝣ｴ蜷・

譁ｰ縺励＞Gemini API繧ｭ繝ｼ繧貞叙蠕励＠縺溘ｉ縲∽ｻ･荳九・繧ｳ繝槭Φ繝峨〒`gemini-api-key`縺ｫ霑ｽ蜉縺励※縺上□縺輔＞・・

```powershell
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

## 遒ｺ隱肴婿豕・

迴ｾ蝨ｨ縺ｮ繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ荳隕ｧ繧堤｢ｺ隱搾ｼ・

```powershell
gcloud secrets list --project=tamron-cloudrun-prod-new
```

迚ｹ螳壹・繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺ｮ繝舌・繧ｸ繝ｧ繝ｳ繧堤｢ｺ隱搾ｼ・

```powershell
gcloud secrets versions list gemini-api-key --project=tamron-cloudrun-prod-new
gcloud secrets versions list backend-api-key --project=tamron-cloudrun-prod-new
```
