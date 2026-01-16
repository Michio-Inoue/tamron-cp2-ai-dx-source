# IAM繝昴Μ繧ｷ繝ｼ險ｭ螳壽焔鬆・

## 迴ｾ蝨ｨ縺ｮ迥ｶ豕・

Cloud Run繧ｵ繝ｼ繝薙せ縺ｮIAM繝昴Μ繧ｷ繝ｼ縺檎ｩｺ縺ｮ縺溘ａ縲∝・髢九い繧ｯ繧ｻ繧ｹ縺瑚ｨｱ蜿ｯ縺輔ｌ縺ｦ縺・∪縺帙ｓ縲・

## 隗｣豎ｺ譁ｹ豕・

### 譁ｹ豕・: Google Cloud Console縺九ｉ險ｭ螳夲ｼ域耳螂ｨ・・

1. **Cloud Run繧ｳ繝ｳ繧ｽ繝ｼ繝ｫ縺ｫ繧｢繧ｯ繧ｻ繧ｹ**
   - URL: https://console.cloud.google.com/run/detail/asia-northeast1/ai-drbfm-backend/permissions?project=singular-server-480006-s8

2. **縲後・繝ｪ繝ｳ繧ｷ繝代Ν繧定ｿｽ蜉縲阪ｒ繧ｯ繝ｪ繝・け**

3. **莉･荳九・險ｭ螳壹ｒ蜈･蜉・*
   - **譁ｰ縺励＞繝励Μ繝ｳ繧ｷ繝代Ν**: `allUsers`
   - **繝ｭ繝ｼ繝ｫ繧帝∈謚・*: `Cloud Run 襍ｷ蜍募・` (Cloud Run Invoker)

4. **縲御ｿ晏ｭ倥阪ｒ繧ｯ繝ｪ繝・け**

### 譁ｹ豕・: 繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺九ｉ險ｭ螳・

莉･荳九・繧ｳ繝槭Φ繝峨ｒ螳溯｡後＠縺ｦ縺上□縺輔＞・・

```powershell
gcloud run services add-iam-policy-binding ai-drbfm-backend `
    --region=asia-northeast1 `
    --member="allUsers" `
    --role="roles/run.invoker" `
    --project=singular-server-480006-s8
```

**豕ｨ諢・*: 邨・ｹ斐・繝ｪ繧ｷ繝ｼ縺ｫ繧医ｊ`allUsers`縺瑚ｨｱ蜿ｯ縺輔ｌ縺ｦ縺・↑縺・ｴ蜷医・縲√％縺ｮ繧ｳ繝槭Φ繝峨・螟ｱ謨励＠縺ｾ縺吶ゅ◎縺ｮ蝣ｴ蜷医・縲∵婿豕・・・oogle Cloud Console・峨ｒ菴ｿ逕ｨ縺励※縺上□縺輔＞縲・

### 譁ｹ豕・: 隱崎ｨｼ繝医・繧ｯ繝ｳ繧剃ｽｿ逕ｨ縺励※繝・せ繝・

IAM繝昴Μ繧ｷ繝ｼ繧定ｨｭ螳壹☆繧句燕縺ｫ縲∬ｪ崎ｨｼ繝医・繧ｯ繝ｳ繧剃ｽｿ逕ｨ縺励※API縺梧ｭ｣蟶ｸ縺ｫ蜍穂ｽ懊☆繧九°遒ｺ隱阪〒縺阪∪縺呻ｼ・

```powershell
$token = gcloud auth print-identity-token
$headers = @{ Authorization = "Bearer $token" }
$body = @{ prompt = "縺薙ｓ縺ｫ縺｡縺ｯ" } | ConvertTo-Json
Invoke-WebRequest -Uri "https://ai-drbfm-backend-636nanwcsq-an.a.run.app/api/gemini" -Method POST -Body $body -ContentType "application/json" -Headers $headers
```

## 遒ｺ隱・

IAM繝昴Μ繧ｷ繝ｼ繧定ｨｭ螳壹＠縺溷ｾ後∽ｻ･荳九・繧ｳ繝槭Φ繝峨〒遒ｺ隱阪〒縺阪∪縺呻ｼ・

```powershell
gcloud run services get-iam-policy ai-drbfm-backend --region=asia-northeast1 --project=singular-server-480006-s8
```

`allUsers`縺形roles/run.invoker`縺ｨ縺励※陦ｨ遉ｺ縺輔ｌ縺ｦ縺・ｌ縺ｰ縲∬ｨｭ螳壹・謌仙粥縺励※縺・∪縺吶・


