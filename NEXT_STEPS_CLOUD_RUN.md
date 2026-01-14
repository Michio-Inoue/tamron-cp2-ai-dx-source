# Cloud Runデプロイの次のステップ

## 完了した作業

✅ App Engine設定ファイルの削除
✅ .gitignoreの更新
✅ cloudbuild.yamlの作成
✅ 過去のコミットから.envを削除
✅ GitHubへのプッシュ成功

## 次のステップ

### ステップ1: Artifact Registryリポジトリの確認と作成

Cloud Runにデプロイするには、Artifact Registryリポジトリが必要です。

#### リポジトリが存在するか確認

```powershell
gcloud artifacts repositories list --project=singular-server-480006-s8 --location=asia-northeast1
```

#### リポジトリが存在しない場合、作成

```powershell
gcloud artifacts repositories create ai-drbfm-backend \
    --repository-format=docker \
    --location=asia-northeast1 \
    --project=singular-server-480006-s8 \
    --description="AI-DRBFM Backend Docker images"
```

### ステップ2: Cloud Buildトリガーの確認と作成

#### トリガーが存在するか確認

Google Cloud Consoleで確認：
```
https://console.cloud.google.com/cloud-build/triggers?project=singular-server-480006-s8
```

#### トリガーが存在しない場合、作成

1. **Google Cloud Consoleでトリガーを作成**
   - URL: https://console.cloud.google.com/cloud-build/triggers/create?project=singular-server-480006-s8
   - **イベント**: GitHub（Cloud Build）を選択
   - **リポジトリ**: `tamron-cp2-ai-dx-source` を選択
   - **構成**: 「Cloud Build 構成ファイル」を選択
   - **場所**: `/cloudbuild.yaml` を指定
   - **ブランチ**: `master` を指定
   - **名前**: `deploy-to-cloud-run` など

2. **または、コマンドラインで作成**

```powershell
gcloud builds triggers create github \
    --repo-name=tamron-cp2-ai-dx-source \
    --repo-owner=Michio-Inoue \
    --branch-pattern="^master$" \
    --build-config=cloudbuild.yaml \
    --name=deploy-to-cloud-run \
    --project=singular-server-480006-s8
```

### ステップ3: Cloud Run APIの有効化

```powershell
gcloud services enable run.googleapis.com --project=singular-server-480006-s8
```

### ステップ4: 手動でビルドを実行（テスト）

トリガーが設定される前に、手動でビルドを実行してテスト：

```powershell
gcloud builds submit --config=cloudbuild.yaml --project=singular-server-480006-s8
```

### ステップ5: デプロイの確認

デプロイが完了したら、Cloud RunサービスのURLを確認：

```powershell
gcloud run services list --project=singular-server-480006-s8 --region=asia-northeast1
```

## トラブルシューティング

### Artifact Registryリポジトリが作成できない場合

1. Artifact Registry APIが有効か確認
2. リージョンが正しいか確認（asia-northeast1）

### Cloud Buildトリガーが作成できない場合

1. GitHub連携が正しく設定されているか確認
2. リポジトリへのアクセス権限があるか確認
3. cloudbuild.yamlのパスが正しいか確認

### ビルドが失敗する場合

1. ビルドログを確認：
   ```
   https://console.cloud.google.com/cloud-build/builds?project=singular-server-480006-s8
   ```
2. Dockerfileが存在するか確認
3. 依存関係が正しくインストールされるか確認


