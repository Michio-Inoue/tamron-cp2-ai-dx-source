# Secret ManagerのAPIキー名

## 現在のAPIキー

Secret Managerに保存されているAPIキーは以下の2つです：

### 1. Gemini APIキー
- **シークレット名**: `gemini-api-key`
- **用途**: Gemini APIを呼び出すために使用
- **現在の状態**: 無効（漏洩報告により無効化）
- **バージョン**: 2（両方とも無効）

### 2. バックエンドAPIキー
- **シークレット名**: `backend-api-key`
- **用途**: フロントエンドからバックエンドAPIにアクセスする際の認証に使用
- **現在の状態**: 正常
- **値**: `Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru`

## 新しいGemini APIキーを追加する場合

新しいGemini APIキーを取得したら、以下のコマンドで`gemini-api-key`に追加してください：

```powershell
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

## 確認方法

現在のシークレット一覧を確認：

```powershell
gcloud secrets list --project=tamron-cloudrun-prod-new
```

特定のシークレットのバージョンを確認：

```powershell
gcloud secrets versions list gemini-api-key --project=tamron-cloudrun-prod-new
gcloud secrets versions list backend-api-key --project=tamron-cloudrun-prod-new
```
