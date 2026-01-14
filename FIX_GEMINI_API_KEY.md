# Gemini APIキーの問題と解決方法

## エラー

```
API key not valid. Please pass a valid API key.
```

## 原因

Secret Managerに保存されているGemini APIキーが無効か、期限切れです。

## 解決方法

### 1. 新しいGemini APIキーを取得

1. **Google AI Studioにアクセス**
   - https://aistudio.google.com/apikey

2. **新しいAPIキーを作成**
   - 「Create API Key」をクリック
   - プロジェクトを選択
   - 新しいAPIキーをコピー

### 2. Secret Managerに新しいAPIキーを追加

```powershell
# 新しいAPIキーをSecret Managerに追加
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### 3. デプロイ（必要に応じて）

新しいAPIキーを追加した後、バックエンドは自動的に最新バージョンのAPIキーを使用します。

Secret Managerは`latest`バージョンを取得するため、新しいバージョンを追加すれば自動的に使用されます。

## 現在の状態

- **バックエンドAPI**: 正常に動作
- **認証ミドルウェア**: 正常に動作
- **Gemini APIキー**: 無効（更新が必要）

## 注意事項

- 古いAPIキーは削除せず、新しいバージョンとして追加してください
- これにより、問題が発生した場合にロールバックが可能です
