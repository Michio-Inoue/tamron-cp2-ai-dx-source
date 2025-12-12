# デプロイ状態の確認方法

## 現在の状態を確認する方法

### 1. App Engineのバージョン確認

```powershell
gcloud app versions list --project=singular-server-480006-s8
```

### 2. デプロイされたURLの確認

```powershell
gcloud app describe --project=singular-server-480006-s8
```

### 3. ビルドの状態確認

```powershell
gcloud builds list --project=singular-server-480006-s8 --limit=5
```

### 4. アプリケーションの動作確認

ブラウザで以下にアクセス：
```
https://singular-server-480006-s8.appspot.com
```

正常に動作していれば、以下が表示されます：
```json
{"message":"AI-DRBFM Analysis Server"}
```

### 5. ログの確認

```powershell
gcloud app logs tail -s default --project=singular-server-480006-s8
```

## デプロイの状態

- **進行中**: ビルドとデプロイが実行中
- **成功**: アプリケーションが正常にデプロイされ、アクセス可能
- **失敗**: エラーメッセージが表示される

## トラブルシューティング

### デプロイが失敗した場合

1. エラーメッセージを確認
2. ビルドログを確認：
   ```powershell
   gcloud builds log BUILD_ID --project=singular-server-480006-s8
   ```
3. アプリケーションログを確認：
   ```powershell
   gcloud app logs tail -s default --project=singular-server-480006-s8
   ```

### よくあるエラー

- **Secret Managerへのアクセスエラー**: 権限が正しく付与されているか確認
- **依存関係のエラー**: `npm install` を再実行
- **APIが有効化されていない**: 必要なAPIが有効になっているか確認

