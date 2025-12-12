@echo off
chcp 65001 >nul
echo ========================================
echo Google Cloud セットアップ（簡易版）
echo ========================================
echo.

set PROJECT_ID=singular-server-480006-s8
set SECRET_NAME=gemini-api-key
set API_KEY=[REDACTED]

echo [1/6] プロジェクトを設定中...
gcloud config set project %PROJECT_ID%
if %errorlevel% neq 0 (
    echo エラー: プロジェクトの設定に失敗しました
    echo 手動で実行してください: gcloud config set project %PROJECT_ID%
    pause
    exit /b 1
)
echo ✓ プロジェクト設定完了

echo.
echo [2/6] 必要なAPIを有効化中...
gcloud services enable secretmanager.googleapis.com --project=%PROJECT_ID% --quiet
gcloud services enable appengine.googleapis.com --project=%PROJECT_ID% --quiet
gcloud services enable cloudbuild.googleapis.com --project=%PROJECT_ID% --quiet
echo ✓ API有効化完了

echo.
echo [3/6] Secret ManagerにAPIキーを保存中...
echo %API_KEY% | gcloud secrets create %SECRET_NAME% --data-file=- --replication-policy="automatic" --project=%PROJECT_ID% 2>nul
if %errorlevel% neq 0 (
    echo シークレットが既に存在する可能性があります。更新を試みます...
    echo %API_KEY% | gcloud secrets versions add %SECRET_NAME% --data-file=- --project=%PROJECT_ID%
    if %errorlevel% neq 0 (
        echo 警告: シークレットの作成/更新に失敗しました。手動で確認してください。
    ) else (
        echo ✓ シークレット更新完了
    )
) else (
    echo ✓ シークレット作成完了
)

echo.
echo [4/6] サービスアカウントに権限を付与中...
gcloud secrets add-iam-policy-binding %SECRET_NAME% --member="serviceAccount:%PROJECT_ID%@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=%PROJECT_ID% --quiet
if %errorlevel% neq 0 (
    echo 警告: 権限の付与に失敗しました。手動で確認してください。
) else (
    echo ✓ 権限付与完了
)

echo.
echo [5/6] バックエンドの依存関係をインストール中...
cd backend
if exist package.json (
    call npm install
    if %errorlevel% neq 0 (
        echo エラー: npm installに失敗しました
        cd ..
        pause
        exit /b 1
    )
    echo ✓ 依存関係インストール完了
) else (
    echo 警告: package.jsonが見つかりません
)
cd ..

echo.
echo [6/6] デプロイ準備完了！
echo.
echo ========================================
echo 次のステップ:
echo ========================================
echo.
echo バックエンドをデプロイするには、以下を実行してください:
echo   cd backend
echo   gcloud app deploy app.yaml
echo.
echo または、このスクリプトを続行してデプロイを実行しますか？ (Y/N)
set /p DEPLOY="デプロイを実行しますか？ (Y/N): "
if /i "%DEPLOY%"=="Y" (
    echo.
    echo デプロイを開始します...
    cd backend
    gcloud app deploy app.yaml
    cd ..
) else (
    echo デプロイはスキップされました。
)

echo.
echo ========================================
echo セットアップ完了！
echo ========================================
pause

