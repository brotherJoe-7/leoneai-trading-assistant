# LeoneAI API Reference

Base URL: `http://localhost:8000` (development)

All protected endpoints require a JWT in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

## Authentication

### POST `/api/v1/auth/login`

Login with email and password (form-encoded).

**Request** (`application/x-www-form-urlencoded`)
| Field | Type | Required |
|-------|------|----------|
| `username` | string | ✅ |
| `password` | string | ✅ |

**Response 200**

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

---

### POST `/api/v1/auth/register`

Register a new user.

**Request** (`application/json`)

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "Amadu Bah"
}
```

**Response 201**

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Amadu Bah",
  "plan_type": "FREE",
  "is_active": true
}
```

---

## Users

### GET `/api/v1/users/me` 🔒

Get the currently authenticated user.

**Response 200**

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Amadu Bah",
  "plan_type": "PRO",
  "is_active": true,
  "is_superuser": false
}
```

---

## Portfolio

### GET `/api/v1/portfolio` 🔒

Get portfolio summary.

**Response 200**

```json
{
  "total_value_sll": 1234567.89,
  "total_value_usd": 52.12,
  "cash_balance_sll": 500000.0,
  "holdings": []
}
```

---

### GET `/api/v1/portfolio/holdings` 🔒

List all current holdings.

**Response 200** — array of holding objects.

---

### POST `/api/v1/portfolio/deposit` 🔒

Deposit funds into the portfolio.

**Request**

```json
{
  "amount_sll": 100000,
  "payment_method": "Orange Money",
  "phone_number": "+232761234567"
}
```

| Field            | Type   | Required          |
| ---------------- | ------ | ----------------- |
| `amount_sll`     | float  | ✅                |
| `payment_method` | string | ✅                |
| `phone_number`   | string | For mobile money  |
| `email`          | string | For PayPal        |
| `card_last4`     | string | For Stripe / Visa |

**Supported `payment_method` values:** `Orange Money`, `Afrimoney`, `Bank Transfer`, `PayPal`, `Stripe`, `Visa/Mastercard`

**Response 200**

```json
{
  "message": "Deposit of Le 100,000 successful via Orange Money to +232761234567",
  "amount_sll": 100000,
  "payment_method": "Orange Money",
  "new_balance_sll": 600000
}
```

---

### POST `/api/v1/portfolio/withdraw` 🔒

Withdraw funds from the portfolio.

**Request**

```json
{
  "amount_sll": 50000,
  "payment_method": "Afrimoney",
  "account_details": "+232791234567"
}
```

**Response 200**

```json
{
  "message": "Withdrawal of Le 50,000 to Afrimoney account +232791234567 initiated",
  "amount_sll": 50000,
  "payment_method": "Afrimoney",
  "new_balance_sll": 550000
}
```

---

### POST `/api/v1/portfolio/trade` 🔒

Execute a buy or sell trade.

**Request**

```json
{
  "symbol": "BTC/USD",
  "action": "BUY",
  "quantity": 0.001,
  "price": 54126.4
}
```

---

## Signals

### GET `/api/v1/signals` 🔒

List trading signals (filtered + paginated).

**Query Params**
| Param | Type | Default |
|-------|------|---------|
| `category` | string | `all` |
| `limit` | int | `20` |
| `offset` | int | `0` |

**Response 200** — array of signal objects.

---

### POST `/api/v1/signals/{signal_id}/follow` 🔒

Follow a signal to receive updates.

**Response 200**

```json
{ "message": "Now following signal 3" }
```

---

## Subscriptions

### GET `/api/v1/subscriptions/current` 🔒

Get the user's current active subscription.

---

### POST `/api/v1/subscriptions/upgrade` 🔒

Upgrade the user's subscription plan.

**Request**

```json
{ "plan_type": "PRO" }
```

**Supported `plan_type` values:** `FREE`, `PRO`, `PREMIUM`

**Response 200**

```json
{
  "message": "Subscription upgraded to PRO",
  "plan_type": "PRO"
}
```

---

## Error Responses

| Code | Meaning                                         |
| ---- | ----------------------------------------------- |
| 400  | Bad Request — validation error                  |
| 401  | Unauthorized — invalid or missing token         |
| 403  | Forbidden — insufficient permissions            |
| 404  | Not Found                                       |
| 422  | Unprocessable Entity — schema validation failed |
| 500  | Internal Server Error                           |

All errors return:

```json
{ "detail": "Human-readable error message" }
```
