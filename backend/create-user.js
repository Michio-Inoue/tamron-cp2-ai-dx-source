/**
 * 管理者用: ユーザーを事前登録するスクリプト
 * 使用方法: node create-user.js <username> <password>
 */

const { registerUser } = require('./login-middleware');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createUser() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('使用方法: node create-user.js <username> <password>');
        console.log('例: node create-user.js admin password123');
        process.exit(1);
    }
    
    const username = args[0];
    const password = args[1];
    
    if (password.length < 6) {
        console.error('エラー: パスワードは6文字以上である必要があります');
        process.exit(1);
    }
    
    console.log(`ユーザー "${username}" を登録しています...`);
    
    const result = await registerUser(username, password);
    
    if (result.success) {
        console.log('✓ ユーザー登録が完了しました');
        console.log(`  ユーザー名: ${username}`);
    } else {
        console.error('✗ ユーザー登録に失敗しました');
        console.error(`  エラー: ${result.message}`);
        process.exit(1);
    }
    
    rl.close();
}

createUser().catch(error => {
    console.error('エラーが発生しました:', error);
    process.exit(1);
});
