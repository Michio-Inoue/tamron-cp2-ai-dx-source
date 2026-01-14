/**
 * 初期ユーザーデータ生成スクリプト
 * Node.jsがインストールされている環境で実行してください
 * 使用方法: node generate-users.js
 */

const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// 登録するユーザーリスト
const users = [
    '0400259',
    '2400125',
    '0800623',
    '2000156',
    '9700402',
    '9800244',
    '1200153',
    '0700674',
    '0400671',
    '2300051',
    '1700111',
    '1800242',
    '2500213',
    '2100048',
    '2300291',
    '1900216',
    '1200245',
    '0400275',
    '2500353'
];

// 共通パスワード
const password = 'init00';

// users.jsonファイルのパス
const USERS_FILE = path.join(__dirname, 'users.json');

async function generateUsers() {
    console.log('=== 初期ユーザーデータを生成します ===\n');
    
    const usersData = {};
    const saltRounds = 10;
    
    // 既存のユーザーデータを読み込む（存在する場合）
    if (fs.existsSync(USERS_FILE)) {
        try {
            const existingData = fs.readFileSync(USERS_FILE, 'utf8');
            Object.assign(usersData, JSON.parse(existingData));
            console.log('既存のユーザーデータを読み込みました\n');
        } catch (error) {
            console.log('既存のユーザーデータの読み込みに失敗しました（新規作成します）\n');
        }
    }
    
    for (const username of users) {
        // 既に存在する場合はスキップ
        if (usersData[username]) {
            console.log(`ユーザー "${username}" は既に存在するためスキップします`);
            continue;
        }
        
        try {
            console.log(`ユーザー "${username}" のパスワードをハッシュ化しています...`);
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            usersData[username] = {
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };
            
            console.log(`✓ ユーザー "${username}" を追加しました`);
        } catch (error) {
            console.error(`✗ ユーザー "${username}" の処理中にエラーが発生:`, error.message);
        }
    }
    
    // users.jsonファイルに保存
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2), 'utf8');
        console.log(`\n✓ users.jsonファイルを保存しました: ${USERS_FILE}`);
        console.log(`登録されたユーザー数: ${Object.keys(usersData).length}件`);
    } catch (error) {
        console.error('✗ users.jsonファイルの保存に失敗しました:', error.message);
        process.exit(1);
    }
}

generateUsers().catch(error => {
    console.error('エラーが発生しました:', error);
    process.exit(1);
});
