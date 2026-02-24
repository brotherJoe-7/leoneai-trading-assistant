try {
    Write-Host "Logging in..."
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" -Method Post -Body "username=admin&password=admin123" -ContentType "application/x-www-form-urlencoded"
    $token = $response.access_token
    Write-Host "Token received. Access Token length: $($token.Length)"

    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type"  = "application/json" # API might expect JSON if body is sent, but here deposit uses query params? No, let's check
    }

    # API definition:
    # @router.post("/deposit")
    # async def deposit_funds(amount_sll: float, payment_method: str, ...)
    # These become query params by default in FastAPI if not body.
    
    Write-Host "Attempting deposit..."
    $deposit = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/portfolio/deposit?amount_sll=5000&payment_method=ORANGE_MONEY" -Method Post -Headers $headers
    
    Write-Host "Deposit successful:"
    $deposit | ConvertTo-Json
}
catch {
    Write-Error "Request failed: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errBody" -ForegroundColor Red
    }
}
