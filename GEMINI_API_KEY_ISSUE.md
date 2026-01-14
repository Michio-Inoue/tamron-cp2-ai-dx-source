# Gemini APIキーの問題

## エラー

```
Your API key was reported as leaked. Please use another API key.
```

## 原因

`ai-drbfm.html`に設定されているGemini APIキー（`[REDACTED]`）も、**漏洩したと報告されて無効**になっています。

## 解決方法

### 新しいGemini APIキーを取得する必要があります

1. **Google AI Studioにアクセス**
   - https://aistudio.google.com/apikey

2. **新しいAPIキーを作成**
   - 「Create API Key」をクリック
   - プロジェクト `tamron-cloudrun-prod-new` を選択
   - 新しいAPIキーをコピー

3. **Secret Managerに追加**
   ```powershell
   echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
   ```

## 注意事項

- 既存のAPIキーは漏洩したと報告されているため、新しいAPIキーが必要です
- 新しいAPIキーは、公開リポジトリやコードに含めないでください
- Secret Managerで安全に管理してください

## 現在の状態

- ❌ **Secret ManagerのGemini APIキー（バージョン1）**: 無効（漏洩報告）
- ❌ **Secret ManagerのGemini APIキー（バージョン2）**: 無効（漏洩報告）
- ✅ **バックエンドAPI**: 正常に動作
- ✅ **認証ミドルウェア**: 正常に動作

## 次のステップ

新しいGemini APIキーを取得して、Secret Managerに追加してください。
