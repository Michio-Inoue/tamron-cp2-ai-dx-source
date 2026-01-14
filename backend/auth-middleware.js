/**
 * 認証ミドルウェア
 * APIキーまたはGoogle Identity Tokenを検証
 */

// Secret Managerのインポート（Google Cloud環境でのみ使用）
let SecretManagerServiceClient;
let secretClient;

// Google Cloud環境かどうかを判定
const isGoogleCloud = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;

if (isGoogleCloud) {
    try {
        SecretManagerServiceClient = require('@google-cloud/secret-manager').SecretManagerServiceClient;
        secretClient = new SecretManagerServiceClient();
    } catch (error) {
        console.warn('Secret Managerクライアントの初期化に失敗しました:', error.message);
    }
}

// APIキーをキャッシュ
let cachedApiKey = null;
let cacheExpiry = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5分間キャッシュ

/**
 * APIキーを取得（Secret Managerまたは環境変数から）
 */
async function getApiKey() {
    // ローカル環境の場合は環境変数から取得
    if (!isGoogleCloud) {
        const apiKey = process.env.API_ACCESS_KEY || process.env.BACKEND_API_KEY;
        if (apiKey) {
            return apiKey;
        }
        // ローカル開発環境では、デフォルトのAPIキーを使用（本番環境では使用しない）
        return process.env.DEV_API_KEY || 'dev-api-key-12345';
    }

    // キャッシュが有効な場合はキャッシュを返す
    if (cachedApiKey && cacheExpiry && Date.now() < cacheExpiry) {
        return cachedApiKey;
    }

    try {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
        const secretName = process.env.BACKEND_API_KEY_SECRET_NAME || 'backend-api-key';
        
        if (!secretClient) {
            // Secret Managerが使用できない場合は、環境変数から取得
            return process.env.BACKEND_API_KEY || process.env.API_ACCESS_KEY;
        }
        
        const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
        const [version] = await secretClient.accessSecretVersion({ name });
        
        cachedApiKey = version.payload.data.toString().trim();
        cacheExpiry = Date.now() + CACHE_DURATION;
        
        return cachedApiKey;
    } catch (error) {
        console.error('Secret ManagerからAPIキーの取得に失敗:', error);
        // フォールバック: 環境変数から取得
        return process.env.BACKEND_API_KEY || process.env.API_ACCESS_KEY;
    }
}

/**
 * 認証ミドルウェア
 * APIキーまたはGoogle Identity Tokenを検証
 */
async function authenticateRequest(req, res, next) {
    // OPTIONSリクエストはスキップ
    if (req.method === 'OPTIONS') {
        return next();
    }

    // 認証方法1: APIキー（ヘッダーまたはボディから）
    const apiKey = (req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '') || req.body?.apiKey)?.trim();
    
    console.log('認証リクエスト:', {
        path: req.path,
        method: req.method,
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey ? apiKey.length : 0
    });
    
    if (apiKey) {
        try {
            const validApiKey = await getApiKey();
            const trimmedValidKey = validApiKey ? validApiKey.trim() : '';
            console.log('有効なAPIキーを取得:', {
                hasValidKey: !!validApiKey,
                validKeyLength: trimmedValidKey.length,
                providedKeyLength: apiKey ? apiKey.length : 0,
                keysMatch: apiKey === trimmedValidKey
            });
            
            if (apiKey === trimmedValidKey) {
                // APIキーが有効
                console.log('認証成功');
                return next();
            } else {
                console.log('APIキーが一致しません');
            }
        } catch (error) {
            console.error('APIキー検証エラー:', error);
        }
    } else {
        console.log('APIキーが提供されていません');
    }

    // 認証方法2: Google Identity Token（将来の実装用）
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // TODO: Google Identity Tokenの検証を実装
        // 現時点では、APIキーを使用
    }

    // 認証に失敗
    res.status(401).json({
        error: '認証が必要です',
        message: 'APIキーまたは認証トークンが必要です'
    });
}

/**
 * 特定のエンドポイントのみ認証をスキップ
 */
function skipAuthForPaths(paths) {
    return (req, res, next) => {
        if (paths.some(path => req.path.startsWith(path))) {
            return next();
        }
        return authenticateRequest(req, res, next);
    };
}

module.exports = {
    authenticateRequest,
    skipAuthForPaths,
    getApiKey
};
