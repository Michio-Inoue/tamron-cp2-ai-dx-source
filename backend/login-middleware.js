/**
 * ログイン認証ミドルウェア
 * ユーザー名/パスワード認証とJWTトークン管理
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// ユーザーデータファイルのパス
const USERS_FILE = path.join(__dirname, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ユーザーデータを読み込む
function loadUsers() {
    try {
        console.log('users.jsonファイルのパス:', USERS_FILE);
        console.log('users.jsonファイルの存在確認:', fs.existsSync(USERS_FILE));
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            const users = JSON.parse(data);
            console.log('users.json読み込み成功。ユーザー数:', Object.keys(users).length);
            return users;
        } else {
            console.warn('users.jsonファイルが存在しません');
        }
    } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
    }
    return {};
}

// ユーザーデータを保存する
function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('ユーザーデータの保存エラー:', error);
        return false;
    }
}

/**
 * ユーザー登録
 */
async function registerUser(username, password) {
    const users = loadUsers();
    
    // ユーザー名が既に存在するかチェック
    if (users[username]) {
        return { success: false, message: 'ユーザー名が既に使用されています' };
    }
    
    // パスワードをハッシュ化
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // ユーザーを保存
    users[username] = {
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    
    if (saveUsers(users)) {
        return { success: true, message: 'ユーザー登録が完了しました' };
    } else {
        return { success: false, message: 'ユーザー登録に失敗しました' };
    }
}

/**
 * 2FA用TOTPシークレットを生成
 */
function generateTotpSecret(username) {
    return speakeasy.generateSecret({
        name: `タムロン設計支援AIツール (${username})`,
        issuer: 'Tamron AI Tools'
    });
}

/**
 * 2FA用QRコードを生成
 */
async function generateQRCode(secret) {
    try {
        const otpauthUrl = secret.otpauth_url;
        const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
        return qrCodeDataUrl;
    } catch (error) {
        console.error('QRコード生成エラー:', error);
        return null;
    }
}

/**
 * TOTPコードを検証
 */
function verifyTotp(token, secret) {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2 // 前後2つの時間窓を許容
    });
}

/**
 * ユーザーログイン（2FA対応）
 */
async function loginUser(username, password, totpToken = null) {
    const users = loadUsers();
    
    // デバッグログ
    console.log('ログイン試行:', { username, passwordLength: password?.length, usersCount: Object.keys(users).length, hasTotpToken: !!totpToken });
    
    // ユーザーが存在するかチェック
    if (!users[username]) {
        console.log('ユーザーが見つかりません:', username);
        return { success: false, message: 'ユーザー名またはパスワードが正しくありません' };
    }
    
    // パスワードを検証
    const isValid = await bcrypt.compare(password, users[username].password);
    
    if (!isValid) {
        console.log('パスワードが一致しません');
        return { success: false, message: 'ユーザー名またはパスワードが正しくありません' };
    }
    
    // 2FAが有効な場合、TOTPコードを検証
    if (users[username].twoFactorEnabled && users[username].twoFactorSecret) {
        if (!totpToken) {
            return { 
                success: false, 
                requiresTwoFactor: true,
                message: '2段階認証コードが必要です' 
            };
        }
        
        const isTotpValid = verifyTotp(totpToken, users[username].twoFactorSecret);
        if (!isTotpValid) {
            console.log('TOTPコードが無効です');
            return { success: false, message: '2段階認証コードが正しくありません' };
        }
    }
    
    // JWTトークンを生成
    const token = jwt.sign(
        { username: username },
        JWT_SECRET,
        { expiresIn: '7d' } // 7日間有効
    );
    
    return {
        success: true,
        message: 'ログインに成功しました',
        token: token,
        username: username
    };
}

/**
 * JWTトークンを検証するミドルウェア
 */
function verifyToken(req, res, next) {
    // 認証をスキップするパス
    const skipPaths = [
        '/',
        '/health',
        '/api/health',
        '/login.html',
        '/api/login',
        '/api/logout',
        '/api/gemini',
        '/api/analyze',
        '/api/save'
    ];
    // 静的ファイル（.html, .js, .css, .png, .jpg, .icoなど）もスキップ
    const staticFileExtensions = ['.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    const isStaticFile = staticFileExtensions.some(ext => req.path.endsWith(ext));
    
    if (skipPaths.includes(req.path) || isStaticFile) {
        return next();
    }
    
    // トークンを取得（CookieまたはAuthorizationヘッダーから）
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        // トークンがない場合はログインページにリダイレクト
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: '認証が必要です', redirect: '/login.html' });
        } else {
            return res.redirect('/login.html');
        }
    }
    
    try {
        // トークンを検証
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // トークンが無効な場合
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: '認証トークンが無効です', redirect: '/login.html' });
        } else {
            return res.redirect('/login.html');
        }
    }
}

/**
 * 2FAを有効化
 */
async function enableTwoFactor(username) {
    const users = loadUsers();
    
    if (!users[username]) {
        return { success: false, message: 'ユーザーが見つかりません' };
    }
    
    // 既に2FAが有効な場合は、新しいシークレットを生成
    const secret = generateTotpSecret(username);
    const qrCode = await generateQRCode(secret);
    
    // 一時的にシークレットを保存（確認用）
    users[username].twoFactorTempSecret = secret.base32;
    
    if (saveUsers(users)) {
        return {
            success: true,
            secret: secret.base32,
            qrCode: qrCode,
            otpauthUrl: secret.otpauth_url
        };
    } else {
        return { success: false, message: '2FA設定の保存に失敗しました' };
    }
}

/**
 * 2FAを確認して有効化
 */
async function confirmTwoFactor(username, totpToken) {
    const users = loadUsers();
    
    if (!users[username]) {
        return { success: false, message: 'ユーザーが見つかりません' };
    }
    
    if (!users[username].twoFactorTempSecret) {
        return { success: false, message: '2FA設定が開始されていません' };
    }
    
    // TOTPコードを検証
    const isTotpValid = verifyTotp(totpToken, users[username].twoFactorTempSecret);
    if (!isTotpValid) {
        return { success: false, message: '2段階認証コードが正しくありません' };
    }
    
    // 2FAを有効化
    users[username].twoFactorEnabled = true;
    users[username].twoFactorSecret = users[username].twoFactorTempSecret;
    delete users[username].twoFactorTempSecret;
    
    if (saveUsers(users)) {
        return { success: true, message: '2段階認証が有効化されました' };
    } else {
        return { success: false, message: '2FA設定の保存に失敗しました' };
    }
}

/**
 * 2FAを無効化
 */
async function disableTwoFactor(username) {
    const users = loadUsers();
    
    if (!users[username]) {
        return { success: false, message: 'ユーザーが見つかりません' };
    }
    
    users[username].twoFactorEnabled = false;
    delete users[username].twoFactorSecret;
    delete users[username].twoFactorTempSecret;
    
    if (saveUsers(users)) {
        return { success: true, message: '2段階認証が無効化されました' };
    } else {
        return { success: false, message: '2FA設定の保存に失敗しました' };
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyToken,
    loadUsers,
    generateTotpSecret,
    generateQRCode,
    verifyTotp,
    enableTwoFactor,
    confirmTwoFactor,
    disableTwoFactor
};
