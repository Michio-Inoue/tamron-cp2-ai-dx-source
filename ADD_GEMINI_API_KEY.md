# Gemini APIキーの追加手頁E

## 現在の状況E
新しいGemini APIキーをSecret Managerに追加する忁E��があります、E

## 手頁E

### 1. 認証の更新�E�忁E��な場合！E
```powershell
gcloud auth login
```

### 2. APIキーの追加
以下�Eコマンドを実行してください�E�E

```powershell
echo "[REDACTED]" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### 3. 確誁E
APIキーが正しく追加されたか確認！E

```powershell
gcloud secrets versions access latest --secret="gemini-api-key" --project=tamron-cloudrun-prod-new
```

## 注意事頁E
- APIキーが正しく追加されたら、Cloud Runサービスが�E動的に新しいバ�Eジョンを使用しまぁE
- 追加後、フロントエンドからAPIを�E度呼び出して動作を確認してください
