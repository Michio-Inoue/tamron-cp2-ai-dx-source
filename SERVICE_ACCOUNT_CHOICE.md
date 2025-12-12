# サービスアカウントの選択：既存 vs 新規

## 重要なポイント

**App Engineの初期化時には、サービスアカウントを選択する必要はありません。**
App Engineは自動的にデフォルトのサービスアカウントを作成します。

## 選択肢の比較

### オプション1: 既存のサービスアカウント（git-deployer）を使用

**メリット:**
- ✅ 既に設定済みで、権限管理が統一される
- ✅ 新しいサービスアカウントを作成する必要がない
- ✅ 既存のワークフローと統合しやすい

**デメリット:**
- ⚠️ 他の用途（Gitデプロイなど）と混在する可能性
- ⚠️ 権限が広すぎる可能性（最小権限の原則に反する）

**推奨される場合:**
- 既にgit-deployerが適切に設定されている
- 権限管理を統一したい
- シンプルに運用したい

### オプション2: App Engineのデフォルトサービスアカウントを使用（推奨）

**メリット:**
- ✅ App Engine専用のサービスアカウントで、用途が明確
- ✅ 最小権限の原則に従える
- ✅ セキュリティベストプラクティスに準拠
- ✅ App Engineが自動的に作成・管理するため、設定が簡単

**デメリット:**
- ⚠️ 新しいサービスアカウントが作成される（ただし自動）

**推奨される場合:**
- セキュリティを重視する
- 用途ごとにサービスアカウントを分けたい
- Google Cloudのベストプラクティスに従いたい

## 推奨事項

### 🎯 推奨: App Engineのデフォルトサービスアカウントを使用

**理由:**
1. **セキュリティ**: 最小権限の原則に従える
2. **明確性**: App Engine専用のサービスアカウントで、用途が明確
3. **管理のしやすさ**: App Engineが自動的に管理する
4. **ベストプラクティス**: Google Cloudの推奨方法

### 手順（デフォルトサービスアカウントを使用する場合）

1. **App Engineを初期化**（サービスアカウントの選択は不要）
   - App Engineが自動的にデフォルトサービスアカウントを作成します

2. **デフォルトサービスアカウントのメールアドレスを確認**
   - 形式: `PROJECT_NUMBER@project.gserviceaccount.com`
   - または: `PROJECT_ID@appspot.gserviceaccount.com`
   - 確認方法: https://console.cloud.google.com/iam-admin/serviceaccounts?project=singular-server-480006-s8

3. **Secret Managerで権限を付与**
   - 確認したデフォルトサービスアカウントのメールアドレスを使用

4. **app.yamlはそのまま使用**
   - `service_account: default` のままでOK

### 既存のサービスアカウント（git-deployer）を使用する場合

もし既存のサービスアカウントを使いたい場合は：

1. **App Engineを初期化**（そのまま進める）

2. **既存のサービスアカウント（git-deployer）に権限を付与**
   - Secret Managerで `git-deployer` のメールアドレスを使用

3. **app.yamlを更新**（オプション）
   ```yaml
   service_account: git-deployer@singular-server-480006-s8.iam.gserviceaccount.com
   ```
   （実際のメールアドレスに置き換えてください）

## 結論

**推奨: App Engineのデフォルトサービスアカウントを使用**

- App Engineの初期化を進める
- 初期化後、自動的に作成されたデフォルトサービスアカウントを確認
- そのサービスアカウントにSecret Managerへの権限を付与
- `app.yaml` は `service_account: default` のままでOK

これが最もシンプルで、セキュリティベストプラクティスに準拠した方法です。

