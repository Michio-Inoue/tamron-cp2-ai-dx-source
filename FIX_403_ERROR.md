# 403繧ｨ繝ｩ繝ｼ縺ｮ隗｣豎ｺ譁ｹ豕・

## 蝠城｡・

繝輔Ο繝ｳ繝医お繝ｳ繝会ｼ・avaScript・峨°繧峨ヰ繝・け繧ｨ繝ｳ繝陰PI繧貞他縺ｳ蜃ｺ縺咎圀縺ｫ縲・03繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｦ縺・∪縺吶・

## 蜴溷屏

繝悶Λ繧ｦ繧ｶ縺九ｉ逶ｴ謗･Cloud Run API繧貞他縺ｳ蜃ｺ縺吝ｴ蜷医∬ｪ崎ｨｼ諠・ｱ縺瑚・蜍慕噪縺ｫ騾∽ｿ｡縺輔ｌ縺ｪ縺・◆繧√・03繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺吶・

## 隗｣豎ｺ譁ｹ豕・

### 譁ｹ豕・: Google Cloud Console縺九ｉ蜈ｬ髢九い繧ｯ繧ｻ繧ｹ繧定ｨｱ蜿ｯ・域怙繧らｰ｡蜊假ｼ・

**謇矩・ｼ・*

1. **莉･荳九・URL縺ｫ繧｢繧ｯ繧ｻ繧ｹ**
   ```
   https://console.cloud.google.com/run/detail/asia-northeast1/ai-drbfm-backend/permissions?project=tamron-cloudrun-prod-new
   ```

2. **縲後・繝ｪ繝ｳ繧ｷ繝代Ν繧定ｿｽ蜉縲阪・繧ｿ繝ｳ繧偵け繝ｪ繝・け**

3. **莉･荳九・諠・ｱ繧貞・蜉・*
   - **譁ｰ縺励＞繝励Μ繝ｳ繧ｷ繝代Ν**: `allUsers` 縺ｨ蜈･蜉・
   - **繝ｭ繝ｼ繝ｫ**: `Cloud Run 襍ｷ蜍募・` 繧帝∈謚橸ｼ医∪縺溘・ `roles/run.invoker` 縺ｨ蜈･蜉幢ｼ・

4. **縲御ｿ晏ｭ倥阪ｒ繧ｯ繝ｪ繝・け**

縺薙ｌ縺ｧ縲∬ｪ崎ｨｼ縺ｪ縺励〒API縺ｫ繧｢繧ｯ繧ｻ繧ｹ縺ｧ縺阪ｋ繧医≧縺ｫ縺ｪ繧翫∪縺吶・

### 譁ｹ豕・: 繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺九ｉ險ｭ螳夲ｼ育ｵ・ｹ斐・繝ｪ繧ｷ繝ｼ縺ｧ險ｱ蜿ｯ縺輔ｌ縺ｦ縺・ｋ蝣ｴ蜷茨ｼ・

```powershell
gcloud run services add-iam-policy-binding ai-drbfm-backend `
  --region=asia-northeast1 `
  --member="allUsers" `
  --role="roles/run.invoker" `
  --project=tamron-cloudrun-prod-new
```

**豕ｨ諢・*: 邨・ｹ斐・繝ｪ繧ｷ繝ｼ縺ｧ蛻ｶ髯舌＆繧後※縺・ｋ蝣ｴ蜷医・縲√％縺ｮ繧ｳ繝槭Φ繝峨・螟ｱ謨励＠縺ｾ縺吶ゅ◎縺ｮ蝣ｴ蜷医・縲∵婿豕・繧剃ｽｿ逕ｨ縺励※縺上□縺輔＞縲・

### 譁ｹ豕・: 邨・ｹ斐・繝ｪ繧ｷ繝ｼ繧堤｢ｺ隱阪・螟画峩

邨・ｹ斐・繝ｪ繧ｷ繝ｼ縺ｧ`allUsers`縺ｸ縺ｮ蜈ｬ髢九い繧ｯ繧ｻ繧ｹ縺悟宛髯舌＆繧後※縺・ｋ蝣ｴ蜷医∫ｵ・ｹ皮ｮ｡逅・・↓萓晞ｼ縺励※莉･荳九・繝昴Μ繧ｷ繝ｼ繧堤｢ｺ隱阪・螟画峩縺吶ｋ蠢・ｦ√′縺ゅｊ縺ｾ縺呻ｼ・

- `constraints/iam.allowedPolicyMemberDomains`
- `constraints/run.allowedIngress`

## 遒ｺ隱肴婿豕・

險ｭ螳壼ｾ後∽ｻ･荳九・繧ｳ繝槭Φ繝峨〒遒ｺ隱阪〒縺阪∪縺呻ｼ・

```powershell
gcloud run services get-iam-policy ai-drbfm-backend --region=asia-northeast1 --project=tamron-cloudrun-prod-new
```

蜃ｺ蜉帙↓莉･荳九・繧医≧縺ｪ陦後′陦ｨ遉ｺ縺輔ｌ繧後・謌仙粥縺ｧ縺呻ｼ・

```
bindings:
- members:
  - allUsers
  role: roles/run.invoker
```

## 繝・せ繝域婿豕・

險ｭ螳壼ｾ後√ヶ繝ｩ繧ｦ繧ｶ縺ｮ髢狗匱閠・ヤ繝ｼ繝ｫ・・12・峨・繧ｳ繝ｳ繧ｽ繝ｼ繝ｫ縺ｧ莉･荳九ｒ螳溯｡鯉ｼ・

```javascript
fetch('https://ai-drbfm-backend-43iql33sfa-an.a.run.app/', {
  method: 'GET'
})
.then(response => response.json())
.then(data => console.log('謌仙粥:', data))
.catch(error => console.error('繧ｨ繝ｩ繝ｼ:', error));
```

謌仙粥縺吶ｌ縺ｰ縲・03繧ｨ繝ｩ繝ｼ縺ｯ隗｣豸医＆繧後※縺・∪縺吶・
