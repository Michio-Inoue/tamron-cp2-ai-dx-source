const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS設定
app.use(cors());
app.use(express.json());

// Reactアプリの起動状態を管理
let appProcess = null;
let isStarting = false;

// Reactアプリを起動する関数
function launchReactApp() {
    return new Promise((resolve, reject) => {
        if (isStarting) {
            reject(new Error('アプリは既に起動中です'));
            return;
        }

        isStarting = true;

        // frontendディレクトリのパスを取得
        const frontendPath = path.join(__dirname, '..', 'frontend');
        
        console.log('Reactアプリを起動中...');
        console.log('パス:', frontendPath);

        // npm run devコマンドを実行
        appProcess = spawn('npm', ['run', 'dev'], {
            cwd: frontendPath,
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true
        });

        let output = '';
        let errorOutput = '';

        // 標準出力の処理
        appProcess.stdout.on('data', (data) => {
            const message = data.toString();
            output += message;
            console.log('React App:', message);

            // 起動完了の判定
            if (message.includes('Local:') || message.includes('localhost:5173')) {
                isStarting = false;
                resolve({
                    success: true,
                    message: 'Reactアプリが正常に起動しました',
                    output: output
                });
            }
        });

        // エラー出力の処理
        appProcess.stderr.on('data', (data) => {
            const message = data.toString();
            errorOutput += message;
            console.error('React App Error:', message);
        });

        // プロセス終了の処理
        appProcess.on('close', (code) => {
            isStarting = false;
            if (code !== 0) {
                reject(new Error(`アプリの起動に失敗しました (終了コード: ${code})\n${errorOutput}`));
            }
        });

        // タイムアウト処理（30秒）
        setTimeout(() => {
            if (isStarting) {
                isStarting = false;
                if (appProcess) {
                    appProcess.kill();
                }
                reject(new Error('アプリの起動がタイムアウトしました'));
            }
        }, 30000);
    });
}

// APIエンドポイント: Reactアプリを起動
app.post('/api/launch-app', async (req, res) => {
    try {
        const result = await launchReactApp();
        res.json(result);
    } catch (error) {
        console.error('起動エラー:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// APIエンドポイント: アプリの状態を確認
app.get('/api/app-status', (req, res) => {
    res.json({
        isRunning: appProcess !== null && !appProcess.killed,
        isStarting: isStarting
    });
});

// APIエンドポイント: アプリを停止
app.post('/api/stop-app', (req, res) => {
    if (appProcess && !appProcess.killed) {
        appProcess.kill();
        appProcess = null;
        res.json({ success: true, message: 'アプリを停止しました' });
    } else {
        res.json({ success: false, message: 'アプリは実行されていません' });
    }
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`起動APIサーバーがポート${PORT}で起動しました`);
    console.log(`APIエンドポイント: http://localhost:${PORT}/api/launch-app`);
});

module.exports = app; 