# 繧ｻ繧ｭ繝･繧｢縺ｪAPI繧｢繧ｯ繧ｻ繧ｹ縺ｮ險ｭ螳壽婿豕・

## 讎りｦ・

`allUsers`縺ｸ縺ｮ蜈ｬ髢九い繧ｯ繧ｻ繧ｹ繧定ｨｱ蜿ｯ縺帙★縲、PI繧ｭ繝ｼ繧剃ｽｿ逕ｨ縺励◆隱崎ｨｼ繧貞ｮ溯｣・＠縺ｾ縺励◆縲・

## 螳溯｣・・螳ｹ

### 1. 隱崎ｨｼ繝溘ラ繝ｫ繧ｦ繧ｧ繧｢縺ｮ霑ｽ蜉

`backend/auth-middleware.js`繧剃ｽ懈・縺励、PI繧ｭ繝ｼ讀懆ｨｼ讖溯・繧貞ｮ溯｣・＠縺ｾ縺励◆縲・

### 2. API繧ｭ繝ｼ縺ｮ邂｡逅・

- **譛ｬ逡ｪ迺ｰ蠅・*: Secret Manager縺ｫ`backend-api-key`縺ｨ縺・≧蜷榊燕縺ｧ菫晏ｭ・
- **繝ｭ繝ｼ繧ｫ繝ｫ迺ｰ蠅・*: 迺ｰ蠅・､画焚`BACKEND_API_KEY`縺ｾ縺溘・`API_ACCESS_KEY`縺九ｉ蜿門ｾ・

### 3. 隱崎ｨｼ譁ｹ豕・

繝輔Ο繝ｳ繝医お繝ｳ繝峨°繧陰PI繧貞他縺ｳ蜃ｺ縺咎圀縺ｫ縲∽ｻ･荳九・縺・★繧後°縺ｮ譁ｹ豕輔〒API繧ｭ繝ｼ繧帝∽ｿ｡・・

#### 譁ｹ豕・: 繝倥ャ繝繝ｼ縺ｫAPI繧ｭ繝ｼ繧定ｿｽ蜉・域耳螂ｨ・・

```javascript
fetch('https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'YOUR_API_KEY'  // API繧ｭ繝ｼ繧定ｿｽ蜉
    },
    body: JSON.stringify({ ... })
});
```

#### 譁ｹ豕・: Authorization繝倥ャ繝繝ｼ縺ｫ霑ｽ蜉

```javascript
fetch('https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'  // Bearer繝医・繧ｯ繝ｳ縺ｨ縺励※騾∽ｿ｡
    },
    body: JSON.stringify({ ... })
});
```

#### 譁ｹ豕・: 繝ｪ繧ｯ繧ｨ繧ｹ繝医・繝・ぅ縺ｫ霑ｽ蜉

```javascript
fetch('https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        apiKey: 'YOUR_API_KEY',  // 繝懊ョ繧｣縺ｫAPI繧ｭ繝ｼ繧定ｿｽ蜉
        contents: [...],
        ...
    })
});
```

## 繧ｻ繝・ヨ繧｢繝・・謇矩・

### 1. Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ・

```powershell
# 繝ｩ繝ｳ繝繝縺ｪAPI繧ｭ繝ｼ繧堤函謌・
$apiKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Secret Manager縺ｫ菫晏ｭ・
echo $apiKey | gcloud secrets create backend-api-key --data-file=- --project=tamron-cloudrun-prod-new

# 縺ｾ縺溘・譌｢蟄倥・繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺ｫ繝舌・繧ｸ繝ｧ繝ｳ繧定ｿｽ蜉
echo $apiKey | gcloud secrets versions add backend-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### 2. 迺ｰ蠅・､画焚繧定ｨｭ螳・

`cloudbuild.yaml`縺ｫ迺ｰ蠅・､画焚繧定ｿｽ蜉・・

```yaml
- '--set-env-vars'
- 'GEMINI_API_KEY_SECRET_NAME=gemini-api-key,NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,BACKEND_API_KEY_SECRET_NAME=backend-api-key'
```

### 3. 繝輔Ο繝ｳ繝医お繝ｳ繝峨ｒ譖ｴ譁ｰ

`ai-drbfm.js`繧呈峩譁ｰ縺励※縲、PI繧ｭ繝ｼ繧帝∽ｿ｡縺吶ｋ繧医≧縺ｫ縺励∪縺吶・

## 繧ｻ繧ｭ繝･繝ｪ繝・ぅ荳翫・豕ｨ諢丈ｺ矩・

1. **API繧ｭ繝ｼ縺ｮ邂｡逅・*
   - API繧ｭ繝ｼ縺ｯSecret Manager縺ｧ邂｡逅・
   - 繝輔Ο繝ｳ繝医お繝ｳ繝峨↓蝓九ａ霎ｼ繧蝣ｴ蜷医・縲√Ξ繝ｼ繝亥宛髯舌↑縺ｩ縺ｮ霑ｽ蜉菫晁ｭｷ繧呈､懆ｨ・

2. **HTTPS縺ｮ菴ｿ逕ｨ**
   - 縺吶∋縺ｦ縺ｮ騾壻ｿ｡縺ｯHTTPS邨檎罰縺ｧ陦後≧

3. **繝ｬ繝ｼ繝亥宛髯・*
   - 蠢・ｦ√↓蠢懊§縺ｦ縲√Ξ繝ｼ繝亥宛髯舌ｒ霑ｽ蜉縺吶ｋ縺薙→繧呈耳螂ｨ

4. **CORS險ｭ螳・*
   - 蠢・ｦ√↓蠢懊§縺ｦ縲，ORS險ｭ螳壹ｒ迚ｹ螳壹・繝峨Γ繧､繝ｳ縺ｫ蛻ｶ髯・

## 繝輔Ο繝ｳ繝医お繝ｳ繝峨・譖ｴ譁ｰ

`ai-drbfm.js`繧呈峩譁ｰ縺励※縲、PI繧ｭ繝ｼ繧帝∽ｿ｡縺吶ｋ繧医≧縺ｫ縺励∪縺呻ｼ・

```javascript
// API繧ｭ繝ｼ繧定ｨｭ螳夲ｼ育腸蠅・､画焚縺ｾ縺溘・險ｭ螳壹ヵ繧｡繧､繝ｫ縺九ｉ蜿門ｾ暦ｼ・
const BACKEND_API_KEY = window.BACKEND_API_KEY || 'YOUR_API_KEY';

// API蜻ｼ縺ｳ蜃ｺ縺玲凾縺ｫAPI繧ｭ繝ｼ繧定ｿｽ蜉
const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BACKEND_API_KEY  // API繧ｭ繝ｼ繧定ｿｽ蜉
    },
    body: JSON.stringify({ ... })
});
```

## 繝・せ繝域婿豕・

```powershell
# API繧ｭ繝ｼ繧貞叙蠕・
$apiKey = gcloud secrets versions access latest --secret=backend-api-key --project=tamron-cloudrun-prod-new

# API繧偵ユ繧ｹ繝・
$headers = @{
    'Content-Type' = 'application/json'
    'X-API-Key' = $apiKey
}
$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Hello, world!"
                }
            )
        }
    )
    generationConfig = @{
        temperature = 0.7
        maxOutputTokens = 100
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini" -Method POST -Headers $headers -Body $body
```
