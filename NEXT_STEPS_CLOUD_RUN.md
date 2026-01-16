# Cloud RunチE�Eロイの次のスチE��チE

## 完亁E��た作業

✁EApp Engine設定ファイルの削除
✁E.gitignoreの更新
✁Ecloudbuild.yamlの作�E
✁E過去のコミットかめEenvを削除
✁EGitHubへのプッシュ成功

## 次のスチE��チE

### スチE��チE: Artifact Registryリポジトリの確認と作�E

Cloud RunにチE�Eロイするには、Artifact Registryリポジトリが忁E��です、E

#### リポジトリが存在するか確誁E

```powershell
gcloud artifacts repositories list --project=singular-server-480006-s8 --location=asia-northeast1
```

#### リポジトリが存在しなぁE��合、作�E

```powershell
gcloud artifacts repositories create ai-drbfm-backend \
    --repository-format=docker \
    --location=asia-northeast1 \
    --project=singular-server-480006-s8 \
    --description="AI-DRBFM Backend Docker images"
```

### スチE��チE: Cloud Buildトリガーの確認と作�E

#### トリガーが存在するか確誁E

Google Cloud Consoleで確認！E
```
https://console.cloud.google.com/cloud-build/triggers?project=singular-server-480006-s8
```

#### トリガーが存在しなぁE��合、作�E

1. **Google Cloud Consoleでトリガーを作�E**
   - URL: https://console.cloud.google.com/cloud-build/triggers/create?project=singular-server-480006-s8
   - **イベンチE*: GitHub�E�Eloud Build�E�を選抁E
   - **リポジトリ**: `tamron-cp2-ai-dx-source` を選抁E
   - **構�E**: 「Cloud Build 構�Eファイル」を選抁E
   - **場所**: `/cloudbuild.yaml` を指宁E
   - **ブランチE*: `master` を指宁E
   - **名前**: `deploy-to-cloud-run` など

2. **また�E、コマンドラインで作�E**

```powershell
gcloud builds triggers create github \
    --repo-name=tamron-cp2-ai-dx-source \
    --repo-owner=Michio-Inoue \
    --branch-pattern="^master$" \
    --build-config=cloudbuild.yaml \
    --name=deploy-to-cloud-run \
    --project=singular-server-480006-s8
```

### スチE��チE: Cloud Run APIの有効匁E

```powershell
gcloud services enable run.googleapis.com --project=singular-server-480006-s8
```

### スチE��チE: 手動でビルドを実行（テスト！E

トリガーが設定される前に、手動でビルドを実行してチE��ト！E

```powershell
gcloud builds submit --config=cloudbuild.yaml --project=singular-server-480006-s8
```

### スチE��チE: チE�Eロイの確誁E

チE�Eロイが完亁E��たら、Cloud RunサービスのURLを確認！E

```powershell
gcloud run services list --project=singular-server-480006-s8 --region=asia-northeast1
```

## トラブルシューチE��ング

### Artifact Registryリポジトリが作�EできなぁE��吁E

1. Artifact Registry APIが有効か確誁E
2. リージョンが正しいか確認！Esia-northeast1�E�E

### Cloud Buildトリガーが作�EできなぁE��吁E

1. GitHub連携が正しく設定されてぁE��か確誁E
2. リポジトリへのアクセス権限があるか確誁E
3. cloudbuild.yamlのパスが正しいか確誁E

### ビルドが失敗する場吁E

1. ビルドログを確認！E
   ```
   https://console.cloud.google.com/cloud-build/builds?project=singular-server-480006-s8
   ```
2. Dockerfileが存在するか確誁E
3. 依存関係が正しくインスト�Eルされるか確誁E


