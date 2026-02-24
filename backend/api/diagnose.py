"""
Quick fix script to diagnose and restart the backend server
"""

import subprocess
import sys
import time
import requests


def check_port(port):
    """Check if a port is in use"""
    try:
        response = requests.get(f"http://localhost:{port}/health", timeout=2)
        return response.status_code == 200
    except:
        return False


def main():
    print("🔍 LeoneAI Backend Diagnostic Tool")
    print("=" * 50)

    # Check if backend is responding
    print("\n1. Checking backend health (port 8000)...")
    if check_port(8000):
        print("   ✅ Backend is responding!")
        return
    else:
        print("   ❌ Backend is not responding")

    # Check if frontend is running
    print("\n2. Checking frontend (port 5173)...")
    try:
        response = requests.get("http://localhost:5173", timeout=2)
        print("   ✅ Frontend is running")
    except:
        print("   ❌ Frontend is not running")

    # Try to import the app
    print("\n3. Testing backend imports...")
    try:
        sys.path.insert(0, ".")
        from app.main import app

        print("   ✅ Backend imports successful")
    except Exception as e:
        print(f"   ❌ Import error: {e}")
        return

    print("\n4. Recommendations:")
    print("   • Stop the current backend process")
    print("   • Run: cd backend/api")
    print("   • Run: .venv\\Scripts\\activate")
    print("   • Run: uvicorn app.main:app --reload --port 8000 --log-level debug")
    print("\n   This will show detailed error messages.")


if __name__ == "__main__":
    main()
