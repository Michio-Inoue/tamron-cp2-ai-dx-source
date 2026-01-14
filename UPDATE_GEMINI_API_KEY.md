# Gemini APIキーの更新手順

## 現在の状態

- **Secret ManagerのGemini APIキー**: `a6a925178e7669bd8305d58899a3c4d0330dabf0`（無効）
- **エラー**: `API key not valid. Please pass a valid API key.`

## 解決方法

### ステップ1: 新しいGemini APIキーを取得

1. **Google AI Studioにアクセス**
   ```
   https://aistudio.google.com/apikey
   ```

2. **新しいAPIキーを作成**
   - 「Create API Key」ボタンをクリック
   - プロジェクト `tamron-cloudrun-prod-new` を選択
   - 新しいAPIキーをコピー

### ステップ2: Secret Managerに新しいAPIキーを追加

新しいAPIキーを取得したら、以下のコマンドでSecret Managerに追加してください：

```powershell
# 新しいAPIキーをSecret Managerに追加
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

**例：**
```powershell
echo "[REDACTED]" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### ステップ3: 確認

新しいAPIキーを追加した後、バックエンドは自動的に最新バージョンのAPIキーを使用します。

Secret Managerは`latest`バージョンを取得するため、新しいバージョンを追加すれば自動的に使用されます。

### ステップ4: テスト

フロントエンドから再度APIを呼び出して、正常に動作することを確認してください。

## 注意事項

- 古いAPIキーは削除せず、新しいバージョンとして追加してください
- これにより、問題が発生した場合にロールバックが可能です
- 新しいAPIキーを追加した後、数秒待ってからテストしてください（キャッシュのため）

## 現在の設定

- **バックエンドURL**: `https://ai-drbfm-backend-43iql33sfa-an.a.run.app`
- **バックエンドAPIキー**: `Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru`（正常）
- **Gemini APIキー**: 無効（更新が必要）
