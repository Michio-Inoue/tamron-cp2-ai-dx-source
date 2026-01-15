# Google Cloud 繝励Ο繧ｸ繧ｧ繧ｯ繝育｢ｺ隱肴婿豕・

## 譁ｹ豕・: gcloud繧ｳ繝槭Φ繝峨〒遒ｺ隱搾ｼ域耳螂ｨ・・

### 迴ｾ蝨ｨ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ遒ｺ隱・

```bash
# 迴ｾ蝨ｨ險ｭ螳壹＆繧後※縺・ｋ繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ遒ｺ隱・
gcloud config get-value project
```

### 縺吶∋縺ｦ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝井ｸ隕ｧ繧定｡ｨ遉ｺ

```bash
# 繧｢繧ｯ繧ｻ繧ｹ蜿ｯ閭ｽ縺ｪ縺吶∋縺ｦ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ陦ｨ遉ｺ
gcloud projects list
```

### 繝励Ο繧ｸ繧ｧ繧ｯ繝医・隧ｳ邏ｰ諠・ｱ繧堤｢ｺ隱・

```bash
# 繝励Ο繧ｸ繧ｧ繧ｯ繝・D繧呈欠螳壹＠縺ｦ隧ｳ邏ｰ諠・ｱ繧定｡ｨ遉ｺ
gcloud projects describe PROJECT_ID

# 縺ｾ縺溘・縲∫樟蝨ｨ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝医・隧ｳ邏ｰ繧定｡ｨ遉ｺ
gcloud projects describe $(gcloud config get-value project)
```

### 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ蛻・ｊ譖ｿ縺医ｋ

```bash
# 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳・蛻・ｊ譖ｿ縺・
gcloud config set project PROJECT_ID
```

## 譁ｹ豕・: Google Cloud Console縺ｧ遒ｺ隱・

