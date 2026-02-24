#!/usr/bin/env python3
"""
Main AI Trading Engine - Runs 24/7 market analysis
"""

import schedule
import time
from datetime import datetime
import logging

from config.settings import AI_UPDATE_INTERVAL
from data.collectors.crypto_collector import CryptoCollector
from analysis.technical.indicators import calculate_indicators
from strategies.rsi_strategy import RSIStrategy

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.settings import DATABASE_URL
from models.base import Base
from models.signal import Signal

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AIEngine:
    def __init__(self):
        """Initialize AI Trading Engine"""
        self.crypto_collector = CryptoCollector()
        self.strategies = [
            RSIStrategy()
        ]
        
        # Database setup
        self.engine = create_engine(DATABASE_URL)
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine)
        
        logger.info("AI Engine initialized")
    
    def analyze_markets(self):
        """Main analysis loop"""
        try:
            logger.info("Starting market analysis...")
            
            # 1. Collect market data
            market_data = self.crypto_collector.collect()
            
            # 2. Calculate indicators
            indicators = calculate_indicators(market_data)
            
            # 3. Run strategies
            signals = []
            for strategy in self.strategies:
                signal_data = strategy.evaluate(market_data, indicators)
                if signal_data:
                    signals.append(signal_data)
            
            # 4. Process signals
            if signals:
                self.process_signals(signals)
            
            logger.info(f"Analysis complete. Generated {len(signals)} signals")
            
        except Exception as e:
            logger.error(f"Error in market analysis: {e}")
    
    def process_signals(self, signals):
        """Process generated trading signals"""
        session = self.SessionLocal()
        try:
            for signal_data in signals:
                logger.info(f"Processing Signal: {signal_data}")
                
                # Check if signal already exists (prevent duplicates)
                existing = session.query(Signal).filter(
                    Signal.symbol == signal_data.get('symbol'),
                    Signal.strategy == signal_data.get('strategy'),
                    Signal.created_at >= datetime.utcnow().date() # Check signals from today
                ).first()
                
                if not existing:
                    new_signal = Signal(
                        symbol=signal_data.get('symbol'),
                        action=signal_data.get('action'),
                        confidence=signal_data.get('confidence', 0.0),
                        strategy=signal_data.get('strategy'),
                        reason=signal_data.get('reason'),
                        price=signal_data.get('price'),
                        target_price=signal_data.get('target_price'),
                        stop_loss=signal_data.get('stop_loss'),
                        is_active=True
                    )
                    session.add(new_signal)
                    logger.info(f"Signal saved to database: {signal_data.get('symbol')}")
            
            session.commit()
        except Exception as e:
            logger.error(f"Error saving signals: {e}")
            session.rollback()
        finally:
            session.close()
    
    def run(self):
        """Run the engine continuously"""
        logger.info("Starting AI Engine in 24/7 mode")
        
        # Schedule analysis
        schedule.every(AI_UPDATE_INTERVAL).seconds.do(self.analyze_markets)
        
        # Run immediately first time
        self.analyze_markets()
        
        # Keep running
        while True:
            schedule.run_pending()
            time.sleep(1)

if __name__ == "__main__":
    engine = AIEngine()
    engine.run()