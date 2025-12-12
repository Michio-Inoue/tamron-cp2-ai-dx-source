# App Engine初期化後の次のステップ

## 現在の状態
✅ App Engineの初期化完了
✅ デフォルトサービスアカウントが自動的に作成されました

## 次のステップ

### ステップ1: デフォルトサービスアカウントのメールアドレスを確認

1. 以下のURLにアクセス：
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts?project=singular-server-480006-s8
   ```

2. サービスアカウントの一覧から、以下のいずれかの形式のアカウントを探します：
   - `PROJECT_NUMBER@project.gserviceaccount.com`（例: `123456789012@project.gserviceaccount.com`）
   - `singular-server-480006-s8@appspot.gserviceaccount.com`
   - 「App Engine デフォルトサービスアカウント」という表示名のアカウント

3. **メールアドレスをコピー**します（次のステップで使用します）

### ステップ2: Secret Managerで権限を付与

1. Secret Managerページにアクセス：
   ```
   https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8
   ```

2. `gemini-api-key` シークレットをクリック

3. 「権限」タブをクリック

4. 「プリンシパルを追加」ボタンをクリック

5. 以下の情報を入力：
   - **新しいプリンシパル**: ステップ1で確認したサービスアカウントのメールアドレスを貼り付け
     - 例: `123456789012@project.gserviceaccount.com`
     - または: `singular-server-480006-s8@appspot.gserviceaccount.com`
   - **ロール**: 「Secret Manager シークレット アクセサー」を選択

6. 「保存」ボタンをクリック

7. 数秒で完了します ✓

### ステップ3: 必要なAPIを有効化（まだの場合）

以下のAPIが有効になっているか確認：

1. APIライブラリページにアクセス：
   ```
   https://console.cloud.google.com/apis/library?project=singular-server-480006-s8
   ```

2. 以下のAPIを検索して、「有効」になっているか確認：
   - **Secret Manager API** ✓
   - **App Engine Admin API** ✓
   - **Cloud Build API** ✓

3. 有効になっていない場合は、「有効にする」をクリック

### ステップ4: Secret ManagerにAPIキーが保存されているか確認

1. Secret Managerページにアクセス：
   ```
   https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8
   ```

2. `gemini-api-key` が表示されているか確認

3. 存在しない場合は、作成：
   - 「シークレットを作成」をクリック
   - 名前: `gemini-api-key`
   - シークレットの値: `[REDACTED]`
   - 「作成」をクリック

### ステップ5: バックエンドをデプロイ

すべての設定が完了したら、PowerShellで以下のコマンドを実行：

```powershell
# プロジェクトを設定
gcloud config set project singular-server-480006-s8

# バックエンドディレクトリに移動
cd backend

# デプロイ実行
gcloud app deploy app.yaml
```

デプロイには5〜10分かかることがあります。

デプロイが完了すると、以下のようなURLが表示されます：
```
https://singular-server-480006-s8.appspot.com
```

## チェックリスト

セットアップの確認：

- [ ] App Engineの初期化完了
- [ ] デフォルトサービスアカウントのメールアドレスを確認
- [ ] Secret Managerで `gemini-api-key` が存在
- [ ] サービスアカウントにSecret Managerへの権限を付与
- [ ] 必要なAPIが有効化されている
- [ ] バックエンドをデプロイ

## トラブルシューティング

### サービスアカウントが見つからない場合

1. App Engineの初期化が完全に完了しているか確認
2. プロジェクトが正しく選択されているか確認
3. 数分待ってから再度確認

### 権限の付与が失敗する場合

1. サービスアカウントのメールアドレスが正しいか確認
2. Secret Manager APIが有効になっているか確認
3. プロジェクトの所有者または編集者権限があるか確認

