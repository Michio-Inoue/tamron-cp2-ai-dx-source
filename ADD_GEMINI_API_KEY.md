# Gemini APIキーの追加手順

## 現在の状況
新しいGemini APIキーをSecret Managerに追加する必要があります。

## 手順

### 1. 認証の更新（必要な場合）
```powershell
gcloud auth login
```

### 2. APIキーの追加
以下のコマンドを実行してください：

```powershell
echo "[REDACTED]" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### 3. 確認
APIキーが正しく追加されたか確認：

```powershell
gcloud secrets versions access latest --secret="gemini-api-key" --project=tamron-cloudrun-prod-new
```

## 注意事項
- APIキーが正しく追加されたら、Cloud Runサービスが自動的に新しいバージョンを使用します
- 追加後、フロントエンドからAPIを再度呼び出して動作を確認してください
