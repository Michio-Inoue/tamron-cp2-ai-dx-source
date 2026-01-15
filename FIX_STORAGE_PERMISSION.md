# Cloud Storage繝舌こ繝・ヨ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌お繝ｩ繝ｼ縺ｮ隗｣豎ｺ譁ｹ豕・

## 繧ｨ繝ｩ繝ｼ蜀・ｮｹ

```
invalid bucket "staging.singular-server-480006-s8.appspot.com"; 
service account singular-server-480006-s8@appspot.gserviceaccount.com 
does not have access to the bucket
```

## 蜴溷屏

App Engine縺ｮ繝・・繝ｭ繧､譎ゅ↓菴ｿ逕ｨ縺輔ｌ繧九せ繝・・繧ｸ繝ｳ繧ｰ繝舌こ繝・ヨ・・staging.singular-server-480006-s8.appspot.com`・峨↓縲√し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医′繧｢繧ｯ繧ｻ繧ｹ縺ｧ縺阪↑縺・・

## 隗｣豎ｺ譁ｹ豕・

### 譁ｹ豕・: Google Cloud Console縺ｧ讓ｩ髯舌ｒ莉倅ｸ趣ｼ域耳螂ｨ・・

1. **Cloud Storage繝舌こ繝・ヨ繝壹・繧ｸ縺ｫ繧｢繧ｯ繧ｻ繧ｹ**・・
   ```
   https://console.cloud.google.com/storage/browser?project=singular-server-480006-s8
   ```

2. **繧ｹ繝・・繧ｸ繝ｳ繧ｰ繝舌こ繝・ヨ繧呈爾縺・*・・
   - `staging.singular-server-480006-s8.appspot.com` 縺ｨ縺・≧蜷榊燕縺ｮ繝舌こ繝・ヨ繧呈爾縺・
   - 縺ｾ縺溘・縲～gs://staging.singular-server-480006-s8.appspot.com` 繧呈､懃ｴ｢

3. **繝舌こ繝・ヨ繧偵け繝ｪ繝・け**

4. **縲梧ｨｩ髯舌阪ち繝悶ｒ繧ｯ繝ｪ繝・け**

5. **縲後・繝ｪ繝ｳ繧ｷ繝代Ν繧定ｿｽ蜉縲阪ｒ繧ｯ繝ｪ繝・け**

6. **莉･荳九・諠・ｱ繧貞・蜉・*・・
   - **譁ｰ縺励＞繝励Μ繝ｳ繧ｷ繝代Ν**: `singular-server-480006-s8@appspot.gserviceaccount.com`
   - **繝ｭ繝ｼ繝ｫ**: 縲郡torage 繧ｪ繝悶ず繧ｧ繧ｯ繝育ｮ｡逅・・阪∪縺溘・縲郡torage 邂｡逅・・阪ｒ驕ｸ謚・

7. **縲御ｿ晏ｭ倥阪ｒ繧ｯ繝ｪ繝・け**

### 譁ｹ豕・: 繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺ｧ讓ｩ髯舌ｒ莉倅ｸ・

```powershell
# 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓Storage邂｡逅・・ｨｩ髯舌ｒ莉倅ｸ・
gsutil iam ch serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com:roles/storage.admin gs://staging.singular-server-480006-s8.appspot.com
```

縺ｾ縺溘・縲√ｈ繧企剞螳夂噪縺ｪ讓ｩ髯撰ｼ・

```powershell
# Storage繧ｪ繝悶ず繧ｧ繧ｯ繝育ｮ｡逅・・ｨｩ髯舌ｒ莉倅ｸ・
gsutil iam ch serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com:roles/storage.objectAdmin gs://staging.singular-server-480006-s8.appspot.com
```

### 譁ｹ豕・: 繝励Ο繧ｸ繧ｧ繧ｯ繝医Ξ繝吶Ν縺ｧ讓ｩ髯舌ｒ莉倅ｸ・

```powershell
# 繝励Ο繧ｸ繧ｧ繧ｯ繝医Ξ繝吶Ν縺ｧStorage邂｡逅・・ｨｩ髯舌ｒ莉倅ｸ・
gcloud projects add-iam-policy-binding singular-server-480006-s8 \
    --member="serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com" \
    --role="roles/storage.admin"
```

## 遒ｺ隱肴婿豕・

讓ｩ髯舌′豁｣縺励￥莉倅ｸ弱＆繧後◆縺狗｢ｺ隱搾ｼ・

```powershell
# 繝舌こ繝・ヨ縺ｮ讓ｩ髯舌ｒ遒ｺ隱・
gsutil iam get gs://staging.singular-server-480006-s8.appspot.com
```

## 讓ｩ髯蝉ｻ倅ｸ主ｾ後・繝・・繝ｭ繧､

讓ｩ髯舌ｒ莉倅ｸ弱＠縺溘ｉ縲∝・蠎ｦ繝・・繝ｭ繧､繧貞ｮ溯｡鯉ｼ・

```powershell
gcloud app deploy app.yaml --project=singular-server-480006-s8
```

## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### 繝舌こ繝・ヨ縺瑚ｦ九▽縺九ｉ縺ｪ縺・ｴ蜷・

App Engine縺ｮ蛻晄悄蛹匁凾縺ｫ閾ｪ蜍慕噪縺ｫ菴懈・縺輔ｌ繧九・縺壹〒縺吶′縲∬ｦ九▽縺九ｉ縺ｪ縺・ｴ蜷医・・・

1. App Engine縺梧ｭ｣縺励￥蛻晄悄蛹悶＆繧後※縺・ｋ縺狗｢ｺ隱・
2. 繝励Ο繧ｸ繧ｧ繧ｯ繝医′豁｣縺励￥驕ｸ謚槭＆繧後※縺・ｋ縺狗｢ｺ隱・
3. 謨ｰ蛻・ｾ・▲縺ｦ縺九ｉ蜀榊ｺｦ遒ｺ隱・

### 讓ｩ髯舌・莉倅ｸ弱′螟ｱ謨励☆繧句ｴ蜷・

1. 繝励Ο繧ｸ繧ｧ繧ｯ繝医・謇譛芽・∪縺溘・邱ｨ髮・・ｨｩ髯舌′縺ゅｋ縺狗｢ｺ隱・
2. Cloud Storage API縺梧怏蜉ｹ縺ｫ縺ｪ縺｣縺ｦ縺・ｋ縺狗｢ｺ隱・
3. 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医・繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ縺梧ｭ｣縺励＞縺狗｢ｺ隱・


