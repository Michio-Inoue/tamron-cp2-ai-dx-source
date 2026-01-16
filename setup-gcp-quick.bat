@echo off
chcp 65001 >nul
echo ========================================
echo Google Cloud 繧ｻ繝・ヨ繧｢繝・・・育ｰ｡譏鍋沿・・
echo ========================================
echo.

set PROJECT_ID=singular-server-480006-s8
set SECRET_NAME=gemini-api-key
set API_KEY=[REDACTED]

echo [1/6] 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳壻ｸｭ...
gcloud config set project %PROJECT_ID%
if %errorlevel% neq 0 (
    echo 繧ｨ繝ｩ繝ｼ: 繝励Ο繧ｸ繧ｧ繧ｯ繝医・險ｭ螳壹↓螟ｱ謨励＠縺ｾ縺励◆
    echo 謇句虚縺ｧ螳溯｡後＠縺ｦ縺上□縺輔＞: gcloud config set project %PROJECT_ID%
    pause
    exit /b 1
)
echo 笨・繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳壼ｮ御ｺ・

echo.
echo [2/6] 蠢・ｦ√↑API繧呈怏蜉ｹ蛹紋ｸｭ...
gcloud services enable secretmanager.googleapis.com --project=%PROJECT_ID% --quiet
gcloud services enable appengine.googleapis.com --project=%PROJECT_ID% --quiet
gcloud services enable cloudbuild.googleapis.com --project=%PROJECT_ID% --quiet
echo 笨・API譛牙柑蛹門ｮ御ｺ・

echo.
echo [3/6] Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ倅ｸｭ...
echo %API_KEY% | gcloud secrets create %SECRET_NAME% --data-file=- --replication-policy="automatic" --project=%PROJECT_ID% 2>nul
if %errorlevel% neq 0 (
    echo 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺梧里縺ｫ蟄伜惠縺吶ｋ蜿ｯ閭ｽ諤ｧ縺後≠繧翫∪縺吶よ峩譁ｰ繧定ｩｦ縺ｿ縺ｾ縺・..
    echo %API_KEY% | gcloud secrets versions add %SECRET_NAME% --data-file=- --project=%PROJECT_ID%
    if %errorlevel% neq 0 (
        echo 隴ｦ蜻・ 繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ縺ｮ菴懈・/譖ｴ譁ｰ縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲よ焔蜍輔〒遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・
    ) else (
        echo 笨・繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ譖ｴ譁ｰ螳御ｺ・
    )
) else (
    echo 笨・繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ菴懈・螳御ｺ・
)

echo.
echo [4/6] 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ惹ｸｭ...
gcloud secrets add-iam-policy-binding %SECRET_NAME% --member="serviceAccount:%PROJECT_ID%@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=%PROJECT_ID% --quiet
if %errorlevel% neq 0 (
    echo 隴ｦ蜻・ 讓ｩ髯舌・莉倅ｸ弱↓螟ｱ謨励＠縺ｾ縺励◆縲よ焔蜍輔〒遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・
) else (
    echo 笨・讓ｩ髯蝉ｻ倅ｸ主ｮ御ｺ・
)

echo.
echo [5/6] 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨・萓晏ｭ倬未菫ゅｒ繧､繝ｳ繧ｹ繝医・繝ｫ荳ｭ...
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
echo [6/6] 繝・・繝ｭ繧､貅門ｙ螳御ｺ・ｼ・
echo.
echo ========================================
echo 谺｡縺ｮ繧ｹ繝・ャ繝・
echo ========================================
echo.
echo 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨ｒ繝・・繝ｭ繧､縺吶ｋ縺ｫ縺ｯ縲∽ｻ･荳九ｒ螳溯｡後＠縺ｦ縺上□縺輔＞:
echo   cd backend
echo   gcloud app deploy app.yaml
echo.
echo 縺ｾ縺溘・縲√％縺ｮ繧ｹ繧ｯ繝ｪ繝励ヨ繧堤ｶ夊｡後＠縺ｦ繝・・繝ｭ繧､繧貞ｮ溯｡後＠縺ｾ縺吶°・・(Y/N)
set /p DEPLOY="繝・・繝ｭ繧､繧貞ｮ溯｡後＠縺ｾ縺吶°・・(Y/N): "
if /i "%DEPLOY%"=="Y" (
    echo.
    echo 繝・・繝ｭ繧､繧帝幕蟋九＠縺ｾ縺・..
    cd backend
    gcloud app deploy app.yaml
    cd ..
) else (
    echo 繝・・繝ｭ繧､縺ｯ繧ｹ繧ｭ繝・・縺輔ｌ縺ｾ縺励◆縲・
)

echo.
echo ========================================
echo 繧ｻ繝・ヨ繧｢繝・・螳御ｺ・ｼ・
echo ========================================
pause


