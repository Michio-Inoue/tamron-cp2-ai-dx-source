# Google Cloud CLI 認証手順

## 再認証が必要な場合

`Please enter your password:` というメッセージが表示された場合、Google Cloud CLIの再認証が必要です。

## 認証方法

### 方法1: ブラウザで認証（推奨）

PowerShellで以下を実行：

```powershell
gcloud auth login
```

1. コマンドを実行すると、ブラウザが自動的に開きます
2. Googleアカウント（`inoue@tamron-compo2.com`）でログイン
3. 「許可」をクリック
4. 認証が完了すると、PowerShellに「認証が成功しました」と表示されます

### 方法2: アプリケーションのデフォルト認証情報を設定

```powershell
gcloud auth application-default login
```

このコマンドもブラウザで認証を行います。

## 認証後の確認

認証が完了したら、以下で確認：

```powershell
gcloud auth list
```

以下のように表示されればOK：
```
Credentialed Accounts
ACTIVE  ACCOUNT
*       inoue@tamron-compo2.com
```

## 認証後の次のステップ

認証が完了したら、以下を実行：

```powershell
# プロジェクトを設定
gcloud config set project singular-server-480006-s8

# 設定を確認
gcloud config get-value project
```

その後、デプロイを実行：

```powershell
cd backend
gcloud app deploy app.yaml
```

## トラブルシューティング

### ブラウザが開かない場合

1. 手動でブラウザを開く
2. 以下のURLにアクセス：
   ```
   https://accounts.google.com/o/oauth2/auth?...
   ```
   （コマンド実行時に表示されるURLを使用）

### 認証が失敗する場合

1. 正しいGoogleアカウントでログインしているか確認
2. プロジェクトへのアクセス権限があるか確認
3. ネットワーク接続を確認

### 認証後も「Please enter your password:」が表示される場合

1. 認証状態を確認：
   ```powershell
   gcloud auth list
   ```

2. 再度認証を試す：
   ```powershell
   gcloud auth login --no-launch-browser
   ```


