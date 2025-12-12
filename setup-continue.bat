@echo off
chcp 65001 >nul
echo ========================================
echo Google Cloud セットアップ継続
echo ========================================
echo.

echo [重要] 再認証が必要です。
echo 以下のコマンドを実行してください：
echo.
echo 1. 再認証（ブラウザが開きます）:
echo    gcloud auth login
echo.
echo 2. プロジェクト設定:
echo    gcloud config set project singular-server-480006-s8
echo.
echo 3. 続きのコマンドを実行:
echo    このバッチファイルを再度実行してください
echo.
pause

echo.
echo [1/5] プロジェクトを設定中...
gcloud config set project singular-server-480006-s8
if %errorlevel% neq 0 (
    echo エラー: プロジェクトの設定に失敗しました
    echo 手動で実行してください: gcloud config set project singular-server-480006-s8
    pause
    exit /b 1
)
echo ✓ プロジェクト設定完了

echo.
echo [2/5] 必要なAPIを有効化中...
gcloud services enable secretmanager.googleapis.com --project=singular-server-480006-s8
gcloud services enable appengine.googleapis.com --project=singular-server-480006-s8
gcloud services enable cloudbuild.googleapis.com --project=singular-server-480006-s8
echo ✓ API有効化完了

echo.
echo [3/5] Secret ManagerにAPIキーを保存中...
echo [REDACTED] | gcloud secrets create gemini-api-key --data-file=- --replication-policy="automatic" --project=singular-server-480006-s8 2>nul
if %errorlevel% neq 0 (
    echo シークレットが既に存在する可能性があります。更新を試みます...
    echo [REDACTED] | gcloud secrets versions add gemini-api-key --data-file=- --project=singular-server-480006-s8
    if %errorlevel% neq 0 (
        echo 警告: シークレットの作成/更新に失敗しました。手動で確認してください。
    ) else (
        echo ✓ シークレット更新完了
    )
) else (
    echo ✓ シークレット作成完了
)

echo.
echo [4/5] サービスアカウントに権限を付与中...
gcloud secrets add-iam-policy-binding gemini-api-key --member="serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=singular-server-480006-s8
if %errorlevel% neq 0 (
    echo 警告: 権限の付与に失敗しました。手動で確認してください。
) else (
    echo ✓ 権限付与完了
)

echo.
echo [5/5] バックエンドの依存関係をインストール中...
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
echo ========================================
echo セットアップ完了！
echo ========================================
echo.
echo 次のステップ: バックエンドをデプロイ
echo   cd backend
echo   gcloud app deploy app.yaml
echo.
pause

