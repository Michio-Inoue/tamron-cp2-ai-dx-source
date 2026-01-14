# Gemini APIキーの最終的な解決方法

## 現在のエラー

```
HTTP 403: Your API key was reported as leaked. Please use another API key.
```

## 問題の原因

Secret Managerに保存されているすべてのGemini APIキーが、**漏洩したと報告されて無効**になっています。

- バージョン1: 無効（漏洩報告）
- バージョン2: 無効（漏洩報告）

## 解決方法

### 新しいGemini APIキーを取得して追加

#### ステップ1: 新しいAPIキーを取得

1. **Google AI Studioにアクセス**
   ```
   https://aistudio.google.com/apikey
   ```

2. **ログイン**（Googleアカウントで）

3. **新しいAPIキーを作成**
   - 「Create API Key」ボタンをクリック
   - プロジェクトを選択（`tamron-cloudrun-prod-new`）
   - 新しいAPIキーが表示される（`[REDACTED]...`で始まる）
   - **このキーをコピー**（後で見られないので注意）

#### ステップ2: Secret Managerに追加

PowerShellで以下のコマンドを実行してください：

```powershell
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

**実際の例（YOUR_NEW_GEMINI_API_KEYの部分を実際のキーに置き換える）：**
```powershell
echo "[REDACTED]" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

#### ステップ3: 確認

追加が成功したことを確認：

```powershell
gcloud secrets versions list gemini-api-key --project=tamron-cloudrun-prod-new
```

新しいバージョン（例：バージョン3）が表示されれば成功です。

#### ステップ4: テスト

1. **数秒待つ**（バックエンドのキャッシュが更新されるまで）
2. **フロントエンドからAPIを呼び出す**
   - `ai-drbfm.html`をブラウザで開く
   - ファイルを選択してAI分析を実行
3. **動作確認**
   - エラーが解消され、AI分析が正常に動作することを確認

## 重要な注意事項

### APIキーのセキュリティ

- ✅ **Secret Managerで管理**: APIキーはSecret Managerで安全に管理されています
- ❌ **コードに含めない**: APIキーをコードや公開リポジトリに含めないでください
- ❌ **フロントエンドに埋め込まない**: フロントエンドのコードにAPIキーを埋め込まないでください（現在の実装ではバックエンドAPIキーのみがフロントエンドに設定されていますが、これはバックエンドAPIへのアクセス用です）

### 現在の実装

- **フロントエンド**: バックエンドAPIキー（`Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru`）を使用してバックエンドAPIにアクセス
- **バックエンド**: Secret ManagerからGemini APIキーを取得してGemini APIを呼び出す

この実装により、Gemini APIキーはフロントエンドに露出せず、安全に管理されています。

## 現在の状態

- ✅ **バックエンドAPI**: 正常に動作
- ✅ **認証ミドルウェア**: 正常に動作
- ✅ **バックエンドAPIキー**: 正常
- ❌ **Gemini APIキー**: 無効（新しいキーが必要）

## まとめ

新しいGemini APIキーを取得して、Secret Managerに追加すれば、問題は解決します。

新しいAPIキーを取得したら、上記のステップ2のコマンドを実行して追加してください。
