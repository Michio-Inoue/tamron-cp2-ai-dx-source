# フロントエンドからAPIを呼び出すテスト

$backendUrl = "https://ai-drbfm-backend-43iql33sfa-an.a.run.app"
$apiKey = "Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru"

Write-Host "=== フロントエンドからAPIを呼び出すテスト ===" -ForegroundColor Cyan
Write-Host ""

# 1. ルートエンドポイント（認証不要）
Write-Host "1. ルートエンドポイント（認証不要）:" -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "$backendUrl/" -Method GET
    Write-Host "SUCCESS: " -ForegroundColor Green -NoNewline
    Write-Host ($root | ConvertTo-Json)
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 2. ヘルスチェック（認証不要）
Write-Host "2. ヘルスチェック（認証不要）:" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET
    Write-Host "SUCCESS: " -ForegroundColor Green -NoNewline
    Write-Host ($health | ConvertTo-Json)
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 3. Gemini API（認証必要）
Write-Host "3. Gemini API（認証必要）:" -ForegroundColor Yellow
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", "application/json")
$headers.Add("X-API-Key", $apiKey)

$jsonBody = @"
{
  "contents": [
    {
      "parts": [
        {
          "text": "Hello, this is a test."
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 100
  },
  "model": "gemini-2.5-flash",
  "apiVersion": "v1beta"
}
"@

try {
    $gemini = Invoke-RestMethod -Uri "$backendUrl/api/gemini" -Method POST -Headers $headers -Body $jsonBody
    Write-Host "SUCCESS: API認証が動作しています" -ForegroundColor Green
    if ($gemini.candidates -and $gemini.candidates[0].content.parts[0].text) {
        $text = $gemini.candidates[0].content.parts[0].text
        $preview = if ($text.Length -gt 100) { $text.Substring(0, 100) + "..." } else { $text }
        Write-Host "レスポンス: $preview"
    } else {
        Write-Host ($gemini | ConvertTo-Json -Depth 3)
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
}

Write-Host ""
Write-Host "=== テスト完了 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "ブラウザでテストする場合:" -ForegroundColor Yellow
Write-Host "1. test-api-call.html をブラウザで開く"
Write-Host "2. または、ai-drbfm.html を開いて、ファイルを選択してAI分析を実行"
