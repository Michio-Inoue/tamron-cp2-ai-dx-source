# IAMポリシー設定手順

## 現在の状況

Cloud RunサービスのIAMポリシーが空のため、公開アクセスが許可されていません。

## 解決方法

### 方法1: Google Cloud Consoleから設定（推奨）

1. **Cloud Runコンソールにアクセス**
   - URL: https://console.cloud.google.com/run/detail/asia-northeast1/ai-drbfm-backend/permissions?project=singular-server-480006-s8

2. **「プリンシパルを追加」をクリック**

3. **以下の設定を入力**
   - **新しいプリンシパル**: `allUsers`
   - **ロールを選択**: `Cloud Run 起動元` (Cloud Run Invoker)

4. **「保存」をクリック**

### 方法2: コマンドラインから設定

以下のコマンドを実行してください：

```powershell
gcloud run services add-iam-policy-binding ai-drbfm-backend `
    --region=asia-northeast1 `
    --member="allUsers" `
    --role="roles/run.invoker" `
    --project=singular-server-480006-s8
```

**注意**: 組織ポリシーにより`allUsers`が許可されていない場合は、このコマンドは失敗します。その場合は、方法1（Google Cloud Console）を使用してください。

### 方法3: 認証トークンを使用してテスト

IAMポリシーを設定する前に、認証トークンを使用してAPIが正常に動作するか確認できます：

```powershell
$token = gcloud auth print-identity-token
$headers = @{ Authorization = "Bearer $token" }
$body = @{ prompt = "こんにちは" } | ConvertTo-Json
Invoke-WebRequest -Uri "https://ai-drbfm-backend-636nanwcsq-an.a.run.app/api/gemini" -Method POST -Body $body -ContentType "application/json" -Headers $headers
```

## 確認

IAMポリシーを設定した後、以下のコマンドで確認できます：

```powershell
gcloud run services get-iam-policy ai-drbfm-backend --region=asia-northeast1 --project=singular-server-480006-s8
```

`allUsers`が`roles/run.invoker`として表示されていれば、設定は成功しています。


