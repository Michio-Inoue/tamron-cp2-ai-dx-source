# Google Cloud Platform へのデプロイ手順

## 現在の状態

✅ **準備完了**
- バックエンドAPI (`/api/gemini`) が実装済み
- Secret Manager対応済み
- App Engine設定ファイル (`app.yaml`) 準備済み
- デプロイメントガイド準備済み

⚠️ **注意事項**
- フロントエンドは現在、直接Gemini APIを呼び出しています
- 本番環境では、フロントエンドをバックエンドAPI経由で呼び出すように変更することを推奨します

## デプロイ手順

### 1. Google Cloud プロジェクトの準備

```bash
# Google Cloud CLIでログイン
gcloud auth login

# プロジェクトを設定（YOUR_PROJECT_IDを実際のプロジェクトIDに置き換え）
gcloud config set project YOUR_PROJECT_ID

# 必要なAPIを有効化
gcloud services enable secretmanager.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Secret ManagerにAPIキーを保存

```bash
# APIキーをSecret Managerに保存
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
    --data-file=- \
    --replication-policy="automatic"
```

または、Google Cloud Consoleから：
1. [Secret Manager](https://console.cloud.google.com/security/secret-manager)にアクセス
2. 「シークレットを作成」をクリック
3. 名前: `gemini-api-key`
4. シークレットの値: あなたのGemini APIキーを入力
5. 「作成」をクリック

### 3. サービスアカウントに権限を付与

```bash
# App Engineのデフォルトサービスアカウントに権限を付与
PROJECT_ID=$(gcloud config get-value project)
SERVICE_ACCOUNT="${PROJECT_ID}@appspot.gserviceaccount.com"

gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
```

### 4. バックエンドをApp Engineにデプロイ

```bash
cd backend

# 依存関係をインストール
npm install

# App Engineにデプロイ
gcloud app deploy app.yaml
```

デプロイが完了すると、バックエンドAPIのURLが表示されます（例: `https://YOUR_PROJECT_ID.appspot.com`）

### 5. フロントエンドのデプロイ（オプション）

#### 方法1: App Engineで静的ファイルをホスティング

`app.yaml`に静的ファイルの設定を追加：

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'

# 静的ファイルの設定を追加
handlers:
  - url: /(.*\.(html|js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))
    static_files: \1
    upload: (.*\.(html|js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))
    secure: always

  - url: /.*
    script: auto
```

その後、フロントエンドファイルを`backend/public`ディレクトリに配置してデプロイ。

#### 方法2: Firebase Hostingを使用（推奨）

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# Firebaseプロジェクトを初期化
firebase init hosting

# デプロイ
firebase deploy --only hosting
```

#### 方法3: Cloud Storage + Cloud CDNを使用

```bash
# バケットを作成
gsutil mb -p YOUR_PROJECT_ID -c STANDARD -l asia-northeast1 gs://YOUR_BUCKET_NAME

# フロントエンドファイルをアップロード
gsutil -m cp -r *.html *.js *.css gs://YOUR_BUCKET_NAME/

# バケットを公開
gsutil iam ch allUsers:objectViewer gs://YOUR_BUCKET_NAME

# Cloud CDNを有効化（オプション）
```

### 6. フロントエンドをバックエンドAPI経由で呼び出すように変更（推奨）

現在、フロントエンドは直接Gemini APIを呼び出していますが、セキュリティのため、バックエンドAPI経由で呼び出すように変更することを推奨します。

`ai-drbfm.js`のAPI呼び出し部分を以下のように変更：

```javascript
// 変更前
const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
    { ... }
);

// 変更後
const BACKEND_URL = 'https://YOUR_PROJECT_ID.appspot.com'; // またはバックエンドのURL
const response = await fetch(`${BACKEND_URL}/api/gemini`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        prompt: prompt,
        model: 'gemini-2.5-flash',
        apiVersion: 'v1beta',
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096
    })
});
```

## デプロイ後の確認

1. バックエンドAPIが動作しているか確認：
   ```bash
   curl https://YOUR_PROJECT_ID.appspot.com/
   ```

2. フロントエンドにアクセスして動作確認

3. ブラウザの開発者ツールでエラーがないか確認

## トラブルシューティング

### Secret ManagerからAPIキーが取得できない

1. サービスアカウントに適切な権限があるか確認：
   ```bash
   gcloud secrets get-iam-policy gemini-api-key
   ```

2. シークレット名が正しいか確認：
   ```bash
   gcloud secrets list
   ```

### CORSエラーが発生する

バックエンドのCORS設定を確認してください。`backend/server.js`でCORSが有効になっていることを確認。

### デプロイが失敗する

1. ログを確認：
   ```bash
   gcloud app logs tail -s default
   ```

2. ビルドログを確認：
   ```bash
   gcloud builds list
   ```

## 次のステップ

1. フロントエンドをバックエンドAPI経由で呼び出すように変更
2. カスタムドメインの設定（オプション）
3. SSL証明書の設定（自動的に設定されます）
4. モニタリングとアラートの設定

