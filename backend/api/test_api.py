import requests

BASE_URL = "http://localhost:8000/api/v1"


def test_api():
    # 1. Login
    print("Logging in...")
    try:
        resp = requests.post(
            f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"}
        )
        if resp.status_code != 200:
            print(f"Login failed: {resp.status_code} {resp.text}")
            return

        data = resp.json()
        token = data.get("access_token")
        print(f"Login successful. Token: {token[:10]}...")

        # 2. Deposit
        print("Attempting deposit...")
        headers = {"Authorization": f"Bearer {token}"}
        # Note: params vs data depending on endpoint definition
        # Endpoint: async def deposit_funds(amount_sll: float, ...)
        # These are query params by default in FastAPI
        resp = requests.post(
            f"{BASE_URL}/portfolio/deposit",
            params={"amount_sll": 5000, "payment_method": "ORANGE"},
            headers=headers,
        )

        print(f"Deposit status: {resp.status_code}")
        print(f"Deposit response: {resp.text}")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    test_api()
