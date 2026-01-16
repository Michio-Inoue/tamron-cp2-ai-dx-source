# 403エラーの解決方法：認証ト�Eクンを使用

## 問題�E原因

ブラウザから直接Cloud Run APIを呼び出す場合、認証惁E��が�E動的に送信されなぁE��め、E03エラーが発生します、E

## 解決方況E

### 方況E: Google Identity Tokenを使用�E�推奨�E�E

ユーザーがGoogleアカウントでログインしてぁE��場合、Identity Tokenを使用してAPIを呼び出すことができます、E

#### 実裁E��頁E

1. **Google Identity Servicesライブラリを読み込む**
2. **認証ト�Eクンを取征E*
3. **API呼び出し時にト�Eクンを�EチE��ーに追加**

### 方況E: 公開アクセスを許可する

絁E���Eリシーで許可されてぁE��場合、`allUsers`に`roles/run.invoker`を付与することで、認証なしでアクセスできます、E

### 方況E: バックエンドで認証をスキチE�Eする�E�開発環墁E�Eみ�E�E

開発環墁E��は、バチE��エンドAPIを認証不要にすることもできますが、本番環墁E��は推奨されません、E

## 実裁E��ーチE

### フロントエンド�E�E�Ei-drbfm.js�E�E

```javascript
// Google Identity Tokenを取得してAPIを呼び出ぁE
async function callBackendAPI(url, options) {
    try {
        // Google Identity Tokenを取征E
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

// Google Identity Tokenを取征E
async function getGoogleIdentityToken() {
    try {
        // gcloud CLIがインスト�EルされてぁE��場吁E
        // ただし、ブラウザからは直接呼び出せなぁE��め、E
        // バックエンド�Eロキシ経由で取得する忁E��がありまぁE
        
        // また�E、Google Identity Servicesを使用
        // https://developers.google.com/identity/gsi/web
        
        return null; // 実裁E��忁E��E
    } catch (error) {
        console.error('ト�Eクン取得エラー:', error);
        return null;
    }
}
```

## 最も簡単な解決方況E

**Google Cloud Consoleから`allUsers`に公開アクセスを許可する**のが最も簡単です、E

1. Cloud Runサービスペ�Eジを開ぁE
2. 「権限」タブをクリチE��
3. 「�Eリンシパルを追加」をクリチE��
4. `allUsers`に`Cloud Run 起動�E`ロールを付丁E

これで、認証なしでAPIにアクセスできるようになります、E
