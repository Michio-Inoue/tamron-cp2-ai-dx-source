const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const GiteaAPI = require('./gitea-api');
const { geminiProxy } = require('./gemini-api');
const { authenticateRequest, skipAuthForPaths } = require('./auth-middleware');
const { registerUser, loginUser, verifyToken, enableTwoFactor, confirmTwoFactor, disableTwoFactor } = require('./login-middleware');

const app = express();
const port = process.env.PORT || 8080;

// ファイルアップロード用の設定
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ミドルウェアの設定
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイルの配信（フロントエンド）
app.use(express.static(path.join(__dirname, 'public')));

// ログイン認証ミドルウェア（静的ファイルとログインAPI以外に適用）
app.use(verifyToken);

// 認証をスキップするパス（公開エンドポイント）
// /api/gemini, /api/analyze, /api/saveはauthenticateRequestで認証されるため、verifyTokenをスキップ
app.use(skipAuthForPaths(['/', '/health', '/api/health', '/login.html', '/api/login', '/api/login-2fa', '/setup-2fa.html', '/api/2fa/enable', '/api/2fa/confirm', '/api/2fa/disable', '/api/gemini', '/api/analyze', '/api/save']));

// 認証が必要なエンドポイント
app.use('/api/gemini', authenticateRequest);
app.use('/api/analyze', authenticateRequest);
app.use('/api/save', authenticateRequest);

// ログインページのエンドポイント（認証不要）
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ログインAPI（認証不要、2FA対応）
app.post('/api/login', async (req, res) => {
    try {
        const { username, password, totpToken } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'ユーザー名とパスワードが必要です' 
            });
        }
        
        const result = await loginUser(username, password, totpToken);
        
        if (result.success) {
            // JWTトークンをCookieに設定
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7日間
            });
            res.json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'ログイン中にエラーが発生しました' 
        });
    }
});

// 2FA設定ページのエンドポイント（認証必要）
app.get('/setup-2fa.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'setup-2fa.html'));
});

// 2FA有効化API（認証必要）
app.post('/api/2fa/enable', async (req, res) => {
    try {
        const username = req.user?.username;
        if (!username) {
            return res.status(401).json({ success: false, message: '認証が必要です' });
        }
        
        const result = await enableTwoFactor(username);
        res.json(result);
    } catch (error) {
        console.error('2FA enable error:', error);
        res.status(500).json({ 
            success: false, 
            message: '2FA設定中にエラーが発生しました' 
        });
    }
});

// 2FA確認API（認証必要）
app.post('/api/2fa/confirm', async (req, res) => {
    try {
        const { totpToken } = req.body;
        const username = req.user?.username;
        
        if (!username) {
            return res.status(401).json({ success: false, message: '認証が必要です' });
        }
        
        if (!totpToken) {
            return res.status(400).json({ success: false, message: '2段階認証コードが必要です' });
        }
        
        const result = await confirmTwoFactor(username, totpToken);
        res.json(result);
    } catch (error) {
        console.error('2FA confirm error:', error);
        res.status(500).json({ 
            success: false, 
            message: '2FA確認中にエラーが発生しました' 
        });
    }
});

// 2FA無効化API（認証必要）
app.post('/api/2fa/disable', async (req, res) => {
    try {
        const username = req.user?.username;
        if (!username) {
            return res.status(401).json({ success: false, message: '認証が必要です' });
        }
        
        const result = await disableTwoFactor(username);
        res.json(result);
    } catch (error) {
        console.error('2FA disable error:', error);
        res.status(500).json({ 
            success: false, 
            message: '2FA無効化中にエラーが発生しました' 
        });
    }
});

// ログアウトAPI
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'ログアウトしました' });
});

// ルートエンドポイント（認証不要）- メインページを配信
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// AI-DRBFMページのエンドポイント（認証必要）
app.get('/ai-drbfm.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-drbfm.html'));
});

// ヘルスチェックエンドポイント（認証不要）
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gitea接続テストエンドポイント
app.post('/api/gitea/test-connection', async (req, res) => {
    try {
        const { serverUrl, token } = req.body;
        
        if (!serverUrl || !token) {
            return res.status(400).json({ 
                success: false, 
                message: 'サーバーURLとトークンが必要です' 
            });
        }

        const gitea = new GiteaAPI({ serverUrl, token });
        const result = await gitea.testConnection();
        
        res.json(result);
    } catch (error) {
        console.error('Gitea connection test error:', error);
        res.status(500).json({ 
            success: false, 
            message: '接続テスト中にエラーが発生しました' 
        });
    }
});

