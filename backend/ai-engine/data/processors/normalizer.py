import pandas as pd

class DataNormalizer:
    """Normalize data for analysis"""
    
    @staticmethod
    def normalize_for_strategy(df: pd.DataFrame) -> pd.DataFrame:
        """Prepare data for strategy analysis"""
        if df.empty:
            return df
        
        df_normalized = df.copy()
        
        # Calculate returns
        if 'Close' in df.columns:
            df_normalized['returns'] = df['Close'].pct_change()
            df_normalized['log_returns'] = np.log(df['Close'] / df['Close'].shift(1))
        
        # Calculate volatility
        if 'returns' in df_normalized.columns:
            df_normalized['volatility'] = df_normalized['returns'].rolling(window=20).std()
        
        return df_normalized.dropna()