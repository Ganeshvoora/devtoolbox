"use client";
import PrivateRoute from "@/components/PrivateRoute";

import React, { useState, useEffect,useCallback } from 'react';
import { motion } from 'framer-motion';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTopic, setCurrentTopic] = useState('Technology');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Predefined topic buttons
  const topicButtons = [
    { name: '💻 Technology', value: 'Technology', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: '👨‍💻 Programming', value: 'Programming', color: 'bg-green-600 hover:bg-green-700' },
    { name: '🤖 AI', value: 'AI', color: 'bg-yellow-600 hover:bg-yellow-700' }
  ];

  const fetchNews = useCallback( async (topic: string = '') => {
    const searchQuery = topic || searchTerm || 'Technology';
    setCurrentTopic(searchQuery);
    setLoading(true);
    setError(null);
    
    try {
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        `https://news.google.com/rss/search?q=${searchQuery}&hl=en-IN&gl=IN&ceid=IN:en`
      )}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        setNews([]);
        setError('No news found for this search term.');
      } else {
        setNews(data.items.slice(0, 9));
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);
  useEffect(() => {
    fetchNews(currentTopic);
  }, [currentTopic, fetchNews]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  const shareNews = async (url: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Truncate description to a specific length
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (!text) return 'No description available.';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <PrivateRoute>
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto py-12 px-4">
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold mb-8 md:mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            📰 Discover Latest Tech News
          </span>
        </motion.h1>

        {/* Topic buttons */}
        <motion.div 
          className="flex gap-2 flex-wrap justify-center mb-8 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {topicButtons.map((button, index) => (
            <motion.button
              key={index}
              onClick={() => fetchNews(button.value)}
              className={`px-4 py-2 ${button.color} rounded-full text-sm whitespace-nowrap transition-all`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
            >
              {button.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Search bar */}
        <motion.form 
          className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto px-4 mb-8"
          onSubmit={handleSearch}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news..."
            className="w-full p-4 text-lg rounded-lg text-gray-900 bg-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-lg"
          />
          <motion.button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔍 Search
          </motion.button>
        </motion.form>

        {/* Current topic */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="inline-block bg-gray-800 px-4 py-2 rounded-full text-gray-300">
            Currently showing: <strong>{currentTopic}</strong> news
          </span>
        </motion.div>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
            <p className="text-gray-300">Loading news...</p>
          </div>
        )}

        {/* Error message */}
        {error && !loading && (
          <motion.div 
            className="text-center py-8 text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* News grid */}
        {!loading && !error && (
          <motion.div 
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {news.map((article, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800 hover:border-blue-500 transition-colors"
                variants={itemVariants}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {truncateDescription(stripHtml(article.description))}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Read More
                    </a>
                    <motion.button 
                      onClick={() => shareNews(article.link, article.title)}
                      className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No results */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl text-gray-400">No news articles found</h3>
            <p className="text-gray-500 mt-2">Try searching for a different topic</p>
          </div>
        )}
      </main>
    </div>
    </PrivateRoute>
  );
}