# Artifact Registry権限エラーの解決方法

## エラー内容

```
Permission "artifactregistry.repositories.downloadArtifacts" denied on resource 
"projects/singular-server-480006-s8/locations/asia/repositories/asia.gcr.io"
```

## 原因

Cloud BuildサービスアカウントがArtifact Registryにアクセスできない。

## 解決方法

Cloud BuildサービスアカウントにArtifact Registryへのアクセス権限を付与：

```powershell
# Artifact Registry書き込み権限
gcloud projects add-iam-policy-binding singular-server-480006-s8 \
    --member="serviceAccount:284805971012@cloudbuild.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

# Artifact Registry読み取り権限
gcloud projects add-iam-policy-binding singular-server-480006-s8 \
    --member="serviceAccount:284805971012@cloudbuild.gserviceaccount.com" \
    --role="roles/artifactregistry.reader"
```

## 確認方法

権限が正しく付与されたか確認：

```powershell
gcloud projects get-iam-policy singular-server-480006-s8 \
    --flatten="bindings[].members" \
    --filter="bindings.members:284805971012@cloudbuild.gserviceaccount.com"
```

## 権限付与後のデプロイ

権限を付与したら、再度デプロイを実行：

```powershell
gcloud app deploy app.yaml --project=singular-server-480006-s8
```


