# APIキーの問題と解決方法

## 問題

ログから以下のエラーが確認されました：
```
"Your API key was reported as leaked. Please use another API key."
```

これは、以前にGitHubにプッシュされたAPIキーが検出されたため、GoogleがそのAPIキーを無効化したことを意味します。

## 解決方法

### ステップ1: 新しいGemini APIキーを取得

1. **Google AI Studioにアクセス**
   - URL: https://aistudio.google.com/app/apikey

2. **新しいAPIキーを作成**
   - 「Create API Key」をクリック
   - プロジェクトを選択（`singular-server-480006-s8`）
   - 新しいAPIキーをコピー

### ステップ2: Secret Managerに新しいAPIキーを設定

```powershell
# 新しいAPIキーをSecret Managerに設定
gcloud secrets versions add gemini-api-key \
    --data-file=- \
    --project=singular-server-480006-s8
```

上記コマンドを実行すると、APIキーの入力が求められます。新しいAPIキーを貼り付けてEnterを押してください。

または、一時ファイルを使用する方法：

```powershell
# 新しいAPIキーを一時ファイルに保存
$newApiKey = "YOUR_NEW_API_KEY_HERE"
$newApiKey | Out-File -FilePath temp-api-key.txt -Encoding utf8 -NoNewline

# Secret Managerに追加
gcloud secrets versions add gemini-api-key \
    --data-file=temp-api-key.txt \
    --project=singular-server-480006-s8

# 一時ファイルを削除
Remove-Item temp-api-key.txt
```

### ステップ3: 動作確認

新しいAPIキーを設定した後、再度APIをテストしてください：

```powershell
$body = @{ prompt = "こんにちは、テストです" } | ConvertTo-Json
Invoke-WebRequest -Uri "https://ai-drbfm-backend-636nanwcsq-an.a.run.app/api/gemini" -Method POST -Body $body -ContentType "application/json"
```

## 注意事項

- **APIキーは絶対にGitHubにプッシュしないでください**
- ローカル開発用の`config.js`や`ai-drbfm.html`に埋め込まれているAPIキーも更新してください
- 新しいAPIキーを取得したら、古いAPIキーは削除または無効化することを推奨します

## 参考リンク

- Google AI Studio: https://aistudio.google.com/app/apikey
- Secret Manager: https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8


