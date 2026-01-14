# 新しいGemini APIキーの追加手順

## 現在の状況

- ❌ Secret ManagerのGemini APIキー（バージョン1）: 無効（漏洩報告）
- ❌ Secret ManagerのGemini APIキー（バージョン2）: 無効（漏洩報告）
- ✅ バックエンドAPI: 正常に動作
- ✅ 認証ミドルウェア: 正常に動作

## 新しいGemini APIキーの取得と追加

### ステップ1: 新しいAPIキーを取得

1. **Google AI Studioにアクセス**
   ```
   https://aistudio.google.com/apikey
   ```

2. **新しいAPIキーを作成**
   - 「Create API Key」ボタンをクリック
   - プロジェクト `tamron-cloudrun-prod-new` を選択
   - 新しいAPIキーをコピー（`[REDACTED]...`で始まる文字列）

### ステップ2: Secret Managerに追加

新しいAPIキーを取得したら、以下のコマンドでSecret Managerに追加してください：

```powershell
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

**例：**
```powershell
echo "[REDACTED]" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### ステップ3: 確認

追加後、バージョンが作成されたことを確認：

```powershell
gcloud secrets versions list gemini-api-key --project=tamron-cloudrun-prod-new
```

### ステップ4: テスト

新しいAPIキーを追加した後、数秒待ってからフロントエンドからAPIを呼び出してテストしてください。

## 注意事項

- 新しいAPIキーは、公開リポジトリやコードに含めないでください
- Secret Managerで安全に管理してください
- バックエンドには5分間のキャッシュがあるため、反映まで数秒かかる場合があります

## 現在の設定

- **バックエンドURL**: `https://ai-drbfm-backend-43iql33sfa-an.a.run.app`
- **バックエンドAPIキー**: `Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru`（正常）
- **Gemini APIキー**: 新しいキーが必要
