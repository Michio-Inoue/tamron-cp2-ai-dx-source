# なぜ新しいGemini APIキーが必要なのか

## 現在の状況

### エラー
```
API key not valid. Please pass a valid API key.
```

### 原因

Secret Managerに保存されているGemini APIキー（`a6a925178e7669bd8305d58899a3c4d0330dabf0`）が**無効**になっています。

## なぜ無効になったのか

### 1. APIキーが漏洩した可能性

以前のエラーログに以下のメッセージがありました：
```
Your API key was reported as leaked. Please use another API key.
```

これは、APIキーが公開リポジトリやコードに含まれていた可能性があり、Googleがセキュリティ上の理由で無効化したことを示しています。

### 2. 現在の実装

現在の実装では：

1. **フロントエンド** → バックエンドAPIを呼び出す（APIキー認証を使用）
2. **バックエンド** → Secret ManagerからGemini APIキーを取得
3. **バックエンド** → Gemini APIを呼び出す

つまり、**バックエンドがSecret Managerから取得したGemini APIキーを使用**しています。

### 3. 問題点

Secret Managerに保存されているGemini APIキーが無効なため、バックエンドがGemini APIを呼び出すことができません。

## 解決方法

### オプション1: 新しいGemini APIキーを取得してSecret Managerに追加（推奨）

1. **Google AI Studioで新しいAPIキーを作成**
   - https://aistudio.google.com/apikey

2. **Secret Managerに追加**
   ```powershell
   echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
   ```

### オプション2: 既存のAPIキーを使用（`ai-drbfm.html`に設定されているもの）

`ai-drbfm.html`には別のGemini APIキー（`[REDACTED]`）が設定されています。

このキーが有効であれば、Secret Managerに追加できます：

```powershell
echo "[REDACTED]" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

## まとめ

- **現在のSecret ManagerのGemini APIキー**: 無効
- **理由**: セキュリティ上の理由で無効化された可能性
- **解決**: 新しい有効なAPIキーをSecret Managerに追加する必要がある

新しいAPIキーを追加すれば、バックエンドが自動的に最新バージョンを使用します。
