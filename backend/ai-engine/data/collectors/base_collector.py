from abc import ABC, abstractmethod
import pandas as pd

class BaseCollector(ABC):
    """Base class for all data collectors"""
    
    @abstractmethod
    def collect(self) -> pd.DataFrame:
        """Collect market data"""
        pass
    
    @abstractmethod
    def validate_data(self, data: pd.DataFrame) -> bool:
        """Validate collected data"""
        pass
    
    def save_to_cache(self, data: pd.DataFrame, key: str):
        """Save data to cache"""
        # TODO: Implement Redis cache
        pass
    
    def load_from_cache(self, key: str) -> pd.DataFrame:
        """Load data from cache"""
        # TODO: Implement Redis cache
        pass