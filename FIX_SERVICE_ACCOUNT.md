# サービスアカウント権限エラーの解決方法

## エラーの原因

「メールアドレスとドメインは、有効な Google アカウント...」というエラーは、以下の理由で発生します：

1. **App Engineがまだ初期化されていない**
   - App Engineを初期化すると、デフォルトサービスアカウントが自動的に作成されます

2. **サービスアカウントのメールアドレスが間違っている**
   - プロジェクトIDではなく、プロジェクト番号を使用する必要がある場合があります

## 解決方法

### 方法1: App Engineを先に初期化する（推奨）

App Engineを初期化すると、正しいサービスアカウントが自動的に作成されます。

#### ステップ1: App Engineを初期化

1. 以下のURLにアクセス：
   ```
   https://console.cloud.google.com/appengine?project=singular-server-480006-s8
   ```

2. 「アプリケーションを作成」をクリック

3. リージョンを選択（推奨: `asia-northeast1` または `asia-northeast2`）

4. 「作成」をクリック

5. 初期化には数分かかります

#### ステップ2: サービスアカウントを確認

初期化後、以下のコマンドでサービスアカウントを確認：

```bash
gcloud iam service-accounts list --project=singular-server-480006-s8
```

または、Google Cloud Consoleで：
1. 「IAMと管理」→「サービスアカウント」にアクセス
2. `*@appspot.gserviceaccount.com` または `*@project.gserviceaccount.com` で終わるアカウントを探す

#### ステップ3: 正しいサービスアカウントに権限を付与

Secret Managerで、確認したサービスアカウントに権限を付与します。

### 方法2: プロジェクト番号を使用する

プロジェクト番号を確認して、それを使用します。

#### ステップ1: プロジェクト番号を確認

Google Cloud Consoleで：
1. プロジェクト選択ドロップダウンをクリック
2. プロジェクト番号を確認（例: `123456789012`）

または、コマンドラインで：
```bash
gcloud projects describe singular-server-480006-s8 --format="value(projectNumber)"
```

#### ステップ2: サービスアカウントのメールアドレスを構築

サービスアカウントのメールアドレスは以下の形式です：
```
PROJECT_NUMBER@project.gserviceaccount.com
```

例: `123456789012@project.gserviceaccount.com`

#### ステップ3: Secret Managerで権限を付与

1. Secret Managerで `gemini-api-key` を開く
2. 「権限」タブをクリック
3. 「プリンシパルを追加」をクリック
4. **新しいプリンシパル**: `PROJECT_NUMBER@project.gserviceaccount.com` を入力
5. **ロール**: 「Secret Manager シークレット アクセサー」を選択
6. 「保存」をクリック

### 方法3: コマンドラインで権限を付与（プロジェクト番号を使用）

プロジェクト番号が分かっている場合：

```bash
# プロジェクト番号を取得（例: 123456789012）
PROJECT_NUMBER=$(gcloud projects describe singular-server-480006-s8 --format="value(projectNumber)")

# 権限を付与
gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:${PROJECT_NUMBER}@project.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --project=singular-server-480006-s8
```

## 確認方法

### サービスアカウントの一覧を確認

Google Cloud Consoleで：
1. 「IAMと管理」→「サービスアカウント」にアクセス
2. 以下の形式のアカウントを探す：
   - `PROJECT_NUMBER@project.gserviceaccount.com`
   - `PROJECT_ID@appspot.gserviceaccount.com`

### 権限が正しく付与されているか確認

Secret Managerで：
1. `gemini-api-key` を開く
2. 「権限」タブを確認
3. サービスアカウントが表示されていればOK ✓

## 推奨手順

1. **まずApp Engineを初期化**（方法1）
   - これにより、正しいサービスアカウントが自動的に作成されます

2. **サービスアカウントを確認**

3. **Secret Managerで権限を付与**

この順序で進めると、エラーを回避できます。


