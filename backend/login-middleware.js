/**
 * ログイン認証ミドルウェア
 * ユーザー名/パスワード認証とJWTトークン管理
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
 * ユーザーログイン
 */
async function loginUser(username, password) {
    const users = loadUsers();
    
    // デバッグログ
    console.log('ログイン試行:', { username, passwordLength: password?.length, usersCount: Object.keys(users).length });
    console.log('登録されているユーザー:', Object.keys(users));
    
    // ユーザーが存在するかチェック
    if (!users[username]) {
        console.log('ユーザーが見つかりません:', username);
        return { success: false, message: 'ユーザー名またはパスワードが正しくありません' };
    }
    
    // パスワードを検証
    const isValid = await bcrypt.compare(password, users[username].password);
    
    console.log('パスワード検証結果:', { isValid, providedPassword: password, storedHash: users[username].password?.substring(0, 20) + '...' });
    
    if (!isValid) {
        console.log('パスワードが一致しません');
        return { success: false, message: 'ユーザー名またはパスワードが正しくありません' };
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
    const skipPaths = ['/', '/health', '/api/health', '/login.html', '/api/login', '/api/logout'];
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

module.exports = {
    registerUser,
    loginUser,
    verifyToken,
    loadUsers
};
