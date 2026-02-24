import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, List
import os

class NotificationService:
    """Service for sending notifications"""
    
    def __init__(self):
        self.email_enabled = os.getenv("EMAIL_ENABLED", "false").lower() == "true"
        
    def send_email(self, to_email: str, subject: str, body: str, html_body: str = None) -> bool:
        """Send email notification"""
        if not self.email_enabled:
            print(f"[Mock Email] To: {to_email}, Subject: {subject}")
            print(f"Body: {body}")
            return True
        
        # TODO: Implement actual email sending
        # For now, just mock
        print(f"Would send email to {to_email}: {subject}")
        return True
    
    def send_signal_notification(self, user_email: str, signal: Dict[str, Any]) -> bool:
        """Send notification about a new signal"""
        subject = f"LeoneAI Signal: {signal.get('symbol')} - {signal.get('action')}"
        
        # Create email body
        body = f"""
        New Trading Signal Generated
        
        Symbol: {signal.get('symbol')}
        Action: {signal.get('action')}
        Confidence: {signal.get('confidence')}%
        Strategy: {signal.get('strategy')}
        Reason: {signal.get('reason', 'N/A')}
        
        Time: {signal.get('timestamp')}
        
        Login to your LeoneAI dashboard for more details.
        
        This is an automated message from LeoneAI Trading Assistant.
        """
        
        # HTML version
        html_body = f"""
        <html>
        <body>
            <h2>New Trading Signal Generated</h2>
            <table border="1" cellpadding="10" cellspacing="0">
                <tr><th>Symbol</th><td>{signal.get('symbol')}</td></tr>
                <tr><th>Action</th><td><strong>{signal.get('action')}</strong></td></tr>
                <tr><th>Confidence</th><td>{signal.get('confidence')}%</td></tr>
                <tr><th>Strategy</th><td>{signal.get('strategy')}</td></tr>
                <tr><th>Reason</th><td>{signal.get('reason', 'N/A')}</td></tr>
                <tr><th>Time</th><td>{signal.get('timestamp')}</td></tr>
            </table>
            <p>Login to your <a href="https://leoneai.com">LeoneAI dashboard</a> for more details.</p>
            <p><em>This is an automated message from LeoneAI Trading Assistant.</em></p>
        </body>
        </html>
        """
        
        return self.send_email(user_email, subject, body, html_body)
    
    def send_portfolio_alert(self, user_email: str, alert_type: str, details: Dict[str, Any]) -> bool:
        """Send portfolio alert"""
        subject = f"LeoneAI Portfolio Alert: {alert_type}"
        
        body = f"""
        Portfolio Alert
        
        Type: {alert_type}
        Details: {details.get('message', 'N/A')}
        
        Time: {details.get('timestamp', 'N/A')}
        
        Please check your portfolio for more details.
        """
        
        return self.send_email(user_email, subject, body)