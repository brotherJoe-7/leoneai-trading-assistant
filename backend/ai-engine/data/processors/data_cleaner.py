import pandas as pd
import numpy as np

class DataCleaner:
    """Clean and prepare market data"""
    
    @staticmethod
    def clean_market_data(df: pd.DataFrame) -> pd.DataFrame:
        """Clean market data"""
        if df.empty:
            return df
        
        # Remove duplicates
        df = df.drop_duplicates()
        
        # Handle missing values
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df[numeric_cols] = df[numeric_cols].ffill().bfill()
        
        # Remove outliers (using IQR method)
        for col in numeric_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            df = df[~((df[col] < (Q1 - 1.5 * IQR)) | (df[col] > (Q3 + 1.5 * IQR)))]
        
        return df
    
    @staticmethod
    def normalize_data(df: pd.DataFrame, columns=None) -> pd.DataFrame:
        """Normalize data between 0 and 1"""
        if columns is None:
            columns = df.select_dtypes(include=[np.number]).columns
        
        df_normalized = df.copy()
        for col in columns:
            if col in df.columns:
                min_val = df[col].min()
                max_val = df[col].max()
                if max_val > min_val:
                    df_normalized[col] = (df[col] - min_val) / (max_val - min_val)
        
        return df_normalized