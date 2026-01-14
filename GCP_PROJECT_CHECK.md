# Google Cloud プロジェクト確認方法

## 方法1: gcloudコマンドで確認（推奨）

### 現在のプロジェクトを確認

```bash
# 現在設定されているプロジェクトを確認
gcloud config get-value project
```

### すべてのプロジェクト一覧を表示

```bash
# アクセス可能なすべてのプロジェクトを表示
gcloud projects list
```

### プロジェクトの詳細情報を確認

```bash
# プロジェクトIDを指定して詳細情報を表示
gcloud projects describe PROJECT_ID

# または、現在のプロジェクトの詳細を表示
gcloud projects describe $(gcloud config get-value project)
```

### プロジェクトを切り替える

```bash
# プロジェクトを設定/切り替え
gcloud config set project PROJECT_ID
```

## 方法2: Google Cloud Consoleで確認

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 画面上部のプロジェクト選択ドロップダウンをクリック
3. アクセス可能なすべてのプロジェクトが表示されます
4. プロジェクト名をクリックすると、プロジェクトIDも表示されます

## 方法3: 認証状態を確認

```bash
# 現在ログインしているアカウントを確認
gcloud auth list

# ログインが必要な場合
gcloud auth login
```

## 方法4: 設定情報をすべて確認

```bash
# すべての設定情報を表示
gcloud config list

# 設定可能な項目を表示
gcloud config list --all
```

## よく使うコマンド一覧

```bash
# 現在のプロジェクトIDを取得（スクリプトで使用）
gcloud config get-value project

# プロジェクト一覧をJSON形式で取得
gcloud projects list --format="json"

# プロジェクト一覧を表形式で表示（プロジェクトID、名前、プロジェクト番号）
gcloud projects list --format="table(projectId,name,projectNumber)"
```

## プロジェクトが見つからない場合

### 新しいプロジェクトを作成

```bash
# プロジェクトを作成
gcloud projects create PROJECT_ID --name="プロジェクト名"

# プロジェクトを設定
gcloud config set project PROJECT_ID

# 請求先アカウントをリンク（初回のみ）
gcloud billing projects link PROJECT_ID --billing-account=BILLING_ACCOUNT_ID
```

または、Google Cloud Consoleから：
1. [プロジェクト作成ページ](https://console.cloud.google.com/projectcreate)にアクセス
2. プロジェクト名を入力
3. 「作成」をクリック

## トラブルシューティング

### 認証エラーが発生する場合

```bash
# 再認証
gcloud auth login

# アプリケーションのデフォルト認証情報を設定
gcloud auth application-default login
```

### プロジェクトにアクセスできない場合

1. プロジェクトの所有者または編集者権限があるか確認
2. 正しいGoogleアカウントでログインしているか確認
3. 組織のポリシーでプロジェクトへのアクセスが制限されていないか確認

### プロジェクトIDとプロジェクト番号の違い

- **プロジェクトID**: 人間が読みやすい識別子（例: `my-project-12345`）
- **プロジェクト番号**: システムが使用する数値識別子（例: `123456789012`）

どちらもプロジェクトを一意に識別しますが、コマンドでは通常プロジェクトIDを使用します。


