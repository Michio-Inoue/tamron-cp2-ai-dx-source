# Cloud Storageバケットアクセス権限エラーの解決方法

## エラー内容

```
invalid bucket "staging.singular-server-480006-s8.appspot.com"; 
service account singular-server-480006-s8@appspot.gserviceaccount.com 
does not have access to the bucket
```

## 原因

App Engineのデプロイ時に使用されるステージングバケット（`staging.singular-server-480006-s8.appspot.com`）に、サービスアカウントがアクセスできない。

## 解決方法

### 方法1: Google Cloud Consoleで権限を付与（推奨）

1. **Cloud Storageバケットページにアクセス**：
   ```
   https://console.cloud.google.com/storage/browser?project=singular-server-480006-s8
   ```

2. **ステージングバケットを探す**：
   - `staging.singular-server-480006-s8.appspot.com` という名前のバケットを探す
   - または、`gs://staging.singular-server-480006-s8.appspot.com` を検索

3. **バケットをクリック**

4. **「権限」タブをクリック**

5. **「プリンシパルを追加」をクリック**

6. **以下の情報を入力**：
   - **新しいプリンシパル**: `singular-server-480006-s8@appspot.gserviceaccount.com`
   - **ロール**: 「Storage オブジェクト管理者」または「Storage 管理者」を選択

7. **「保存」をクリック**

### 方法2: コマンドラインで権限を付与

```powershell
# サービスアカウントにStorage管理者権限を付与
gsutil iam ch serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com:roles/storage.admin gs://staging.singular-server-480006-s8.appspot.com
```

または、より限定的な権限：

```powershell
# Storageオブジェクト管理者権限を付与
gsutil iam ch serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com:roles/storage.objectAdmin gs://staging.singular-server-480006-s8.appspot.com
```

### 方法3: プロジェクトレベルで権限を付与

```powershell
# プロジェクトレベルでStorage管理者権限を付与
gcloud projects add-iam-policy-binding singular-server-480006-s8 \
    --member="serviceAccount:singular-server-480006-s8@appspot.gserviceaccount.com" \
    --role="roles/storage.admin"
```

## 確認方法

権限が正しく付与されたか確認：

```powershell
# バケットの権限を確認
gsutil iam get gs://staging.singular-server-480006-s8.appspot.com
```

## 権限付与後のデプロイ

権限を付与したら、再度デプロイを実行：

```powershell
gcloud app deploy app.yaml --project=singular-server-480006-s8
```

## トラブルシューティング

### バケットが見つからない場合

App Engineの初期化時に自動的に作成されるはずですが、見つからない場合は：

1. App Engineが正しく初期化されているか確認
2. プロジェクトが正しく選択されているか確認
3. 数分待ってから再度確認

### 権限の付与が失敗する場合

1. プロジェクトの所有者または編集者権限があるか確認
2. Cloud Storage APIが有効になっているか確認
3. サービスアカウントのメールアドレスが正しいか確認


