import requests
from textblob import TextBlob

class NewsAnalyzer:
    """Analyze news sentiment"""
    
    def __init__(self, api_key=None):
        self.api_key = api_key
        self.base_url = "https://newsapi.org/v2"
    
    def get_news_sentiment(self, query: str, language="en"):
        """Get sentiment for news about a query"""
        try:
            url = f"{self.base_url}/everything"
            params = {
                "q": query,
                "apiKey": self.api_key,
                "language": language,
                "sortBy": "publishedAt",
                "pageSize": 10
            }
            
            response = requests.get(url, params=params)
            if response.status_code == 200:
                articles = response.json().get("articles", [])
                sentiments = []
                
                for article in articles:
                    text = f"{article.get('title', '')} {article.get('description', '')}"
                    if text:
                        blob = TextBlob(text)
                        sentiments.append(blob.sentiment.polarity)
                
                if sentiments:
                    avg_sentiment = sum(sentiments) / len(sentiments)
                    return {
                        "sentiment": avg_sentiment,
                        "article_count": len(articles),
                        "positive_articles": len([s for s in sentiments if s > 0]),
                        "negative_articles": len([s for s in sentiments if s < 0])
                    }
        except Exception as e:
            print(f"News analysis error: {e}")
        
        return {"sentiment": 0, "article_count": 0}