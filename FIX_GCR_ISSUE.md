# GCR繧｢繧ｯ繧ｻ繧ｹ繧ｨ繝ｩ繝ｼ縺ｮ隗｣豎ｺ譁ｹ豕・

## 蝠城｡後・蜴溷屏

App Engine縺ｮ閾ｪ蜍輔ン繝ｫ繝峨す繧ｹ繝・Β縺後∝商縺Гontainer Registry (GCR) 縺ｮ繧ｭ繝｣繝・す繝･繧剃ｽｿ逕ｨ縺励ｈ縺・→縺励※縺・∪縺吶′縲，loud Build繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓GCR縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌′縺ｪ縺・◆繧√√ン繝ｫ繝峨′螟ｱ謨励＠縺ｦ縺・∪縺吶・

## 隗｣豎ｺ遲・

### 繧ｹ繝・ャ繝・: Cloud Build繝医Μ繧ｬ繝ｼ繧堤｢ｺ隱・

Google Cloud Console縺ｧ莉･荳九ｒ遒ｺ隱搾ｼ・
```
https://console.cloud.google.com/cloud-build/triggers?project=singular-server-480006-s8
```

遒ｺ隱堺ｺ矩・ｼ・
- App Engine縺ｮ繝・・繝ｭ繧､繧呈､懃衍縺励※繝薙Ν繝峨ｒ髢句ｧ九＠縺ｦ縺・ｋ繝医Μ繧ｬ繝ｼ縺後↑縺・°
- 閾ｪ蜍慕函謌舌＆繧後◆繝医Μ繧ｬ繝ｼ縺後↑縺・°
- 繧ｽ繝ｼ繧ｹ縺隈itHub縺ｧ縺ｯ縺ｪ縺・ヨ繝ｪ繧ｬ繝ｼ縺後↑縺・°

### 繧ｹ繝・ャ繝・: 蜿､縺・ヨ繝ｪ繧ｬ繝ｼ繧堤┌蜉ｹ蛹悶∪縺溘・蜑企勁

隕九▽縺九▲縺溷商縺・ヨ繝ｪ繧ｬ繝ｼ繧抵ｼ・
- 辟｡蜉ｹ蛹悶☆繧具ｼ域耳螂ｨ・壼ｾ後〒蠢・ｦ√↓縺ｪ繧句庄閭ｽ諤ｧ縺後≠繧九◆繧・ｼ・
- 縺ｾ縺溘・蜑企勁縺吶ｋ

### 繧ｹ繝・ャ繝・: GitHub騾｣謳ｺ縺ｫ繧医ｋ譁ｰ隕上ヨ繝ｪ繧ｬ繝ｼ縺ｮ遒ｺ隱・

莉･荳九・繝医Μ繧ｬ繝ｼ縺梧怏蜉ｹ縺ｫ縺ｪ縺｣縺ｦ縺・ｋ縺狗｢ｺ隱搾ｼ・
- 繧ｽ繝ｼ繧ｹ: GitHub (Cloud Build)
- 繝ｪ繝昴ず繝医Μ: tamron-cp2-ai-dx-source
- 讒区・繝輔ぃ繧､繝ｫ: /cloudbuild.yaml

### 繧ｹ繝・ャ繝・: App Engine繧ｵ繝ｼ繝薙せ繧貞炎髯､・医が繝励す繝ｧ繝ｳ・・

App Engine繧剃ｽｿ逕ｨ縺励↑縺・ｴ蜷茨ｼ・
```
https://console.cloud.google.com/appengine?project=singular-server-480006-s8
```

縲瑚ｨｭ螳壹阪∪縺溘・縲後し繝ｼ繝薙せ縲阪〒縲√ョ繝励Ο繧､縺輔ｌ縺ｦ縺・ｋ繧ｵ繝ｼ繝薙せ繧堤┌蜉ｹ蛹悶∪縺溘・蜑企勁

### 繧ｹ繝・ャ繝・: Cloud Run縺ｸ縺ｮ繝・・繝ｭ繧､

GitHub縺ｫ繝励ャ繧ｷ繝･縺励※縲∵眠縺励＞Cloud Run繝医Μ繧ｬ繝ｼ繧定ｵｷ蜍・

## 莉｣譖ｿ譯・ App Engine繧堤ｶ夊｡後☆繧句ｴ蜷・

App Engine繧堤ｶ夊｡後☆繧句ｴ蜷医・縲；CR縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌ｒ莉倅ｸ趣ｼ・

```powershell
# Container Registry API繧呈怏蜉ｹ蛹・
gcloud services enable containerregistry.googleapis.com --project=singular-server-480006-s8

# Cloud Build繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓GCR縺ｸ縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌ｒ莉倅ｸ・
gcloud projects add-iam-policy-binding singular-server-480006-s8 \
    --member="serviceAccount:284805971012@cloudbuild.gserviceaccount.com" \
    --role="roles/storage.admin"
```

縺溘□縺励；CR縺ｯ蟒・ｭ｢莠亥ｮ壹↑縺ｮ縺ｧ縲、rtifact Registry縺ｸ縺ｮ遘ｻ陦後ｒ謗ｨ螂ｨ縺励∪縺吶・
