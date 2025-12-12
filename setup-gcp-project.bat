@echo off
echo ========================================
echo Google Cloud プロジェクト設定スクリプト
echo ========================================
echo.

echo プロジェクトID: singular-server-480006-s8
echo プロジェクト名: Tamron-cp2-AI-DX
echo.

echo [1/4] 認証を確認しています...
gcloud auth list
if %errorlevel% neq 0 (
    echo 認証が必要です。ブラウザが開きます...
    gcloud auth login
)

echo.
echo [2/4] プロジェクトを設定しています...
gcloud config set project singular-server-480006-s8

echo.
echo [3/4] 現在のプロジェクトを確認しています...
gcloud config get-value project

echo.
echo [4/4] プロジェクト情報を確認しています...
gcloud projects describe singular-server-480006-s8 --format="table(projectId,name,projectNumber)"

echo.
echo ========================================
echo 設定完了！
echo ========================================
echo.
echo 次のステップ:
echo 1. Secret ManagerにAPIキーを保存
echo 2. サービスアカウントに権限を付与
echo 3. バックエンドをデプロイ
echo.
pause

