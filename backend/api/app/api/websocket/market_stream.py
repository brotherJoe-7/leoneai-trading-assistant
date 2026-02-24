from fastapi import WebSocket, WebSocketDisconnect
import asyncio
import json
from datetime import datetime
import yfinance as yf

class MarketStream:
    """WebSocket stream for real-time market data"""
    
    def __init__(self):
        self.active_connections = []
        self.symbols = ["BTC-USD", "ETH-USD", "AAPL", "GOOGL"]
    
    async def connect(self, websocket: WebSocket):
        """Accept WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection"""
        self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific WebSocket client"""
        await websocket.send_json(message)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                self.active_connections.remove(connection)
    
    async def stream_market_data(self, websocket: WebSocket):
        """Stream market data to client"""
        await self.connect(websocket)
        
        try:
            while True:
                # Get current prices
                market_data = []
                for symbol in self.symbols:
                    try:
                        ticker = yf.Ticker(symbol)
                        hist = ticker.history(period="1d", interval="1m")
                        
                        if not hist.empty:
                            latest = hist.iloc[-1]
                            market_data.append({
                                "symbol": symbol,
                                "price": float(latest["Close"]),
                                "change": float(latest["Close"] - hist.iloc[-2]["Close"]) if len(hist) > 1 else 0,
                                "volume": int(latest["Volume"]),
                                "timestamp": datetime.now().isoformat()
                            })
                    except Exception as e:
                        print(f"Error getting {symbol}: {e}")
                
                # Send data
                await self.send_personal_message({
                    "type": "market_update",
                    "data": market_data,
                    "timestamp": datetime.now().isoformat()
                }, websocket)
                
                # Wait before next update
                await asyncio.sleep(5)  # 5-second updates
                
        except WebSocketDisconnect:
            self.disconnect(websocket)
        except Exception as e:
            print(f"WebSocket error: {e}")
            self.disconnect(websocket)

# Create singleton instance
market_stream = MarketStream()