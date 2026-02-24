from fastapi import APIRouter, Request, HTTPException
import hmac
import hashlib
import json

router = APIRouter()

WEBHOOK_SECRET = "your-webhook-secret-change-in-production"  # Move to env

@router.post("/mobile-money")
async def mobile_money_webhook(request: Request):
    """Webhook for mobile money payments (Orange Money, Africell)"""
    # Verify webhook signature
    signature = request.headers.get("X-Webhook-Signature")
    body = await request.body()
    
    # Verify signature
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Process webhook
    data = await request.json()
    
    # TODO: Process mobile money payment
    # Example: {"transaction_id": "123", "amount": 100000, "currency": "SLL", "status": "completed"}
    
    return {
        "status": "received",
        "message": "Mobile money webhook processed",
        "data": data
    }