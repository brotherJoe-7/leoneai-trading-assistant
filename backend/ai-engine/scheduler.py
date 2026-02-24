import schedule
import time
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class TradingScheduler:
    """Schedule trading analysis tasks"""
    
    def __init__(self):
        self.jobs = []
    
    def add_job(self, interval_minutes: int, task_func):
        """Add a scheduled job"""
        job = schedule.every(interval_minutes).minutes.do(task_func)
        self.jobs.append(job)
        logger.info(f"Scheduled job: {task_func.__name__} every {interval_minutes} minutes")
    
    def run_pending(self):
        """Run all pending jobs"""
        schedule.run_pending()
    
    def run_continuously(self):
        """Run scheduler continuously"""
        logger.info("Starting scheduler in continuous mode")
        try:
            while True:
                self.run_pending()
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Scheduler stopped by user")
    
    def clear_jobs(self):
        """Clear all scheduled jobs"""
        schedule.clear()
        self.jobs = []
        logger.info("Cleared all scheduled jobs")