// リポジトリ確認エンドポイント
app.post('/api/gitea/check-repository', async (req, res) => {
    try {
        const { serverUrl, token, repoOwner, repoName } = req.body;
        
        if (!serverUrl || !token || !repoOwner || !repoName) {
            return res.status(400).json({ 
                success: false, 
                message: '必要なパラメータが不足しています' 
            });
        }

        const gitea = new GiteaAPI({ serverUrl, token });
        const result = await gitea.checkRepository(repoOwner, repoName);
        
        res.json(result);
    } catch (error) {
        console.error('Repository check error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'リポジトリ確認中にエラーが発生しました' 
        });
    }
});

// ファイルアップロードエンドポイント
app.post('/api/gitea/upload', upload.array('files'), async (req, res) => {
    try {
        const { serverUrl, token, repoOwner, repoName, branch, message } = req.body;
        const files = req.files;
        
        if (!serverUrl || !token || !repoOwner || !repoName || !files) {
            return res.status(400).json({ 
                success: false, 
                message: '必要なパラメータが不足しています' 
            });
        }

        const gitea = new GiteaAPI({ 
            serverUrl, 
            token, 
            repoOwner, 
            repoName 
        });

        const results = [];
        
        for (const file of files) {
            const result = await gitea.uploadFile(
                file.path,
                file.originalname,
                branch || 'main',
                message || `Upload ${file.originalname} via API`
            );
            
            results.push({
                file: file.originalname,
                ...result
            });
            
            // 一時ファイルを削除
            fs.unlinkSync(file.path);
        }
        
        res.json({
            success: true,
            results: results,
            message: 'ファイルのアップロードが完了しました'
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'ファイルアップロード中にエラーが発生しました' 
        });
    }
});

// ブランチ一覧取得エンドポイント
app.post('/api/gitea/branches', async (req, res) => {
    try {
        const { serverUrl, token, repoOwner, repoName } = req.body;
        
        if (!serverUrl || !token || !repoOwner || !repoName) {
            return res.status(400).json({ 
                success: false, 
                message: '必要なパラメータが不足しています' 
            });
        }

        const gitea = new GiteaAPI({ 
            serverUrl, 
            token, 
            repoOwner, 
            repoName 
        });
        
        const result = await gitea.getBranches();
        res.json(result);
    } catch (error) {
        console.error('Branches fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'ブランチ一覧の取得中にエラーが発生しました' 
        });
    }
});

// プルリクエスト作成エンドポイント
app.post('/api/gitea/create-pr', async (req, res) => {
    try {
        const { 
            serverUrl, 
            token, 
            repoOwner, 
            repoName, 
            title, 
            body, 
            headBranch, 
            baseBranch 
        } = req.body;
        
        if (!serverUrl || !token || !repoOwner || !repoName || !title || !headBranch) {
            return res.status(400).json({ 
                success: false, 
                message: '必要なパラメータが不足しています' 
            });
        }

        const gitea = new GiteaAPI({ 
            serverUrl, 
            token, 
            repoOwner, 
            repoName 
        });
        
        const result = await gitea.createPullRequest(
            title,
            body || '',
            headBranch,
            baseBranch || 'main'
        );
        
        res.json(result);
    } catch (error) {
        console.error('Pull request creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'プルリクエスト作成中にエラーが発生しました' 
        });
    }
});

// AI分析エンドポイント
app.post('/api/analyze', (req, res) => {
    try {
        const { designChanges, currentDesign, targetDesign } = req.body;
        
        // ここにAI分析ロジックを実装
        const analysis = {
            risks: [
                {
                    category: '構造的影響',
                    description: '強度低下の可能性',
                    severity: 'HIGH',
                    recommendations: ['応力解析の実施', '材料強度の再確認']
                },
                // 他のリスク項目
            ],
            recommendations: [
                '設計レビューの実施',
                '試作評価の検討',
                'FEA解析による検証'
            ],
            confidence: 0.85
        };

        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: '分析中にエラーが発生しました' });
    }
});

// テンプレート取得エンドポイント
app.get('/api/templates', (req, res) => {
    const templates = [
        {
            id: 1,
            name: '構造変更テンプレート',
            categories: ['構造', '強度', '耐久性']
        },
        {
            id: 2,
            name: '材料変更テンプレート',
            categories: ['材料特性', '環境影響', 'コスト']
        }
    ];
    res.json(templates);
});

// 分析結果保存エンドポイント
app.post('/api/save', (req, res) => {
    try {
        const analysisResult = req.body;
        // ここに保存ロジックを実装
        res.json({ message: '分析結果が保存されました', id: Date.now() });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ error: '保存中にエラーが発生しました' });
    }
});

// Gemini APIプロキシエンドポイント（Secret Manager使用）
app.post('/api/gemini', geminiProxy);

// サーバーの起動
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 