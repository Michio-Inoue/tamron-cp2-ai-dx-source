# Artifact Registry権限エラーの解決方況E

## エラー冁E��

```
Permission "artifactregistry.repositories.downloadArtifacts" denied on resource 
"projects/singular-server-480006-s8/locations/asia/repositories/asia.gcr.io"
```

## 原因

Cloud BuildサービスアカウントがArtifact RegistryにアクセスできなぁE��E

## 解決方況E

Cloud BuildサービスアカウントにArtifact Registryへのアクセス権限を付与！E

```powershell
# Artifact Registry書き込み権陁E
gcloud projects add-iam-policy-binding singular-server-480006-s8 \
    --member="serviceAccount:284805971012@cloudbuild.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

# Artifact Registry読み取り権陁E
gcloud projects add-iam-policy-binding singular-server-480006-s8 \
    --member="serviceAccount:284805971012@cloudbuild.gserviceaccount.com" \
    --role="roles/artifactregistry.reader"
```

## 確認方況E

権限が正しく付与されたか確認！E

```powershell
gcloud projects get-iam-policy singular-server-480006-s8 \
    --flatten="bindings[].members" \
    --filter="bindings.members:284805971012@cloudbuild.gserviceaccount.com"
```

## 権限付与後�EチE�Eロイ

権限を付与したら、�E度チE�Eロイを実行！E

```powershell
gcloud app deploy app.yaml --project=singular-server-480006-s8
```


