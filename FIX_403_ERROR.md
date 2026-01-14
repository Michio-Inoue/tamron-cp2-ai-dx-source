# 403エラーの解決方法

## 問題

フロントエンド（JavaScript）からバックエンドAPIを呼び出す際に、403エラーが発生しています。

## 原因

ブラウザから直接Cloud Run APIを呼び出す場合、認証情報が自動的に送信されないため、403エラーが発生します。

## 解決方法

### 方法1: Google Cloud Consoleから公開アクセスを許可（最も簡単）

**手順：**

1. **以下のURLにアクセス**
   ```
   https://console.cloud.google.com/run/detail/asia-northeast1/ai-drbfm-backend/permissions?project=tamron-cloudrun-prod-new
   ```

2. **「プリンシパルを追加」ボタンをクリック**

3. **以下の情報を入力**
   - **新しいプリンシパル**: `allUsers` と入力
   - **ロール**: `Cloud Run 起動元` を選択（または `roles/run.invoker` と入力）

4. **「保存」をクリック**

これで、認証なしでAPIにアクセスできるようになります。

### 方法2: コマンドラインから設定（組織ポリシーで許可されている場合）

```powershell
gcloud run services add-iam-policy-binding ai-drbfm-backend `
  --region=asia-northeast1 `
  --member="allUsers" `
  --role="roles/run.invoker" `
  --project=tamron-cloudrun-prod-new
```

**注意**: 組織ポリシーで制限されている場合は、このコマンドは失敗します。その場合は、方法1を使用してください。

### 方法3: 組織ポリシーを確認・変更

組織ポリシーで`allUsers`への公開アクセスが制限されている場合、組織管理者に依頼して以下のポリシーを確認・変更する必要があります：

- `constraints/iam.allowedPolicyMemberDomains`
- `constraints/run.allowedIngress`

## 確認方法

設定後、以下のコマンドで確認できます：

```powershell
gcloud run services get-iam-policy ai-drbfm-backend --region=asia-northeast1 --project=tamron-cloudrun-prod-new
```

出力に以下のような行が表示されれば成功です：

```
bindings:
- members:
  - allUsers
  role: roles/run.invoker
```

## テスト方法

設定後、ブラウザの開発者ツール（F12）のコンソールで以下を実行：

```javascript
fetch('https://ai-drbfm-backend-43iql33sfa-an.a.run.app/', {
  method: 'GET'
})
.then(response => response.json())
.then(data => console.log('成功:', data))
.catch(error => console.error('エラー:', error));
```

成功すれば、403エラーは解消されています。
