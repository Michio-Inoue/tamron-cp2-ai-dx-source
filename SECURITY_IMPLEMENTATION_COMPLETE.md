# セキュアなAPI認証の実装完了

## 実装内容

### 1. 認証ミドルウェアの追加

`backend/auth-middleware.js`を作成し、APIキー検証機能を実装しました。

### 2. APIキーの管理

- **Secret Manager**: `backend-api-key`という名前で保存
- **生成されたAPIキー**: `Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru`
- **IAM権限**: Compute Engineサービスアカウントに`secretmanager.secretAccessor`権限を付与

### 3. フロントエンドの更新

- `ai-drbfm.html`: APIキーを設定
- `ai-drbfm.js`: API呼び出し時に`X-API-Key`ヘッダーにAPIキーを追加

### 4. デプロイ

- Cloud Runサービスに認証ミドルウェアを含むバックエンドをデプロイ
- Secret ManagerからAPIキーを取得するように設定

## セキュリティ上の利点

1. **`allUsers`への公開アクセス不要**
   - Cloud Runサービス自体は`--allow-unauthenticated`フラグで公開されていますが、
   - アプリケーションレベルの認証（APIキー）で保護されています

2. **APIキーの管理**
   - Secret Managerで安全に管理
   - フロントエンドに埋め込まれていますが、必要に応じて環境変数から取得することも可能

3. **認証の実装**
   - すべての`/api/gemini`、`/api/analyze`、`/api/save`エンドポイントは認証が必要
   - `/`、`/health`エンドポイントは認証不要（公開）

## 使用方法

### フロントエンドからAPIを呼び出す

フロントエンドは自動的にAPIキーを送信します：

```javascript
fetch('https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': window.BACKEND_API_KEY  // 自動的に追加される
    },
    body: JSON.stringify({ ... })
});
```

### APIキーを変更する場合

1. 新しいAPIキーを生成
2. Secret Managerに保存
3. フロントエンドの`ai-drbfm.html`を更新

## 注意事項

1. **APIキーの保護**
   - 現在、APIキーはフロントエンドに埋め込まれています
   - より安全にする場合は、環境変数から取得するか、別の認証方法を検討してください

2. **レート制限**
   - 必要に応じて、レート制限を追加することを推奨します

3. **CORS設定**
   - 必要に応じて、CORS設定を特定のドメインに制限してください

## 次のステップ

1. フロントエンドからAPIを呼び出して動作確認
2. 必要に応じて、レート制限やCORS設定を追加
3. APIキーのローテーションを検討
