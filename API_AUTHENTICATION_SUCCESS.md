# API隱崎ｨｼ縺ｮ謌仙粥

## 笨・隱崎ｨｼ繝溘ラ繝ｫ繧ｦ繧ｧ繧｢縺梧ｭ｣蟶ｸ縺ｫ蜍穂ｽ・

繧ｨ繝ｩ繝ｼ縺・01縺九ｉ400縺ｫ螟峨ｏ繧翫∪縺励◆縲ゅ％繧後・縲・*API繧ｭ繝ｼ隱崎ｨｼ縺梧・蜉溘＠縺・*縺薙→繧呈э蜻ｳ縺励∪縺吶・

## 迴ｾ蝨ｨ縺ｮ迥ｶ諷・

1. 笨・**Cloud Run繧ｵ繝ｼ繝薙せ縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ**: 謌仙粥
2. 笨・**繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI**: 豁｣蟶ｸ縺ｫ蜍穂ｽ・
3. 笨・**隱崎ｨｼ繝溘ラ繝ｫ繧ｦ繧ｧ繧｢**: 豁｣蟶ｸ縺ｫ蜍穂ｽ懶ｼ・PI繧ｭ繝ｼ隱崎ｨｼ縺梧・蜉滂ｼ・
4. 笞・・**Gemini API繧ｭ繝ｼ**: 辟｡蜉ｹ・亥挨縺ｮ蝠城｡鯉ｼ・

## 谺｡縺ｮ繧ｹ繝・ャ繝・

### Gemini API繧ｭ繝ｼ縺ｮ遒ｺ隱・

Secret Manager縺ｫ菫晏ｭ倥＆繧後※縺・ｋGemini API繧ｭ繝ｼ縺梧怏蜉ｹ縺狗｢ｺ隱阪☆繧句ｿ・ｦ√′縺ゅｊ縺ｾ縺吶・

```powershell
# Gemini API繧ｭ繝ｼ繧堤｢ｺ隱・
gcloud secrets versions access latest --secret=gemini-api-key --project=tamron-cloudrun-prod-new
```

### 譁ｰ縺励＞Gemini API繧ｭ繝ｼ縺ｮ險ｭ螳・

繧ゅ＠Gemini API繧ｭ繝ｼ縺檎┌蜉ｹ縺ｪ蝣ｴ蜷医・縲∵眠縺励＞API繧ｭ繝ｼ繧担ecret Manager縺ｫ霑ｽ蜉縺励※縺上□縺輔＞・・

```powershell
# 譁ｰ縺励＞API繧ｭ繝ｼ繧担ecret Manager縺ｫ霑ｽ蜉
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

## 縺ｾ縺ｨ繧・

**API繧ｭ繝ｼ隱崎ｨｼ縺ｯ豁｣蟶ｸ縺ｫ蜍穂ｽ懊＠縺ｦ縺・∪縺呻ｼ・*

- 笨・繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ: 謌仙粥
- 笨・API繧ｭ繝ｼ隱崎ｨｼ: 謌仙粥
- 笞・・Gemini API繧ｭ繝ｼ: 辟｡蜉ｹ・亥挨騾泌ｯｾ蠢懊′蠢・ｦ・ｼ・

隱崎ｨｼ繝溘ラ繝ｫ繧ｦ繧ｧ繧｢縺ｮ螳溯｣・・螳御ｺ・＠縲∵ｭ｣蟶ｸ縺ｫ蜍穂ｽ懊＠縺ｦ縺・∪縺吶・
