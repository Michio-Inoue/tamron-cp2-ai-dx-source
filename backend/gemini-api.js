/**
 * Google Cloud Functions用のGemini APIプロキシ
 * Secret ManagerからAPIキーを取得してGemini APIを呼び出す
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
        console.warn('Secret Managerクライアントの初期化に失敗しました（ローカル環境の可能性があります）:', error.message);
    }
}

// Secret ManagerからAPIキーを取得（キャッシュ付き）
let cachedApiKey = null;
let cacheExpiry = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5分間キャッシュ

async function getApiKey() {
    // ローカル環境の場合は環境変数から取得
    if (!isGoogleCloud) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            console.log('APIキーを環境変数から取得しました（ローカル環境）');
            return apiKey;
        } else {
            throw new Error('ローカル環境ではGEMINI_API_KEY環境変数が必要です');
        }
    }

    // キャッシュが有効な場合はキャッシュを返す
    if (cachedApiKey && cacheExpiry && Date.now() < cacheExpiry) {
        return cachedApiKey;
    }

    try {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
        const secretName = process.env.GEMINI_API_KEY_SECRET_NAME || 'gemini-api-key';
        
        if (!secretClient) {
            throw new Error('Secret Managerクライアントが初期化されていません');
        }
        
        const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
        const [version] = await secretClient.accessSecretVersion({ name });
        
        cachedApiKey = version.payload.data.toString();
        cacheExpiry = Date.now() + CACHE_DURATION;
        
        console.log('APIキーをSecret Managerから取得しました');
        return cachedApiKey;
    } catch (error) {
        console.error('Secret ManagerからAPIキーの取得に失敗:', error);
        throw new Error('APIキーの取得に失敗しました');
    }
}

/**
 * Gemini APIを呼び出す
 */
async function callGeminiAPI(prompt, options = {}) {
    const apiKey = await getApiKey();
    const model = options.model || 'gemini-2.5-flash';
    const apiVersion = options.apiVersion || 'v1beta';
    
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
    
    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: options.temperature || 0.7,
            topK: options.topK || 40,
            topP: options.topP || 0.95,
            maxOutputTokens: options.maxOutputTokens || 4096
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini APIエラー:', response.status, errorText);
        throw new Error(`Gemini API呼び出しに失敗: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

/**
 * Cloud Functions用のエクスポート
 */
exports.geminiProxy = async (req, res) => {
    // CORS設定
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { prompt, model, apiVersion, temperature, topK, topP, maxOutputTokens } = req.body;

        if (!prompt) {
            res.status(400).json({ error: 'プロンプトが指定されていません' });
            return;
        }

        console.log('Gemini APIプロキシリクエスト:', {
            promptLength: prompt.length,
            model,
            apiVersion
        });

        const result = await callGeminiAPI(prompt, {
            model,
            apiVersion,
            temperature,
            topK,
            topP,
            maxOutputTokens
        });

        res.json(result);
    } catch (error) {
        console.error('Gemini APIプロキシエラー:', error);
        res.status(500).json({
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

