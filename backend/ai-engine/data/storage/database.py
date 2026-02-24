from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

Base = declarative_base()

class MarketData(Base):
    """Market data storage model"""
    __tablename__ = 'market_data'
    
    id = Column(Integer, primary_key=True)
    symbol = Column(String(20))
    price = Column(Float)
    volume = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    source = Column(String(50))

class Signal(Base):
    """Trading signal storage model"""
    __tablename__ = 'signals'
    
    id = Column(Integer, primary_key=True)
    symbol = Column(String(20))
    action = Column(String(10))  # BUY, SELL, HOLD
    confidence = Column(Float)
    strategy = Column(String(50))
    timestamp = Column(DateTime, default=datetime.utcnow)
    reason = Column(String(255))

class DatabaseManager:
    """Manage database operations"""
    
    def __init__(self, database_url=None):
        if database_url is None:
            database_url = os.getenv("DATABASE_URL", "sqlite:///./trading.db")
        
        self.engine = create_engine(database_url)
        self.Session = sessionmaker(bind=self.engine)
        Base.metadata.create_all(self.engine)
    
    def save_signal(self, signal_data: dict):
        """Save a trading signal to database"""
        session = self.Session()
        try:
            signal = Signal(**signal_data)
            session.add(signal)
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def get_recent_signals(self, limit=50):
        """Get recent trading signals"""
        session = self.Session()
        try:
            return session.query(Signal).order_by(Signal.timestamp.desc()).limit(limit).all()
        finally:
            session.close()