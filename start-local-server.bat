@echo off
echo ローカルサーバ�Eを起動してぁE��ぁE..
echo.
echo ブラウザで以下�EURLにアクセスしてください:
echo http://localhost:8000/ai-drbfm.html
echo.
echo サーバ�Eを停止するには、Ctrl+C を押してください
echo.

REM Python 3が利用可能か確誁E
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python 3を使用してサーバ�Eを起動しまぁE..
    python -m http.server 8000
    goto :end
)

REM Node.jsが利用可能か確誁E
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Node.jsを使用してサーバ�Eを起動しまぁE..
    npx http-server -p 8000
    goto :end
)

echo エラー: Python 3また�ENode.jsがインスト�EルされてぁE��せん、E
echo Python 3をインスト�Eルするか、Node.jsをインスト�Eルしてください、E
pause

:end



