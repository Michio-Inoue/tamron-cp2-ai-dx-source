# 譌｢蟄倥・繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ・it-deployer・峨ｒ菴ｿ逕ｨ縺吶ｋ譁ｹ豕・

## 蝗樒ｭ・

**縺ｯ縺・∵里蟄倥・繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ・it-deployer・峨ｒ菴ｿ逕ｨ縺ｧ縺阪∪縺呻ｼ・*

App Engine縺ｮ蛻晄悄蛹悶〒縺ｯ縲√し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ驕ｸ謚槭☆繧句ｿ・ｦ√・縺ゅｊ縺ｾ縺帙ｓ縲ょ・譛溷喧蠕後∵里蟄倥・繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓Secret Manager縺ｸ縺ｮ讓ｩ髯舌ｒ莉倅ｸ弱☆繧後・菴ｿ逕ｨ縺ｧ縺阪∪縺吶・

## 謇矩・

### 繧ｹ繝・ャ繝・: App Engine繧貞・譛溷喧・医◎縺ｮ縺ｾ縺ｾ騾ｲ繧√ｋ・・

1. App Engine繝壹・繧ｸ縺ｫ繧｢繧ｯ繧ｻ繧ｹ・・
   ```
   https://console.cloud.google.com/appengine?project=singular-server-480006-s8
   ```

2. 縲後い繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ繧剃ｽ懈・縲阪ｒ繧ｯ繝ｪ繝・け

3. 繝ｪ繝ｼ繧ｸ繝ｧ繝ｳ繧帝∈謚槭＠縺ｦ縲御ｽ懈・縲阪ｒ繧ｯ繝ｪ繝・け

4. 蛻晄悄蛹悶ｒ螳御ｺ・ｼ医し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医・驕ｸ謚槭・荳崎ｦ・ｼ・

### 繧ｹ繝・ャ繝・: 譌｢蟄倥・繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ・it-deployer・峨ｒ遒ｺ隱・

1. 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医・繝ｼ繧ｸ縺ｫ繧｢繧ｯ繧ｻ繧ｹ・・
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts?project=singular-server-480006-s8
   ```

2. `git-deployer` 縺ｨ縺・≧蜷榊燕縺ｮ繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ謗｢縺・

3. 繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧堤｢ｺ隱搾ｼ井ｾ・ `git-deployer@singular-server-480006-s8.iam.gserviceaccount.com`・・

### 繧ｹ繝・ャ繝・: Secret Manager縺ｧ讓ｩ髯舌ｒ莉倅ｸ・

1. Secret Manager繝壹・繧ｸ縺ｧ `gemini-api-key` 繧帝幕縺擾ｼ・
   ```
   https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8
   ```

2. 縲梧ｨｩ髯舌阪ち繝悶ｒ繧ｯ繝ｪ繝・け

3. 縲後・繝ｪ繝ｳ繧ｷ繝代Ν繧定ｿｽ蜉縲阪ｒ繧ｯ繝ｪ繝・け

4. 莉･荳九・諠・ｱ繧貞・蜉幢ｼ・
   - **譁ｰ縺励＞繝励Μ繝ｳ繧ｷ繝代Ν**: `git-deployer` 縺ｮ繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧貞・蜉・
     - 萓・ `git-deployer@singular-server-480006-s8.iam.gserviceaccount.com`
   - **繝ｭ繝ｼ繝ｫ**: 縲郡ecret Manager 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ 繧｢繧ｯ繧ｻ繧ｵ繝ｼ縲阪ｒ驕ｸ謚・

5. 縲御ｿ晏ｭ倥阪ｒ繧ｯ繝ｪ繝・け

### 繧ｹ繝・ャ繝・: App Engine縺ｧ繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ謖・ｮ夲ｼ医が繝励す繝ｧ繝ｳ・・

譌｢蟄倥・繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ・it-deployer・峨ｒApp Engine縺ｧ菴ｿ逕ｨ縺吶ｋ蝣ｴ蜷茨ｼ・

1. `backend/app.yaml` 繧堤ｷｨ髮・＠縺ｦ縲√し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ謖・ｮ夲ｼ・

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'

# 譌｢蟄倥・繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ謖・ｮ・
service_account: git-deployer@singular-server-480006-s8.iam.gserviceaccount.com
```

**豕ｨ諢・*: 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医・繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ縺ｯ縲∝ｮ滄圀縺ｮ繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ縺ｫ鄂ｮ縺肴鋤縺医※縺上□縺輔＞縲・

## 繝｡繝ｪ繝・ヨ

譌｢蟄倥・繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ・it-deployer・峨ｒ菴ｿ逕ｨ縺吶ｋ繝｡繝ｪ繝・ヨ・・
- 譌｢縺ｫ險ｭ螳壽ｸ医∩縺ｮ繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ蜀榊茜逕ｨ縺ｧ縺阪ｋ
- 讓ｩ髯千ｮ｡逅・′邨ｱ荳縺輔ｌ繧・
- 譁ｰ縺励＞繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ菴懈・縺吶ｋ蠢・ｦ√′縺ｪ縺・

## 豕ｨ諢丈ｺ矩・

- 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医・繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ縺ｯ縲；oogle Cloud Console縺ｧ遒ｺ隱阪＠縺ｦ縺上□縺輔＞
- 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝亥錐縺檎焚縺ｪ繧句ｴ蜷茨ｼ井ｾ・ `git-deployer-xxx`・峨・縲√◎縺ｮ繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧剃ｽｿ逕ｨ縺励※縺上□縺輔＞
- `app.yaml` 縺ｧ繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ謖・ｮ壹＠縺ｪ縺・ｴ蜷医、pp Engine縺ｮ繝・ヵ繧ｩ繝ｫ繝医し繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医′菴ｿ逕ｨ縺輔ｌ縺ｾ縺・

## 遒ｺ隱肴婿豕・

繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医・繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧堤｢ｺ隱阪☆繧九↓縺ｯ・・

1. 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医・繝ｼ繧ｸ縺ｫ繧｢繧ｯ繧ｻ繧ｹ・・
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts?project=singular-server-480006-s8
   ```

2. `git-deployer` 繧偵け繝ｪ繝・け

3. 縲瑚ｩｳ邏ｰ縲阪ち繝悶〒繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧堤｢ｺ隱・


