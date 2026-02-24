class SignalProcessor:
    """Process and filter trading signals"""
    
    def __init__(self, confidence_threshold: float = 70.0):
        self.confidence_threshold = confidence_threshold
        self.recent_signals = []
    
    def filter_signals(self, signals: list) -> list:
        """Filter signals based on confidence and recent history"""
        if not signals:
            return []
        
        # Filter by confidence threshold
        filtered = [s for s in signals if s.get('confidence', 0) >= self.confidence_threshold]
        
        # Remove duplicate signals for same symbol
        unique_signals = {}
        for signal in filtered:
            symbol = signal.get('symbol')
            if symbol not in unique_signals or \
               signal.get('confidence', 0) > unique_signals[symbol].get('confidence', 0):
                unique_signals[symbol] = signal
        
        return list(unique_signals.values())
    
    def combine_signals(self, signals_list: list) -> list:
        """Combine multiple signals for same asset"""
        combined = {}
        
        for signal in signals_list:
            symbol = signal.get('symbol')
            if symbol not in combined:
                combined[symbol] = {
                    'symbol': symbol,
                    'strategies': [],
                    'actions': {},
                    'total_confidence': 0,
                    'count': 0
                }
            
            combined[symbol]['strategies'].append(signal.get('strategy'))
            combined[symbol]['total_confidence'] += signal.get('confidence', 0)
            combined[symbol]['count'] += 1
            
            action = signal.get('action')
            if action not in combined[symbol]['actions']:
                combined[symbol]['actions'][action] = 0
            combined[symbol]['actions'][action] += 1
        
        # Create final signals
        final_signals = []
        for symbol, data in combined.items():
            avg_confidence = data['total_confidence'] / data['count']
            
            # Determine majority action
            actions = data['actions']
            majority_action = max(actions.items(), key=lambda x: x[1])[0]
            
            final_signals.append({
                'symbol': symbol,
                'action': majority_action,
                'confidence': avg_confidence,
                'strategies': data['strategies'],
                'signal_count': data['count']
            })
        
        return final_signals