@echo off
chcp 65001 >nul
echo ========================================
echo Google Cloud 繧ｻ繝・ヨ繧｢繝・・邯咏ｶ・
echo ========================================
echo.

echo [驥崎ｦ‐ 蜀崎ｪ崎ｨｼ縺悟ｿ・ｦ√〒縺吶・
echo 莉･荳九・繧ｳ繝槭Φ繝峨ｒ螳溯｡後＠縺ｦ縺上□縺輔＞・・
echo.
echo 1. 蜀崎ｪ崎ｨｼ・医ヶ繝ｩ繧ｦ繧ｶ縺碁幕縺阪∪縺呻ｼ・
echo    gcloud auth login
echo.
echo 2. 繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳・
echo    gcloud config set project singular-server-480006-s8
echo.
echo 3. 邯壹″縺ｮ繧ｳ繝槭Φ繝峨ｒ螳溯｡・
echo    縺薙・繝舌ャ繝√ヵ繧｡繧､繝ｫ繧貞・蠎ｦ螳溯｡後＠縺ｦ縺上□縺輔＞
echo.
pause

echo.
echo [1/5] 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳壻ｸｭ...
gcloud config set project singular-server-480006-s8
if %errorlevel% neq 0 (
    echo 繧ｨ繝ｩ繝ｼ: 繝励Ο繧ｸ繧ｧ繧ｯ繝医・險ｭ螳壹↓螟ｱ謨励＠縺ｾ縺励◆
    echo 謇句虚縺ｧ螳溯｡後＠縺ｦ縺上□縺輔＞: gcloud config set project singular-server-480006-s8
    pause
    exit /b 1
)
echo 笨・繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳壼ｮ御ｺ・

echo.
echo [2/5] 蠢・ｦ√↑API繧呈怏蜉ｹ蛹紋ｸｭ...
gcloud services enable secretmanager.googleapis.com --project=singular-server-480006-s8
gcloud services enable appengine.googleapis.com --project=singular-server-480006-s8
gcloud services enable cloudbuild.googleapis.com --project=singular-server-480006-s8
echo 笨・API譛牙柑蛹門ｮ御ｺ・

echo.
echo [3/5] Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ倅ｸｭ...
echo [REDACTED] | gcloud secrets create gemini-api-key --data-file=- --replication-policy="automatic" --project=singular-server-480006-s8 2>nul
if %errorlevel% neq 0 (
    echo 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺梧里縺ｫ蟄伜惠縺吶ｋ蜿ｯ閭ｽ諤ｧ縺後≠繧翫∪縺吶よ峩譁ｰ繧定ｩｦ縺ｿ縺ｾ縺・..
    echo [REDACTED] | gcloud secrets versions add gemini-api-key --data-file=- --project=singular-server-480006-s8
    if %errorlevel% neq 0 (
        echo 隴ｦ蜻・ 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺ｮ菴懈・/譖ｴ譁ｰ縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲よ焔蜍輔〒遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・
    ) else (
        echo 笨・繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ譖ｴ譁ｰ螳御ｺ・
    )
) else (
    echo 笨・繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ菴懈・螳御ｺ・
)

echo.
echo [4/5] 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ惹ｸｭ...
gcloud secrets add-iam-policy-binding gemini-api-key --member="serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=singular-server-480006-s8
if %errorlevel% neq 0 (
    echo 隴ｦ蜻・ 讓ｩ髯舌・莉倅ｸ弱↓螟ｱ謨励＠縺ｾ縺励◆縲よ焔蜍輔〒遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・
) else (
    echo 笨・讓ｩ髯蝉ｻ倅ｸ主ｮ御ｺ・
)

echo.
echo [5/5] 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨・萓晏ｭ倬未菫ゅｒ繧､繝ｳ繧ｹ繝医・繝ｫ荳ｭ...
cd backend
if exist package.json (
    call npm install
    if %errorlevel% neq 0 (
        echo 繧ｨ繝ｩ繝ｼ: npm install縺ｫ螟ｱ謨励＠縺ｾ縺励◆
        cd ..
        pause
        exit /b 1
    )
    echo 笨・萓晏ｭ倬未菫ゅう繝ｳ繧ｹ繝医・繝ｫ螳御ｺ・
) else (
    echo 隴ｦ蜻・ package.json縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ
)
cd ..

echo.
echo ========================================
echo 繧ｻ繝・ヨ繧｢繝・・螳御ｺ・ｼ・
echo ========================================
echo.
echo 谺｡縺ｮ繧ｹ繝・ャ繝・ 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨ｒ繝・・繝ｭ繧､
echo   cd backend
echo   gcloud app deploy app.yaml
echo.
pause

