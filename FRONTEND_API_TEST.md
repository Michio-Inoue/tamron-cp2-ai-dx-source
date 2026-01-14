# フロントエンドからAPIを呼び出すテスト

## ✅ バックエンドAPIが正常に動作

`{"メッセージ":"AI-DRBFM 分析サーバー"}` というレスポンスが返ってきました。

## 次のステップ：フロントエンドからAPIを呼び出す

### 1. ブラウザで`ai-drbfm.html`を開く

- ローカルファイルとして開く（`file://`プロトコル）
- または、HTTPサーバーで提供（推奨）

### 2. ブラウザの開発者ツールを開く

- **F12**キーを押す
- **コンソール**タブを開く
- **ネットワーク**タブを開く（APIリクエストを確認するため）

### 3. ファイルを選択してAI分析を実行

1. Excelファイル（.xlsx）を選択
2. 「AI分析を実行」ボタンをクリック
3. コンソールとネットワークタブで以下を確認：
   - APIキーが正しく送信されているか
   - 認証が成功しているか
   - Gemini APIが呼び出されているか

### 4. 期待される動作

- ✅ APIキーが自動的に`X-API-Key`ヘッダーに追加される
- ✅ バックエンドAPI（`/api/gemini`）が呼び出される
- ✅ 認証が成功し、Gemini APIが呼び出される
- ✅ AI分析結果が表示される

### 5. トラブルシューティング

#### エラー: 401 Unauthorized
- **原因**: APIキーが正しく送信されていない、またはAPIキーが無効
- **確認**: ネットワークタブで`X-API-Key`ヘッダーを確認
- **解決**: `ai-drbfm.html`の`window.BACKEND_API_KEY`が正しく設定されているか確認

#### エラー: 403 Forbidden
- **原因**: Cloud Runサービスへのアクセスが許可されていない
- **確認**: Cloud RunサービスのIAMポリシーを確認
- **解決**: `allUsers`に`roles/run.invoker`を付与（Google Cloud Consoleから）

#### エラー: CORS
- **原因**: CORS設定の問題
- **確認**: バックエンドのCORS設定を確認
- **解決**: `backend/server.js`でCORSが有効になっているか確認

#### エラー: Gemini APIキーが無効
- **原因**: Secret Managerに保存されているGemini APIキーが無効
- **確認**: Secret Managerの`gemini-api-key`を確認
- **解決**: 新しいGemini APIキーをSecret Managerに追加

## 現在の設定

- **バックエンドURL**: `https://ai-drbfm-backend-43iql33sfa-an.a.run.app`
- **APIキー**: `Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru`（`ai-drbfm.html`に設定済み）
- **認証**: APIキー認証が実装済み

## まとめ

バックエンドAPIは正常に動作しています。

次は、フロントエンドからAPIを呼び出して、完全な動作を確認してください。

問題があれば、ブラウザの開発者ツール（F12）のコンソールタブでエラーメッセージを確認してください。
