@echo off
echo ローカルサーバーを起動しています...
echo.
echo ブラウザで以下のURLにアクセスしてください:
echo http://localhost:8000/ai-drbfm.html
echo.
echo サーバーを停止するには、Ctrl+C を押してください
echo.

REM Python 3が利用可能か確認
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python 3を使用してサーバーを起動します...
    python -m http.server 8000
    goto :end
)

REM Node.jsが利用可能か確認
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Node.jsを使用してサーバーを起動します...
    npx http-server -p 8000
    goto :end
)

echo エラー: Python 3またはNode.jsがインストールされていません。
echo Python 3をインストールするか、Node.jsをインストールしてください。
pause

:end


