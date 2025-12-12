# Secret Managerへの権限付与手順

## サービスアカウント情報
- **メールアドレス**: `singular-server-480006-s8@appspot.gserviceaccount.com`
- **用途**: App Engineデフォルトサービスアカウント

## 手順

### ステップ1: Secret Managerページにアクセス

以下のURLをブラウザで開いてください：
```
https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8
```

### ステップ2: gemini-api-keyシークレットを開く

1. `gemini-api-key` シークレットをクリック

2. **もし `gemini-api-key` が存在しない場合**：
   - 「シークレットを作成」ボタンをクリック
   - 以下の情報を入力：
     - **名前**: `gemini-api-key`
     - **シークレットの値**: `[REDACTED]`
     - **リージョン**: 「自動」を選択
   - 「作成」ボタンをクリック
   - 作成後、シークレットをクリック

### ステップ3: 権限を付与

1. 「権限」タブをクリック

2. 「プリンシパルを追加」ボタンをクリック

3. 以下の情報を入力：
   - **新しいプリンシパル**: `singular-server-480006-s8@appspot.gserviceaccount.com`
   - **ロール**: 「Secret Manager シークレット アクセサー」を選択
     - 検索ボックスに「Secret Manager シークレット アクセサー」と入力すると見つかります

4. 「保存」ボタンをクリック

5. 数秒で完了します ✓

### ステップ4: 権限が正しく付与されたか確認

「権限」タブに、以下の情報が表示されていればOK：
- **プリンシパル**: `singular-server-480006-s8@appspot.gserviceaccount.com`
- **ロール**: `Secret Manager シークレット アクセサー`

## 次のステップ

権限の付与が完了したら：

1. **必要なAPIが有効化されているか確認**
   - URL: https://console.cloud.google.com/apis/library?project=singular-server-480006-s8
   - 以下のAPIが「有効」になっているか確認：
     - Secret Manager API
     - App Engine Admin API
     - Cloud Build API

2. **バックエンドをデプロイ**
   ```powershell
   gcloud config set project singular-server-480006-s8
   cd backend
   gcloud app deploy app.yaml
   ```

## トラブルシューティング

### 「プリンシパルを追加」ボタンが表示されない

- プロジェクトの所有者または編集者権限があるか確認
- ページを更新してみる

### 権限の付与が失敗する

- サービスアカウントのメールアドレスが正しいか確認
- Secret Manager APIが有効になっているか確認
- プロジェクトが正しく選択されているか確認

