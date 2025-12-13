import React, { useState, useEffect } from 'react';
import { Bell, X, Globe2, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NewsPrompt } from '../utils/constants';

const NewsCard = ({ title, description, source, url, urlToImage, isRead, onMarkRead }) => {
  return (
    <div 
      className={`border-b border-base-200 p-4 hover:bg-base-200/50 transition-colors ${
        !isRead ? 'bg-primary/5' : ''
      }`}
    >
      {/* Image and Content Side by Side */}
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
          <img
            src={
              urlToImage ||
              "https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
            }
            alt="News"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-xs text-base-content/70 line-clamp-2 mb-2">
            {description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-base-content/60 truncate">
              {source?.name || "Unknown Source"}
            </span>
            <div className="flex items-center gap-2">
              {!isRead && (
                <button
                  onClick={onMarkRead}
                  className="badge badge-primary badge-xs"
                >
                  New
                </button>
              )}
              <a href={url} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-ghost btn-xs flex items-center gap-1">
                  <Globe2 size={12} />
                  Read
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechNews = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { skills } = useSelector((state) => state.auth.currentUser);

  const unreadCount = articles.filter(a => !a.isRead).length;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!skills || skills.length === 0) return;

        const lastFetched = localStorage.getItem("techNewsLastFetched");
        const cachedArticles = localStorage.getItem("techNewsData");
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; 

        // ✅ If cached news exists AND it's less than 24 hrs old → use cache
        if (cachedArticles && lastFetched && now - parseInt(lastFetched) < oneDay) {
          // console.log("📌 Using cached news (last fetched:", new Date(parseInt(lastFetched)).toLocaleString() + ")");
          setArticles(JSON.parse(cachedArticles));
          return;
        }

        // console.log("🌐 Fetching fresh news...");
        setIsLoading(true);
        setError(null);
        
        // 🔥 Updated: Using Groq API instead of Gemini
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: NewsPrompt
              },
              {
                role: 'user',
                content: `Provide 2 latest tech news articles relevant to ${skills.join(", ")}.`
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        let responseText = data.choices[0].message.content;

        // Clean up response
        responseText = responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        let newsData;
        try {
          newsData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError, responseText);
          setError("Failed to parse news data");
          return;
        }

        if (Array.isArray(newsData) && newsData.length > 0) {
          const articlesWithReadStatus = newsData.map(article => ({
            ...article,
            isRead: false
          }));

          setArticles(articlesWithReadStatus);

          // ✅ Store in localStorage for next day
          localStorage.setItem("techNewsData", JSON.stringify(articlesWithReadStatus));
          localStorage.setItem("techNewsLastFetched", Date.now().toString());
        } else {
          console.warn("No valid news articles found.");
          setArticles([]);
        }

      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [skills]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (index) => {
    const updatedArticles = articles.map((article, i) => 
      i === index ? { ...article, isRead: true } : article
    );
    setArticles(updatedArticles);
    // Update cache with read status
    localStorage.setItem("techNewsData", JSON.stringify(updatedArticles));
  };

  const markAllAsRead = () => {
    const updatedArticles = articles.map(article => ({ ...article, isRead: true }));
    setArticles(updatedArticles);
    // Update cache with read status
    localStorage.setItem("techNewsData", JSON.stringify(updatedArticles));
  };

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(a => !a.isRead);

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={toggleDrawer}
          className="btn btn-ghost bg-primary btn-circle relative"
          aria-label="Tech News"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleDrawer}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-base-100 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-base-200 bg-base-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Tech Stack News
            </h2>
            <button
              onClick={toggleDrawer}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setFilter('all')}
              className={`btn btn-sm ${
                filter === 'all' ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              All ({articles.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`btn btn-sm ${
                filter === 'unread' ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              Unread ({unreadCount})
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-ghost btn-sm ml-auto"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* News List */}
        <div className="overflow-y-auto h-full pb-20">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="mt-4 text-base-content/70">Loading news...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-16 h-16 mx-auto mb-3 opacity-20" />
              <p className="font-medium text-base-content/70">No news articles</p>
              <p className="text-sm text-base-content/50 mt-1">
                {filter === 'unread' ? "You're all caught up!" : "Check back later for updates"}
              </p>
            </div>
          ) : (
            filteredArticles.map((article, i) => (
              <NewsCard 
                key={i} 
                {...article} 
                onMarkRead={() => markAsRead(articles.indexOf(article))}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TechNews;