1. [Google Cloud Console](https://console.cloud.google.com/) 縺ｫ繧｢繧ｯ繧ｻ繧ｹ
2. 逕ｻ髱｢荳企Κ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝磯∈謚槭ラ繝ｭ繝・・繝繧ｦ繝ｳ繧偵け繝ｪ繝・け
3. 繧｢繧ｯ繧ｻ繧ｹ蜿ｯ閭ｽ縺ｪ縺吶∋縺ｦ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝医′陦ｨ遉ｺ縺輔ｌ縺ｾ縺・
4. 繝励Ο繧ｸ繧ｧ繧ｯ繝亥錐繧偵け繝ｪ繝・け縺吶ｋ縺ｨ縲√・繝ｭ繧ｸ繧ｧ繧ｯ繝・D繧り｡ｨ遉ｺ縺輔ｌ縺ｾ縺・

## 譁ｹ豕・: 隱崎ｨｼ迥ｶ諷九ｒ遒ｺ隱・

```bash
# 迴ｾ蝨ｨ繝ｭ繧ｰ繧､繝ｳ縺励※縺・ｋ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ遒ｺ隱・
gcloud auth list

# 繝ｭ繧ｰ繧､繝ｳ縺悟ｿ・ｦ√↑蝣ｴ蜷・
gcloud auth login
```

## 譁ｹ豕・: 險ｭ螳壽ュ蝣ｱ繧偵☆縺ｹ縺ｦ遒ｺ隱・

```bash
# 縺吶∋縺ｦ縺ｮ險ｭ螳壽ュ蝣ｱ繧定｡ｨ遉ｺ
gcloud config list

# 險ｭ螳壼庄閭ｽ縺ｪ鬆・岼繧定｡ｨ遉ｺ
gcloud config list --all
```

## 繧医￥菴ｿ縺・さ繝槭Φ繝我ｸ隕ｧ

```bash
# 迴ｾ蝨ｨ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝・D繧貞叙蠕暦ｼ医せ繧ｯ繝ｪ繝励ヨ縺ｧ菴ｿ逕ｨ・・
gcloud config get-value project

# 繝励Ο繧ｸ繧ｧ繧ｯ繝井ｸ隕ｧ繧谷SON蠖｢蠑上〒蜿門ｾ・
gcloud projects list --format="json"

# 繝励Ο繧ｸ繧ｧ繧ｯ繝井ｸ隕ｧ繧定｡ｨ蠖｢蠑上〒陦ｨ遉ｺ・医・繝ｭ繧ｸ繧ｧ繧ｯ繝・D縲∝錐蜑阪√・繝ｭ繧ｸ繧ｧ繧ｯ繝育分蜿ｷ・・
gcloud projects list --format="table(projectId,name,projectNumber)"
```

## 繝励Ο繧ｸ繧ｧ繧ｯ繝医′隕九▽縺九ｉ縺ｪ縺・ｴ蜷・

### 譁ｰ縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ菴懈・

```bash
# 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ菴懈・
gcloud projects create PROJECT_ID --name="繝励Ο繧ｸ繧ｧ繧ｯ繝亥錐"

# 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳・
gcloud config set project PROJECT_ID

# 隲区ｱょ・繧｢繧ｫ繧ｦ繝ｳ繝医ｒ繝ｪ繝ｳ繧ｯ・亥・蝗槭・縺ｿ・・
gcloud billing projects link PROJECT_ID --billing-account=BILLING_ACCOUNT_ID
```

縺ｾ縺溘・縲；oogle Cloud Console縺九ｉ・・
1. [繝励Ο繧ｸ繧ｧ繧ｯ繝井ｽ懈・繝壹・繧ｸ](https://console.cloud.google.com/projectcreate)縺ｫ繧｢繧ｯ繧ｻ繧ｹ
2. 繝励Ο繧ｸ繧ｧ繧ｯ繝亥錐繧貞・蜉・
3. 縲御ｽ懈・縲阪ｒ繧ｯ繝ｪ繝・け

## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### 隱崎ｨｼ繧ｨ繝ｩ繝ｼ縺檎匱逕溘☆繧句ｴ蜷・

```bash
# 蜀崎ｪ崎ｨｼ
gcloud auth login

# 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ繝・ヵ繧ｩ繝ｫ繝郁ｪ崎ｨｼ諠・ｱ繧定ｨｭ螳・
gcloud auth application-default login
```

### 繝励Ο繧ｸ繧ｧ繧ｯ繝医↓繧｢繧ｯ繧ｻ繧ｹ縺ｧ縺阪↑縺・ｴ蜷・

1. 繝励Ο繧ｸ繧ｧ繧ｯ繝医・謇譛芽・∪縺溘・邱ｨ髮・・ｨｩ髯舌′縺ゅｋ縺狗｢ｺ隱・
2. 豁｣縺励＞Google繧｢繧ｫ繧ｦ繝ｳ繝医〒繝ｭ繧ｰ繧､繝ｳ縺励※縺・ｋ縺狗｢ｺ隱・
3. 邨・ｹ斐・繝昴Μ繧ｷ繝ｼ縺ｧ繝励Ο繧ｸ繧ｧ繧ｯ繝医∈縺ｮ繧｢繧ｯ繧ｻ繧ｹ縺悟宛髯舌＆繧後※縺・↑縺・°遒ｺ隱・

### 繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｨ繝励Ο繧ｸ繧ｧ繧ｯ繝育分蜿ｷ縺ｮ驕輔＞

- **繝励Ο繧ｸ繧ｧ繧ｯ繝・D**: 莠ｺ髢薙′隱ｭ縺ｿ繧・☆縺・ｭ伜挨蟄撰ｼ井ｾ・ `my-project-12345`・・
- **繝励Ο繧ｸ繧ｧ繧ｯ繝育分蜿ｷ**: 繧ｷ繧ｹ繝・Β縺御ｽｿ逕ｨ縺吶ｋ謨ｰ蛟､隴伜挨蟄撰ｼ井ｾ・ `123456789012`・・

縺ｩ縺｡繧峨ｂ繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ荳諢上↓隴伜挨縺励∪縺吶′縲√さ繝槭Φ繝峨〒縺ｯ騾壼ｸｸ繝励Ο繧ｸ繧ｧ繧ｯ繝・D繧剃ｽｿ逕ｨ縺励∪縺吶・


