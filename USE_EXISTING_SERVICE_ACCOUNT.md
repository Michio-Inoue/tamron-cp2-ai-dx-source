# 既存のサービスアカウント（git-deployer）を使用する方法

## 回答

**はい、既存のサービスアカウント（git-deployer）を使用できます！**

App Engineの初期化では、サービスアカウントを選択する必要はありません。初期化後、既存のサービスアカウントにSecret Managerへの権限を付与すれば使用できます。

## 手順

### ステップ1: App Engineを初期化（そのまま進める）

1. App Engineページにアクセス：
   ```
   https://console.cloud.google.com/appengine?project=singular-server-480006-s8
   ```

2. 「アプリケーションを作成」をクリック

3. リージョンを選択して「作成」をクリック

4. 初期化を完了（サービスアカウントの選択は不要）

### ステップ2: 既存のサービスアカウント（git-deployer）を確認

1. サービスアカウントページにアクセス：
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts?project=singular-server-480006-s8
   ```

2. `git-deployer` という名前のサービスアカウントを探す

3. メールアドレスを確認（例: `git-deployer@singular-server-480006-s8.iam.gserviceaccount.com`）

### ステップ3: Secret Managerで権限を付与

1. Secret Managerページで `gemini-api-key` を開く：
   ```
   https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8
   ```

2. 「権限」タブをクリック

3. 「プリンシパルを追加」をクリック

4. 以下の情報を入力：
   - **新しいプリンシパル**: `git-deployer` のメールアドレスを入力
     - 例: `git-deployer@singular-server-480006-s8.iam.gserviceaccount.com`
   - **ロール**: 「Secret Manager シークレット アクセサー」を選択

5. 「保存」をクリック

### ステップ4: App Engineでサービスアカウントを指定（オプション）

既存のサービスアカウント（git-deployer）をApp Engineで使用する場合：

1. `backend/app.yaml` を編集して、サービスアカウントを指定：

```yaml
runtime: nodejs20

env_variables:
  GEMINI_API_KEY_SECRET_NAME: 'gemini-api-key'
  NODE_ENV: 'production'

# 既存のサービスアカウントを指定
service_account: git-deployer@singular-server-480006-s8.iam.gserviceaccount.com
```

**注意**: サービスアカウントのメールアドレスは、実際のメールアドレスに置き換えてください。

## メリット

既存のサービスアカウント（git-deployer）を使用するメリット：
- 既に設定済みのサービスアカウントを再利用できる
- 権限管理が統一される
- 新しいサービスアカウントを作成する必要がない

## 注意事項

- サービスアカウントのメールアドレスは、Google Cloud Consoleで確認してください
- サービスアカウント名が異なる場合（例: `git-deployer-xxx`）は、そのメールアドレスを使用してください
- `app.yaml` でサービスアカウントを指定しない場合、App Engineのデフォルトサービスアカウントが使用されます

## 確認方法

サービスアカウントのメールアドレスを確認するには：

1. サービスアカウントページにアクセス：
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts?project=singular-server-480006-s8
   ```

2. `git-deployer` をクリック

3. 「詳細」タブでメールアドレスを確認

