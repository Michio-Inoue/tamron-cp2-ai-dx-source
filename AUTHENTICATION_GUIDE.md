# Google Cloud CLI 隱崎ｨｼ謇矩・

## 蜀崎ｪ崎ｨｼ縺悟ｿ・ｦ√↑蝣ｴ蜷・

`Please enter your password:` 縺ｨ縺・≧繝｡繝・そ繝ｼ繧ｸ縺瑚｡ｨ遉ｺ縺輔ｌ縺溷ｴ蜷医；oogle Cloud CLI縺ｮ蜀崎ｪ崎ｨｼ縺悟ｿ・ｦ√〒縺吶・

## 隱崎ｨｼ譁ｹ豕・

### 譁ｹ豕・: 繝悶Λ繧ｦ繧ｶ縺ｧ隱崎ｨｼ・域耳螂ｨ・・

PowerShell縺ｧ莉･荳九ｒ螳溯｡鯉ｼ・

```powershell
gcloud auth login
```

1. 繧ｳ繝槭Φ繝峨ｒ螳溯｡後☆繧九→縲√ヶ繝ｩ繧ｦ繧ｶ縺瑚・蜍慕噪縺ｫ髢九″縺ｾ縺・
2. Google繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ・inoue@tamron-compo2.com`・峨〒繝ｭ繧ｰ繧､繝ｳ
3. 縲瑚ｨｱ蜿ｯ縲阪ｒ繧ｯ繝ｪ繝・け
4. 隱崎ｨｼ縺悟ｮ御ｺ・☆繧九→縲￣owerShell縺ｫ縲瑚ｪ崎ｨｼ縺梧・蜉溘＠縺ｾ縺励◆縲阪→陦ｨ遉ｺ縺輔ｌ縺ｾ縺・

### 譁ｹ豕・: 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ繝・ヵ繧ｩ繝ｫ繝郁ｪ崎ｨｼ諠・ｱ繧定ｨｭ螳・

```powershell
gcloud auth application-default login
```

縺薙・繧ｳ繝槭Φ繝峨ｂ繝悶Λ繧ｦ繧ｶ縺ｧ隱崎ｨｼ繧定｡後＞縺ｾ縺吶・

## 隱崎ｨｼ蠕後・遒ｺ隱・

隱崎ｨｼ縺悟ｮ御ｺ・＠縺溘ｉ縲∽ｻ･荳九〒遒ｺ隱搾ｼ・

```powershell
gcloud auth list
```

莉･荳九・繧医≧縺ｫ陦ｨ遉ｺ縺輔ｌ繧後・OK・・
```
Credentialed Accounts
ACTIVE  ACCOUNT
*       inoue@tamron-compo2.com
```

## 隱崎ｨｼ蠕後・谺｡縺ｮ繧ｹ繝・ャ繝・

隱崎ｨｼ縺悟ｮ御ｺ・＠縺溘ｉ縲∽ｻ･荳九ｒ螳溯｡鯉ｼ・

```powershell
# 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳・
gcloud config set project singular-server-480006-s8

# 險ｭ螳壹ｒ遒ｺ隱・
gcloud config get-value project
```

縺昴・蠕後√ョ繝励Ο繧､繧貞ｮ溯｡鯉ｼ・

```powershell
cd backend
gcloud app deploy app.yaml
```

## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### 繝悶Λ繧ｦ繧ｶ縺碁幕縺九↑縺・ｴ蜷・

1. 謇句虚縺ｧ繝悶Λ繧ｦ繧ｶ繧帝幕縺・
2. 莉･荳九・URL縺ｫ繧｢繧ｯ繧ｻ繧ｹ・・
   ```
   https://accounts.google.com/o/oauth2/auth?...
   ```
   ・医さ繝槭Φ繝牙ｮ溯｡梧凾縺ｫ陦ｨ遉ｺ縺輔ｌ繧偽RL繧剃ｽｿ逕ｨ・・

### 隱崎ｨｼ縺悟､ｱ謨励☆繧句ｴ蜷・

1. 豁｣縺励＞Google繧｢繧ｫ繧ｦ繝ｳ繝医〒繝ｭ繧ｰ繧､繝ｳ縺励※縺・ｋ縺狗｢ｺ隱・
2. 繝励Ο繧ｸ繧ｧ繧ｯ繝医∈縺ｮ繧｢繧ｯ繧ｻ繧ｹ讓ｩ髯舌′縺ゅｋ縺狗｢ｺ隱・
3. 繝阪ャ繝医Ρ繝ｼ繧ｯ謗･邯壹ｒ遒ｺ隱・

### 隱崎ｨｼ蠕後ｂ縲訓lease enter your password:縲阪′陦ｨ遉ｺ縺輔ｌ繧句ｴ蜷・

1. 隱崎ｨｼ迥ｶ諷九ｒ遒ｺ隱搾ｼ・
   ```powershell
   gcloud auth list
   ```

2. 蜀榊ｺｦ隱崎ｨｼ繧定ｩｦ縺呻ｼ・
   ```powershell
   gcloud auth login --no-launch-browser
   ```


