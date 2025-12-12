# Google Cloud セットアップ手順

## プロジェクト情報
- **プロジェクト名**: Tamron-cp2-AI-DX
- **プロジェクトID**: `singular-server-480006-s8`

## 手動セットアップ手順

### ステップ1: 再認証とプロジェクト設定

PowerShellまたはコマンドプロンプトで以下を実行：

```bash
# 1. 再認証（ブラウザが開きます）
gcloud auth login

# 2. プロジェクトを設定
gcloud config set project singular-server-480006-s8

# 3. 設定を確認
gcloud config get-value project
```

### ステップ2: 必要なAPIを有効化

```bash
gcloud services enable secretmanager.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### ステップ3: Secret ManagerにAPIキーを保存

```bash
# 方法1: コマンドラインから（推奨）
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=- --replication-policy="automatic"

# 方法2: Google Cloud Consoleから
# 1. https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8 にアクセス
# 2. 「シークレットを作成」をクリック
# 3. 名前: gemini-api-key
# 4. シークレットの値: あなたのGemini APIキーを入力
# 5. 「作成」をクリック
```

**注意**: `YOUR_GEMINI_API_KEY` を実際のAPIキーに置き換えてください。

### ステップ4: サービスアカウントに権限を付与

```bash
gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### ステップ5: バックエンドをデプロイ

```bash
cd backend
npm install
gcloud app deploy app.yaml
```

## トラブルシューティング

### 再認証が必要な場合

```bash
# アプリケーションのデフォルト認証情報を設定
gcloud auth application-default login
```

### プロジェクトにアクセスできない場合

1. プロジェクトの所有者または編集者権限があるか確認
2. 正しいGoogleアカウント（inoue@tamron-compo2.com）でログインしているか確認

### Secret Managerが既に存在する場合

```bash
# 既存のシークレットに新しいバージョンを追加
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
```

## 次のステップ

デプロイが完了したら：
1. バックエンドAPIのURLを確認（例: `https://singular-server-480006-s8.appspot.com`）
2. フロントエンドをバックエンドAPI経由で呼び出すように変更（オプション）
3. 動作確認

