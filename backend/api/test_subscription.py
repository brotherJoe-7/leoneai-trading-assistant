import requests
import sys

BASE_URL = "http://localhost:8092/api/v1"

# Create a test user or login existing one
# For simplicity, we'll try to login with the user created in previous tests 'testuser'
# If not exists, we might fail, but let's assume test_api.py ran successfully

USERNAME = "testuser"
PASSWORD = "password123"


def register():
    print("User not found, registering...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={
                "username": USERNAME,
                "email": f"{USERNAME}@example.com",
                "password": PASSWORD,
                "full_name": "Test User",
            },
        )
        if response.status_code == 200:
            print("Registration successful.")
            return True
        else:
            print(f"Registration failed: {response.text}")
            return False
    except Exception as e:
        print(f"Registration error: {e}")
        return False


def get_token():
    print("Logging in...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data={"username": USERNAME, "password": PASSWORD},
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        elif response.status_code == 401:
            if register():
                # Retry login
                return get_token()
            return None
        else:
            print(f"Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"Login error: {e}")
        return None


def test_subscription():
    token = get_token()
    if not token:
        print("Cannot proceed without token.")
        sys.exit(1)

    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get current subscription (should be FREE default)
    print("\n1. Getting current subscription...")
    res = requests.get(f"{BASE_URL}/subscription/me", headers=headers)
    print(f"Status: {res.status_code}")
    print(res.json())

    if res.status_code != 200:
        print("Failed to get subscription")
        sys.exit(1)

    current_plan = res.json().get("plan_type")
    print(f"Current Plan: {current_plan}")

    # 2. Upgrade to PREMIUM
    print("\n2. Upgrading to PREMIUM...")
    res = requests.post(
        f"{BASE_URL}/subscription/upgrade",
        headers=headers,
        json={"plan_type": "PREMIUM"},
    )
    print(f"Status: {res.status_code}")
    print(res.json())

    if res.status_code == 200 and res.json().get("plan_type") == "PREMIUM":
        print("Upgrade Successful!")
    else:
        print("Upgrade Failed")
        sys.exit(1)

    # 3. Verify Upgrade
    print("\n3. Verifying Upgrade...")
    res = requests.get(f"{BASE_URL}/subscription/me", headers=headers)
    new_plan = res.json().get("plan_type")
    print(f"New Plan: {new_plan}")

    if new_plan != "PREMIUM":
        print("Verification Failed: Plan didn't update")
        sys.exit(1)

    # 4. Cancel (Downgrade to FREE)
    print("\n4. Cancelling Subscription (Downgrade to FREE)...")
    res = requests.post(f"{BASE_URL}/subscription/cancel", headers=headers)
    print(f"Status: {res.status_code}")
    print(res.json())

    # 5. Verify Cancellation
    print("\n5. Verifying Cancellation...")
    res = requests.get(f"{BASE_URL}/subscription/me", headers=headers)
    final_plan = res.json().get("plan_type")
    print(f"Final Plan: {final_plan}")

    if final_plan == "FREE":
        print("Cancellation Verified!")
    else:
        print("Cancellation Failed")
        sys.exit(1)

    print("\nAll Subscription Tests Passed!")


if __name__ == "__main__":
    test_subscription()
