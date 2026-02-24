import pandas as pd
import ta

def calculate_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate technical indicators for given data"""
    if df.empty:
        return df
    
    # Make a copy to avoid modifying original
    df_indicators = df.copy()
    
    # Calculate RSI
    df_indicators['rsi'] = ta.momentum.RSIIndicator(
        close=df_indicators['Close'], window=14
    ).rsi()
    
    # Calculate MACD
    macd = ta.trend.MACD(close=df_indicators['Close'])
    df_indicators['macd'] = macd.macd()
    df_indicators['macd_signal'] = macd.macd_signal()
    df_indicators['macd_diff'] = macd.macd_diff()
    
    # Calculate Moving Averages
    df_indicators['ma_20'] = df_indicators['Close'].rolling(window=20).mean()
    df_indicators['ma_50'] = df_indicators['Close'].rolling(window=50).mean()
    df_indicators['ma_200'] = df_indicators['Close'].rolling(window=200).mean()
    
    # Calculate Bollinger Bands
    bb = ta.volatility.BollingerBands(close=df_indicators['Close'])
    df_indicators['bb_high'] = bb.bollinger_hband()
    df_indicators['bb_low'] = bb.bollinger_lband()
    
    return df_indicators