import React, { useState, useEffect } from 'react';
import { Bell, X, Globe2, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NewsPrompt } from '../utils/constants';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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
  const { skills } = useSelector((state) => state.auth.currentUser);

  const unreadCount = articles.filter(a => !a.isRead).length;

  useEffect(() => {
  const fetchNews = async () => {
    try {
      if (!skills || skills.length === 0) return;

      const lastFetched = localStorage.getItem("techNewsLastFetched");
      const cachedArticles = JSON.parse(localStorage.getItem("techNewsData"));
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; 

      // ✅ If cached news exists AND it's less than 24 hrs old → use cache
      if (cachedArticles && lastFetched && now - lastFetched < oneDay) {
        console.log("📌 Using cached news");
        setArticles(cachedArticles);
        return;
      }

      console.log("🌐 Fetching fresh news...");
      
      // --- Your API Logic (Gemini) ---
      const personalizedPrompt = NewsPrompt.replace(
        "{{skills}}",
        skills.join(", ")
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        systemInstruction: personalizedPrompt,
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Provide latest tech news relevant to ${skills.join(", ")}.`,
              },
            ],
          },
        ],
      });

      let responseText = result.response.text();

      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let newsData;
      try {
        newsData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, responseText);
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
        localStorage.setItem("techNewsLastFetched", Date.now());
      } else {
        console.warn("No valid news articles found.");
        setArticles([]);
      }

    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  fetchNews();
}, [skills]);


  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (index) => {
    setArticles(articles.map((article, i) => 
      i === index ? { ...article, isRead: true } : article
    ));
  };

  const markAllAsRead = () => {
    setArticles(articles.map(article => ({ ...article, isRead: true })));
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
          {filteredArticles.length === 0 ? (
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