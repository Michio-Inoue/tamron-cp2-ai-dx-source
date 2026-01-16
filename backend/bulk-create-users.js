/**
 * 一括ユーザー登録スクリプト
 * 使用方法: node bulk-create-users.js
 */

const { registerUser } = require('./login-middleware');

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

async function bulkCreateUsers() {
    console.log('=== 一括ユーザー登録を開始します ===\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const username of users) {
        try {
            console.log(`ユーザー "${username}" を登録しています...`);
            const result = await registerUser(username, password);
            
            if (result.success) {
                console.log(`✓ ユーザー "${username}" の登録が完了しました`);
                successCount++;
            } else {
                console.error(`✗ ユーザー "${username}" の登録に失敗: ${result.message}`);
                failCount++;
            }
        } catch (error) {
            console.error(`✗ ユーザー "${username}" の登録中にエラーが発生:`, error.message);
            failCount++;
        }
        console.log('');
    }
    
    console.log('=== 登録完了 ===');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${failCount}件`);
    console.log(`合計: ${users.length}件`);
}

bulkCreateUsers().catch(error => {
    console.error('エラーが発生しました:', error);
    process.exit(1);
});
