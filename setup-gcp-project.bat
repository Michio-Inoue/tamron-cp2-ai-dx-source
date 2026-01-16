@echo off
echo ========================================
echo Google Cloud 繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳壹せ繧ｯ繝ｪ繝励ヨ
echo ========================================
echo.

echo 繝励Ο繧ｸ繧ｧ繧ｯ繝・D: singular-server-480006-s8
echo 繝励Ο繧ｸ繧ｧ繧ｯ繝亥錐: Tamron-cp2-AI-DX
echo.

echo [1/4] 隱崎ｨｼ繧堤｢ｺ隱阪＠縺ｦ縺・∪縺・..
gcloud auth list
if %errorlevel% neq 0 (
    echo 隱崎ｨｼ縺悟ｿ・ｦ√〒縺吶ゅヶ繝ｩ繧ｦ繧ｶ縺碁幕縺阪∪縺・..
    gcloud auth login
)

echo.
echo [2/4] 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ險ｭ螳壹＠縺ｦ縺・∪縺・..
gcloud config set project singular-server-480006-s8

echo.
echo [3/4] 迴ｾ蝨ｨ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ遒ｺ隱阪＠縺ｦ縺・∪縺・..
gcloud config get-value project

echo.
echo [4/4] 繝励Ο繧ｸ繧ｧ繧ｯ繝域ュ蝣ｱ繧堤｢ｺ隱阪＠縺ｦ縺・∪縺・..
gcloud projects describe singular-server-480006-s8 --format="table(projectId,name,projectNumber)"

echo.
echo ========================================
echo 險ｭ螳壼ｮ御ｺ・ｼ・
echo ========================================
echo.
echo 谺｡縺ｮ繧ｹ繝・ャ繝・
echo 1. Secret Manager縺ｫAPI繧ｭ繝ｼ繧剃ｿ晏ｭ・
echo 2. 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓讓ｩ髯舌ｒ莉倅ｸ・
echo 3. 繝舌ャ繧ｯ繧ｨ繝ｳ繝峨ｒ繝・・繝ｭ繧､
echo.
pause


