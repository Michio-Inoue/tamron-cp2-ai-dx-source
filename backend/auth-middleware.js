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
 * APIキーまたはJWTトークンを検証
 */
async function authenticateRequest(req, res, next) {
    // OPTIONSリクエストはスキップ
    if (req.method === 'OPTIONS') {
        return next();
    }

    console.log('認証リクエスト:', {
        path: req.path,
        method: req.method,
        hasCookies: !!req.cookies,
        cookieKeys: req.cookies ? Object.keys(req.cookies) : [],
        hasXApiKey: !!req.headers['x-api-key'],
        hasAuthorization: !!req.headers['authorization']
    });

    // 認証方法1: APIキー（ヘッダーまたはボディから）
    const apiKey = (req.headers['x-api-key'] || req.body?.apiKey)?.trim();
    
    if (apiKey) {
        try {
            const validApiKey = await getApiKey();
            const trimmedValidKey = validApiKey ? validApiKey.trim() : '';
            
            if (apiKey === trimmedValidKey) {
                // APIキーが有効
                console.log('認証成功（APIキー）');
                return next();
            }
        } catch (error) {
            console.error('APIキー検証エラー:', error);
        }
    }

    // 認証方法2: JWTトークン（CookieまたはAuthorizationヘッダーから）
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    // Cookieからトークンを取得
    const tokenFromCookie = req.cookies?.token;
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    const token = tokenFromCookie || tokenFromHeader;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded; // リクエストにユーザー情報を追加
            console.log('認証成功（JWTトークン）:', decoded.username);
            return next();
        } catch (error) {
            console.log('JWTトークン検証失敗:', error.message);
        }
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
