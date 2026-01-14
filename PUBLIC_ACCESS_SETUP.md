# Cloud Run 公開アクセスの設定方法

## 問題
403エラー（禁止エラー）が発生しています。これは、Cloud Runサービスへの公開アクセスが許可されていないためです。

## 解決方法

### 方法1: Google Cloud Consoleから設定（推奨）

1. **Cloud Run サービスページを開く**
   - https://console.cloud.google.com/run/detail/asia-northeast1/ai-drbfm-backend?project=tamron-cloudrun-prod-new

2. **「権限」タブをクリック**

3. **「プリンシパルを追加」ボタンをクリック**

4. **以下の情報を入力**
   - **新しいプリンシパル**: `allUsers`
   - **ロール**: `Cloud Run 起動元` (roles/run.invoker)

5. **「保存」をクリック**

### 方法2: 組織ポリシーの確認

組織ポリシーで`allUsers`への公開アクセスが制限されている場合、組織管理者に依頼して以下のポリシーを確認・変更する必要があります：

- `constraints/iam.allowedPolicyMemberDomains`
- `constraints/run.allowedIngress`

### 方法3: 認証が必要なアクセスにする

公開アクセスが許可できない場合は、サービスアカウントを使用して認証する必要があります。

1. サービスアカウントのキーを作成
2. フロントエンドでサービスアカウントを使用して認証
3. 認証トークンを使用してAPIを呼び出す

## 現在の状態

- **サービスURL**: `https://ai-drbfm-backend-43iql33sfa-an.a.run.app`
- **IAM権限**: `cloud-run-invoker-new@tamron-cloudrun-prod-new.iam.gserviceaccount.com`に`roles/run.invoker`権限が付与されています
- **公開アクセス**: 未設定（組織ポリシーで制限されている可能性があります）

## 次のステップ

1. Google Cloud Consoleから`allUsers`への公開アクセスを設定してください
2. 設定後、フロントエンドからバックエンドAPIにアクセスできるか確認してください
