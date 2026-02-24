from typing import List, Dict, Any
from datetime import datetime, timedelta

class SignalService:
    """Service for signal processing"""
    
    def __init__(self):
        self.recent_signals = []
    
    def process_signal(self, signal_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a trading signal"""
        # Add timestamp if not present
        if "timestamp" not in signal_data:
            signal_data["timestamp"] = datetime.now().isoformat()
        
        # Add ID if not present
        if "id" not in signal_data:
            signal_data["id"] = len(self.recent_signals) + 1
        
        # Add status
        signal_data["status"] = "NEW"
        signal_data["is_active"] = True
        
        # Store in recent signals (in-memory for demo)
        self.recent_signals.append(signal_data)
        
        # Keep only last 100 signals
        if len(self.recent_signals) > 100:
            self.recent_signals = self.recent_signals[-100:]
        
        return signal_data
    
    def get_signals(self, limit: int = 10, symbol: str = None) -> List[Dict[str, Any]]:
        """Get recent signals"""
        filtered = self.recent_signals.copy()
        
        if symbol:
            filtered = [s for s in filtered if s.get("symbol") == symbol]
        
        # Sort by timestamp descending
        filtered.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return filtered[:limit]
    
    def deactivate_old_signals(self, hours: int = 24):
        """Deactivate signals older than specified hours"""
        cutoff = datetime.now() - timedelta(hours=hours)
        
        for signal in self.recent_signals:
            signal_time = datetime.fromisoformat(signal.get("timestamp"))
            if signal_time < cutoff:
                signal["is_active"] = False
    
    def calculate_signal_stats(self) -> Dict[str, Any]:
        """Calculate signal statistics"""
        if not self.recent_signals:
            return {"total": 0, "accuracy": 0}
        
        active_signals = [s for s in self.recent_signals if s.get("is_active", True)]
        
        # Calculate average confidence
        confidences = [s.get("confidence", 0) for s in active_signals if s.get("confidence")]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        # Count by action
        actions = {}
        for signal in active_signals:
            action = signal.get("action", "UNKNOWN")
            actions[action] = actions.get(action, 0) + 1
        
        return {
            "total_signals": len(self.recent_signals),
            "active_signals": len(active_signals),
            "average_confidence": avg_confidence,
            "action_distribution": actions
        }