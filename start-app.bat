@echo off
echo Giteaプッシュアプリを起動中...
echo.

cd /d "%~dp0frontend"
echo frontendディレクトリに移動しました
echo.

echo npm run devを実行中...
npm run dev

pause 