# Cloud RunチE�Eロイ成功�E�E

## チE�Eロイ完亁E

✁ECloud Runサービスが正常にチE�Eロイされました、E

### サービス惁E��

- **サービス吁E*: `ai-drbfm-backend`
- **リージョン**: `asia-northeast1`
- **URL**: `https://ai-drbfm-backend-284805971012.asia-northeast1.run.app`
- **リビジョン**: `ai-drbfm-backend-00002-dml`

### 完亁E��た作業

1. ✁EArtifact Registryリポジトリ `ai-drbfm-backend` の作�E
2. ✁ECloud Run APIの有効匁E
3. ✁EDockerfileと.dockerignoreの作�E
4. ✁E忁E��なIAM権限�E設宁E
   - Storage Admin (Cloud BuildサービスアカウンチE
   - Artifact Registry Writer (Compute EngineサービスアカウンチE
   - Cloud Run Admin (Compute EngineサービスアカウンチE
   - Secret Manager Secret Accessor (Compute EngineサービスアカウンチE
   - Logging Log Writer (Compute EngineサービスアカウンチE
5. ✁EDockerイメージのビルドとArtifact Registryへのプッシュ
6. ✁ECloud RunへのチE�Eロイ

### 次のスチE��チE

#### 1. フロントエンド�E設宁E

フロントエンド！Eai-drbfm.html`�E�を更新して、ローカルのAPIキーではなく、Cloud RunのバックエンドAPIを使用するように変更する忁E��があります、E

**変更が忁E��なファイル**: `ai-drbfm.js`

```javascript
// 変更前（ローカル開発用�E�E
const apiKey = window.GEMINI_API_KEY;

// 変更後（本番環墁E���E�E
const backendUrl = 'https://ai-drbfm-backend-284805971012.asia-northeast1.run.app';
// API呼び出しをバックエンド経由に変更
```

#### 2. Cloud Buildトリガーの設定（オプション�E�E

GitHubにプッシュするた�Eに自動的にチE�EロイされるよぁE��、Cloud Buildトリガーを設定できます、E

**Google Cloud Consoleで設宁E*:
1. https://console.cloud.google.com/cloud-build/triggers?project=singular-server-480006-s8 にアクセス
2. 「トリガーを作�E」をクリチE��
3. 以下�E設定を入力！E
   - **イベンチE*: GitHub�E�Eloud Build�E�E
   - **リポジトリ**: `tamron-cp2-ai-dx-source`
   - **構�E**: Cloud Build 構�Eファイル
   - **場所**: `/cloudbuild.yaml`
   - **ブランチE*: `^master$`

#### 3. サービスのチE��チE

バックエンドAPIが正常に動作してぁE��か確認！E

```bash
curl https://ai-drbfm-backend-284805971012.asia-northeast1.run.app/api/health
```

また�E、ブラウザで以下�EURLにアクセス�E�E
```
https://ai-drbfm-backend-284805971012.asia-northeast1.run.app/api/health
```

### トラブルシューチE��ング

#### サービスにアクセスできなぁE��吁E

1. IAMポリシーを確認！E
   ```bash
   gcloud run services get-iam-policy ai-drbfm-backend --region=asia-northeast1 --project=singular-server-480006-s8
   ```

2. ログを確認！E
   ```bash
   gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ai-drbfm-backend" --limit 50 --project=singular-server-480006-s8
   ```

#### Secret Managerへのアクセスエラー

Cloud RunサービスアカウントにSecret Managerへのアクセス権限があることを確認！E
```bash
gcloud secrets get-iam-policy gemini-api-key --project=singular-server-480006-s8
```

### 参老E��ンク

- Cloud Runコンソール: https://console.cloud.google.com/run?project=singular-server-480006-s8
- Cloud Buildコンソール: https://console.cloud.google.com/cloud-build?project=singular-server-480006-s8
- Artifact Registry: https://console.cloud.google.com/artifacts?project=singular-server-480006-s8


