# Gemini APIキーの問題と解決方況E

## エラー

```
API key not valid. Please pass a valid API key.
```

## 原因

Secret Managerに保存されてぁE��Gemini APIキーが無効か、期限�Eれです、E

## 解決方況E

### 1. 新しいGemini APIキーを取征E

1. **Google AI Studioにアクセス**
   - https://aistudio.google.com/apikey

2. **新しいAPIキーを作�E**
   - 「Create API Key」をクリチE��
   - プロジェクトを選抁E
   - 新しいAPIキーをコピ�E

### 2. Secret Managerに新しいAPIキーを追加

```powershell
# 新しいAPIキーをSecret Managerに追加
echo "YOUR_NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=tamron-cloudrun-prod-new
```

### 3. チE�Eロイ�E�忁E��に応じて�E�E

新しいAPIキーを追加した後、バチE��エンド�E自動的に最新バ�EジョンのAPIキーを使用します、E

Secret Managerは`latest`バ�Eジョンを取得するため、新しいバ�Eジョンを追加すれば自動的に使用されます、E

## 現在の状慁E

- **バックエンドAPI**: 正常に動佁E
- **認証ミドルウェア**: 正常に動佁E
- **Gemini APIキー**: 無効�E�更新が忁E��E��E

## 注意事頁E

- 古いAPIキーは削除せず、新しいバ�Eジョンとして追加してください
- これにより、問題が発生した場合にロールバックが可能でぁE
