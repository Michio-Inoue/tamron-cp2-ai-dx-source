# 403エラーの解決方法：認証トークンを使用

## 問題の原因

ブラウザから直接Cloud Run APIを呼び出す場合、認証情報が自動的に送信されないため、403エラーが発生します。

## 解決方法

### 方法1: Google Identity Tokenを使用（推奨）

ユーザーがGoogleアカウントでログインしている場合、Identity Tokenを使用してAPIを呼び出すことができます。

#### 実装手順

1. **Google Identity Servicesライブラリを読み込む**
2. **認証トークンを取得**
3. **API呼び出し時にトークンをヘッダーに追加**

### 方法2: 公開アクセスを許可する

組織ポリシーで許可されている場合、`allUsers`に`roles/run.invoker`を付与することで、認証なしでアクセスできます。

### 方法3: バックエンドで認証をスキップする（開発環境のみ）

開発環境では、バックエンドAPIを認証不要にすることもできますが、本番環境では推奨されません。

## 実装コード

### フロントエンド側（ai-drbfm.js）

```javascript
// Google Identity Tokenを取得してAPIを呼び出す
async function callBackendAPI(url, options) {
    try {
        // Google Identity Tokenを取得
        const token = await getGoogleIdentityToken();
        
        // 認証ヘッダーを追加
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        return response;
    } catch (error) {
        console.error('API呼び出しエラー:', error);
        throw error;
    }
}

// Google Identity Tokenを取得
async function getGoogleIdentityToken() {
    try {
        // gcloud CLIがインストールされている場合
        // ただし、ブラウザからは直接呼び出せないため、
        // バックエンドプロキシ経由で取得する必要があります
        
        // または、Google Identity Servicesを使用
        // https://developers.google.com/identity/gsi/web
        
        return null; // 実装が必要
    } catch (error) {
        console.error('トークン取得エラー:', error);
        return null;
    }
}
```

## 最も簡単な解決方法

**Google Cloud Consoleから`allUsers`に公開アクセスを許可する**のが最も簡単です。

1. Cloud Runサービスページを開く
2. 「権限」タブをクリック
3. 「プリンシパルを追加」をクリック
4. `allUsers`に`Cloud Run 起動元`ロールを付与

これで、認証なしでAPIにアクセスできるようになります。
