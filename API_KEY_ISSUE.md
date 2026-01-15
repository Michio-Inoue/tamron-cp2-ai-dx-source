# APIキーの問題と解決方況E

## 問顁E

ログから以下�Eエラーが確認されました�E�E
```
"Your API key was reported as leaked. Please use another API key."
```

これは、以前にGitHubにプッシュされたAPIキーが検�Eされたため、GoogleがそのAPIキーを無効化したことを意味します、E

## 解決方況E

### スチE��チE: 新しいGemini APIキーを取征E

1. **Google AI Studioにアクセス**
   - URL: https://aistudio.google.com/app/apikey

2. **新しいAPIキーを作�E**
   - 「Create API Key」をクリチE��
   - プロジェクトを選択！Esingular-server-480006-s8`�E�E
   - 新しいAPIキーをコピ�E

### スチE��チE: Secret Managerに新しいAPIキーを設宁E

```powershell
# 新しいAPIキーをSecret Managerに設宁E
gcloud secrets versions add gemini-api-key \
    --data-file=- \
    --project=singular-server-480006-s8
```

上記コマンドを実行すると、APIキーの入力が求められます。新しいAPIキーを貼り付けてEnterを押してください、E

また�E、一時ファイルを使用する方法！E

```powershell
# 新しいAPIキーを一時ファイルに保孁E
$newApiKey = "YOUR_NEW_API_KEY_HERE"
$newApiKey | Out-File -FilePath temp-api-key.txt -Encoding utf8 -NoNewline

# Secret Managerに追加
gcloud secrets versions add gemini-api-key \
    --data-file=temp-api-key.txt \
    --project=singular-server-480006-s8

# 一時ファイルを削除
Remove-Item temp-api-key.txt
```

### スチE��チE: 動作確誁E

新しいAPIキーを設定した後、�E度APIをテストしてください�E�E

```powershell
$body = @{ prompt = "こんにちは、テストでぁE } | ConvertTo-Json
Invoke-WebRequest -Uri "https://ai-drbfm-backend-636nanwcsq-an.a.run.app/api/gemini" -Method POST -Body $body -ContentType "application/json"
```

## 注意事頁E

- **APIキーは絶対にGitHubにプッシュしなぁE��ください**
- ローカル開発用の`config.js`や`ai-drbfm.html`に埋め込まれてぁE��APIキーも更新してください
- 新しいAPIキーを取得したら、古いAPIキーは削除また�E無効化することを推奨しまぁE

## 参老E��ンク

- Google AI Studio: https://aistudio.google.com/app/apikey
- Secret Manager: https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8


