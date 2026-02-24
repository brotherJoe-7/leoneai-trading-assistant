import redis
import json
import pickle
from datetime import timedelta
import os

class CacheManager:
    """Redis cache manager"""
    
    def __init__(self):
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.redis_client = redis.from_url(redis_url)
    
    def set(self, key: str, value, expire_minutes: int = 5):
        """Set cache value with expiration"""
        try:
            serialized = pickle.dumps(value)
            self.redis_client.setex(key, timedelta(minutes=expire_minutes), serialized)
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    def get(self, key: str):
        """Get cache value"""
        try:
            data = self.redis_client.get(key)
            if data:
                return pickle.loads(data)
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    def delete(self, key: str):
        """Delete cache key"""
        try:
            return self.redis_client.delete(key)
        except Exception as e:
            print(f"Cache delete error: {e}")
            return 0
    
    def clear_all(self):
        """Clear all cache"""
        try:
            self.redis_client.flushdb()
            return True
        except Exception as e:
            print(f"Cache clear error: {e}")
            return False