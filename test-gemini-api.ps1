# Gemini APIキー更新後のテスト

$backendUrl = "https://ai-drbfm-backend-43iql33sfa-an.a.run.app"
$apiKey = "Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru"

Write-Host "=== Testing Gemini API after key update ===" -ForegroundColor Cyan
Write-Host ""

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
    "maxOutputTokens": 50
  },
  "model": "gemini-2.5-flash",
  "apiVersion": "v1beta"
}
"@

Write-Host "Calling Gemini API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/gemini" -Method POST -Headers $headers -Body $jsonBody
    Write-Host "SUCCESS: Gemini API is working" -ForegroundColor Green
    if ($response.candidates -and $response.candidates[0].content.parts[0].text) {
        $text = $response.candidates[0].content.parts[0].text
        Write-Host "Response: $text"
    } else {
        Write-Host ($response | ConvertTo-Json -Depth 3)
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
Write-Host "=== Test completed ===" -ForegroundColor Cyan
