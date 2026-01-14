# 最終ステップ: デプロイ準備と実行

## 完了した項目
✅ App Engineの初期化完了
✅ サービスアカウントの確認完了
✅ Secret Managerへの権限付与完了

## 次のステップ

### ステップ1: 必要なAPIが有効化されているか確認

1. APIライブラリページにアクセス：
   ```
   https://console.cloud.google.com/apis/library?project=singular-server-480006-s8
   ```

2. 以下のAPIを検索して、「有効」になっているか確認：
   - **Secret Manager API** ✓
   - **App Engine Admin API** ✓
   - **Cloud Build API** ✓

3. 有効になっていない場合は、「有効にする」をクリック

### ステップ2: プロジェクト設定を確認

PowerShellで以下を実行して、プロジェクトが正しく設定されているか確認：

```powershell
gcloud config set project singular-server-480006-s8
gcloud config get-value project
```

### ステップ3: バックエンドの依存関係を確認

```powershell
cd backend
npm list --depth=0
```

必要なパッケージがインストールされているか確認します。

### ステップ4: バックエンドをデプロイ

すべての準備が整ったら、デプロイを実行：

```powershell
# プロジェクトを設定（念のため）
gcloud config set project singular-server-480006-s8

# バックエンドディレクトリに移動
cd backend

# デプロイ実行
gcloud app deploy app.yaml
```

デプロイには5〜10分かかることがあります。

### デプロイ時の確認事項

デプロイ中に以下のメッセージが表示される場合があります：

1. **「App Engineの場所を選択してください」**
   - リージョンを選択（推奨: `asia-northeast1` または `asia-northeast2`）

2. **「この操作により課金が発生する可能性があります」**
   - `Y` を入力して続行

3. **デプロイの進行状況**
   - ビルドとデプロイの進行状況が表示されます

### デプロイ完了後

デプロイが完了すると、以下のようなURLが表示されます：
```
https://singular-server-480006-s8.appspot.com
```

このURLにアクセスして、以下が表示されれば成功です：
```json
{"message":"AI-DRBFM Analysis Server"}
```

## トラブルシューティング

### デプロイが失敗する場合

1. **エラーログを確認**：
   ```powershell
   gcloud app logs tail -s default
   ```

2. **ビルドログを確認**：
   ```powershell
   gcloud builds list --limit=5
   ```

3. **よくあるエラー**：
   - **Secret Managerへのアクセスエラー**: 権限が正しく付与されているか確認
   - **APIが有効化されていない**: 必要なAPIが有効になっているか確認
   - **依存関係のエラー**: `npm install` を再実行

### Secret ManagerからAPIキーが取得できない場合

1. Secret Managerで `gemini-api-key` が存在するか確認
2. サービスアカウントに権限が付与されているか確認
3. `app.yaml` の `GEMINI_API_KEY_SECRET_NAME` が正しいか確認

## デプロイ後の確認

1. **バックエンドAPIが動作しているか確認**：
   ```
   https://singular-server-480006-s8.appspot.com/
   ```

2. **Gemini APIプロキシが動作しているか確認**：
   - フロントエンドからバックエンドAPIを呼び出す
   - または、Postmanなどでテスト

3. **ログを確認**：
   ```powershell
   gcloud app logs tail -s default
   ```

## 次のステップ（オプション）

デプロイが完了したら：

1. **フロントエンドをバックエンドAPI経由で呼び出すように変更**
   - `ai-drbfm.js` を更新して、バックエンドAPIを呼び出すように変更

2. **カスタムドメインの設定**（オプション）

3. **モニタリングとアラートの設定**（オプション）


