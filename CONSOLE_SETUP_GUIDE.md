# Google Cloud Console でのセットアップ手順

## プロジェクト情報
- **プロジェクト名**: Tamron-cp2-AI-DX
- **プロジェクトID**: `singular-server-480006-s8`

---

## ステップ1: Secret ManagerにAPIキーを保存

### 1-1. Secret Managerページにアクセス

以下のURLをブラウザで開いてください：
```
https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8
```

または：
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 画面上部のプロジェクト選択で「singular-server-480006-s8」を選択
3. 左メニューから「セキュリティ」→「Secret Manager」をクリック

### 1-2. シークレットを作成

1. 「シークレットを作成」ボタンをクリック
2. 以下の情報を入力：
   - **名前**: `gemini-api-key`（必ずこの名前）
   - **シークレットの値**: `[REDACTED]`
   - **リージョン**: 「自動」を選択
3. 「作成」ボタンをクリック
4. 数秒で完了します ✓

**注意**: 既に `gemini-api-key` が存在する場合は、シークレットをクリックして「新しいバージョンを追加」から更新できます。

---

## ステップ1.5: App Engineを初期化（重要！）

**注意**: サービスアカウントに権限を付与する前に、App Engineを初期化する必要があります。

### 1.5-1. App Engineページにアクセス

以下のURLをブラウザで開いてください：
```
https://console.cloud.google.com/appengine?project=singular-server-480006-s8
```

### 1.5-2. アプリケーションを作成

1. 「アプリケーションを作成」ボタンをクリック
2. **リージョン**を選択：
   - 推奨: `asia-northeast1`（東京）または `asia-northeast2`（大阪）
   - その他のリージョンでも可
3. 「作成」ボタンをクリック
4. 初期化には**3〜5分**かかります
5. 「アプリケーションが作成されました」と表示されれば完了 ✓

**重要**: このステップを完了すると、正しいサービスアカウントが自動的に作成されます。

---

## ステップ2: サービスアカウントに権限を付与

### 2-1. サービスアカウントのメールアドレスを確認

まず、正しいサービスアカウントのメールアドレスを確認します：

1. 以下のURLにアクセス：
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts?project=singular-server-480006-s8
   ```

2. 以下のいずれかの形式のサービスアカウントを探します：
   - `PROJECT_NUMBER@project.gserviceaccount.com`（例: `123456789012@project.gserviceaccount.com`）
   - `singular-server-480006-s8@appspot.gserviceaccount.com`

3. メールアドレスをコピーします

### 2-2. Secret Managerで権限を追加

1. Secret Managerページで `gemini-api-key` をクリック
2. 「権限」タブをクリック
3. 「プリンシパルを追加」ボタンをクリック
4. 以下の情報を入力：
   - **新しいプリンシパル**: 上記で確認したサービスアカウントのメールアドレスを貼り付け
     - 例: `123456789012@project.gserviceaccount.com`
     - または: `singular-server-480006-s8@appspot.gserviceaccount.com`
   - **ロール**: 「Secret Manager シークレット アクセサー」を選択
5. 「保存」ボタンをクリック
6. 数秒で完了します ✓

---

## ステップ3: 必要なAPIを有効化

### 3-1. APIライブラリページにアクセス

以下のURLをブラウザで開いてください：
```
https://console.cloud.google.com/apis/library?project=singular-server-480006-s8
```

または：
1. Google Cloud Consoleで「APIとサービス」→「ライブラリ」をクリック

### 3-2. 各APIを有効化

以下の3つのAPIを検索して、それぞれ「有効にする」をクリック：

#### ① Secret Manager API
1. 検索ボックスに「Secret Manager API」と入力
2. 「Secret Manager API」をクリック
3. 「有効にする」ボタンをクリック
4. 有効化完了まで数秒待つ ✓

#### ② App Engine Admin API
1. 検索ボックスに「App Engine Admin API」と入力
2. 「App Engine Admin API」をクリック
3. 「有効にする」ボタンをクリック
4. 有効化完了まで数秒待つ ✓

#### ③ Cloud Build API
1. 検索ボックスに「Cloud Build API」と入力
2. 「Cloud Build API」をクリック
3. 「有効にする」ボタンをクリック
4. 有効化完了まで数秒待つ ✓

---

## ステップ4: バックエンドをデプロイ（コマンドライン）

上記の設定が完了したら、PowerShellで以下のコマンドを実行：

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

---

## 確認方法

### Secret Managerの確認
- URL: https://console.cloud.google.com/security/secret-manager?project=singular-server-480006-s8
- `gemini-api-key` が表示されていればOK ✓

### API有効化の確認
- URL: https://console.cloud.google.com/apis/dashboard?project=singular-server-480006-s8
- 以下のAPIが「有効」になっていればOK ✓
  - Secret Manager API
  - App Engine Admin API
  - Cloud Build API

### デプロイの確認
- URL: https://singular-server-480006-s8.appspot.com
- `{"message":"AI-DRBFM Analysis Server"}` が表示されればOK ✓

---

## トラブルシューティング

### Secret Managerが見つからない場合
- プロジェクトが正しく選択されているか確認
- URLに `project=singular-server-480006-s8` が含まれているか確認

### APIが有効化できない場合
- プロジェクトの所有者または編集者権限があるか確認
- 請求先アカウントがリンクされているか確認

### デプロイが失敗する場合
1. ログを確認：
   ```bash
   gcloud app logs tail -s default
   ```
2. エラーメッセージを確認して、必要な設定を追加

---

## 所要時間の目安

- Secret Manager設定: 約1分
- 権限付与: 約30秒
- API有効化: 約2分（各APIで30秒程度）
- デプロイ: 約5〜10分

**合計: 約10〜15分**（コマンドラインより大幅に速い）

---

## 次のステップ

デプロイが完了したら：
1. バックエンドAPIのURLを確認
2. フロントエンドをバックエンドAPI経由で呼び出すように変更（オプション）
3. 動作確認

