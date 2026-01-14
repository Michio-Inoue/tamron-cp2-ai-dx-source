# セキュアなAPIアクセスの設定方法

## 概要

`allUsers`への公開アクセスを許可せず、APIキーを使用した認証を実装しました。

## 実装内容

### 1. 認証ミドルウェアの追加

`backend/auth-middleware.js`を作成し、APIキー検証機能を実装しました。

### 2. APIキーの管理

- **本番環境**: Secret Managerに`backend-api-key`という名前で保存
- **ローカル環境**: 環境変数`BACKEND_API_KEY`または`API_ACCESS_KEY`から取得

### 3. 認証方法

フロントエンドからAPIを呼び出す際に、以下のいずれかの方法でAPIキーを送信：

#### 方法1: ヘッダーにAPIキーを追加（推奨）

```javascript
fetch('https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'YOUR_API_KEY'  // APIキーを追加
    },
    body: JSON.stringify({ ... })
});
```

#### 方法2: Authorizationヘッダーに追加

```javascript
fetch('https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'  // Bearerトークンとして送信
    },
    body: JSON.stringify({ ... })
});
```

#### 方法3: リクエストボディに追加

```javascript
fetch('https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        apiKey: 'YOUR_API_KEY',  // ボディにAPIキーを追加
        contents: [...],
        ...
    })
});
```

## セットアップ手順

### 1. Secret ManagerにAPIキーを保存

```powershell
# ランダムなAPIキーを生成
$apiKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Secret Managerに保存
echo $apiKey | gcloud secrets create backend-api-key --data-file=- --project=tamron-cloudrun-prod-new

# または既存のシークレットにバージョンを追加
echo $apiKey | gcloud secrets versions add backend-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### 2. 環境変数を設定

`cloudbuild.yaml`に環境変数を追加：

```yaml
- '--set-env-vars'
- 'GEMINI_API_KEY_SECRET_NAME=gemini-api-key,NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,BACKEND_API_KEY_SECRET_NAME=backend-api-key'
```

### 3. フロントエンドを更新

`ai-drbfm.js`を更新して、APIキーを送信するようにします。

## セキュリティ上の注意事項

1. **APIキーの管理**
   - APIキーはSecret Managerで管理
   - フロントエンドに埋め込む場合は、レート制限などの追加保護を検討

2. **HTTPSの使用**
   - すべての通信はHTTPS経由で行う

3. **レート制限**
   - 必要に応じて、レート制限を追加することを推奨

4. **CORS設定**
   - 必要に応じて、CORS設定を特定のドメインに制限

## フロントエンドの更新

`ai-drbfm.js`を更新して、APIキーを送信するようにします：

```javascript
// APIキーを設定（環境変数または設定ファイルから取得）
const BACKEND_API_KEY = window.BACKEND_API_KEY || 'YOUR_API_KEY';

// API呼び出し時にAPIキーを追加
const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BACKEND_API_KEY  // APIキーを追加
    },
    body: JSON.stringify({ ... })
});
```

## テスト方法

```powershell
# APIキーを取得
$apiKey = gcloud secrets versions access latest --secret=backend-api-key --project=tamron-cloudrun-prod-new

# APIをテスト
$headers = @{
    'Content-Type' = 'application/json'
    'X-API-Key' = $apiKey
}
$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Hello, world!"
                }
            )
        }
    )
    generationConfig = @{
        temperature = 0.7
        maxOutputTokens = 100
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini" -Method POST -Headers $headers -Body $body
```
