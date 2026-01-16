$apiKey = "Lh8zeq73nXtaiMm5HSy4plGKNoxC9Qru"
$url = "https://ai-drbfm-backend-43iql33sfa-an.a.run.app/api/gemini"

$jsonBody = @"
{
  "contents": [
    {
      "parts": [
        {
          "text": "Hello, world!"
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

$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", "application/json")
$headers.Add("X-API-Key", $apiKey)

Write-Host "Testing with API key..."
try {
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $jsonBody
    Write-Host "SUCCESS: API key authentication is working"
    Write-Host ($response | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
}
