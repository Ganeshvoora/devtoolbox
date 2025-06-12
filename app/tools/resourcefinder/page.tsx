"use client";
import PrivateRoute from "@/components/PrivateRoute";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type definitions
type ResourceItem = {
  title: string;
  link: string;
  type: 'link' | 'book';
  author?: string;
};

type ResourcesData = {
  [category: string]: ResourceItem[];
};

export default function ResourceFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resources, setResources] = useState<ResourcesData>({});
  const [hasSearched, setHasSearched] = useState(false);
  
  // API key should be stored in .env.local and accessed via environment variables
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus search input on page load
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearch = async () => {
    const query = searchQuery.trim();
    
    if (!query) {
      setErrorMessage('Please enter a search term');
      setResources({});
      return;
    }
    
    if (!apiKey) {
      setErrorMessage('API key is missing. Please check your environment variables.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setHasSearched(true);

    const prompt = `Provide learning resources for ${query} in the following format:
    **Video Tutorials:**
    * **Title:** [Video Title] **Link:** [URL]

    **Advanced Video Tutorials:**
    * **Title:** [Video Title] **Link:** [URL]
    
    **Official Documentation:**
    * **Title:** [Doc Title] **Link:** [URL]

    **Recommended Books (if want to buy):**
    * **Title:** [Book Title] **Author:** [Author Name] **Link:** [Amazon/Goodreads URL]
    
    **Recommended Books (free online):**
    * **Title:** [Book Title] **Author:** [Author Name] **Link:** [URL]
    
    Do not include any introductory text.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API returned status code ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const markdownResponse = data.candidates[0].content.parts[0].text;
        const parsedResources = parseMarkdownResponse(markdownResponse);
        setResources(parsedResources);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : 'Failed to fetch resources'}`);
      setResources({});
    } finally {
      setIsLoading(false);
    }
  };

  const parseMarkdownResponse = (markdown: string): ResourcesData => {
    const resources: ResourcesData = {};
    let currentCategory = '';
    
    const lines = markdown.split('\n');
    
    lines.forEach(line => {
      // Check for category header
      const categoryMatch = line.match(/^\*\*([^:]+):\*\*/);
      if (categoryMatch) {
        currentCategory = categoryMatch[1].trim();
        resources[currentCategory] = [];
        return;
      }
      
      // Check for resource item with different formats
      const videoMatch = line.match(/\*\s+\*\*Title:\*\*\s*(.*?)\s*\*\*Link:\*\*\s*(https?:\/\/[^\s]+)/);
      const bookMatch = line.match(/\*\s+\*\*Title:\*\*\s*(.*?)\s*\*\*Author:\*\*\s*(.*?)\s*\*\*Link:\*\*\s*(https?:\/\/[^\s]+)/);
      
      if (currentCategory && (videoMatch || bookMatch)) {
        if (bookMatch) {
          resources[currentCategory].push({
            title: bookMatch[1].trim(),
            author: bookMatch[2].trim(),
            link: bookMatch[3].trim(),
            type: 'book'
          });
        } else if (videoMatch) {
          resources[currentCategory].push({
            title: videoMatch[1].trim(),
            link: videoMatch[2].trim(),
            type: 'link'
          });
        }
      }
    });
    
    return resources;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <PrivateRoute>
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] mx-auto py-10 px-40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search Container */}
        <div className="text-center mb-8 bg-[#252526] p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0077ff] mb-6 text-shadow">
            &lt;DevResource Finder /&gt;
          </h1>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <input
              ref={searchInputRef}
              type="text"
              className="p-3 w-full sm:w-96 text-base bg-[#1e1e1e] border border-[#404040] text-[#d4d4d4] rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-[#0077ff] focus:border-transparent"
              placeholder="Search programming resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <motion.button
              onClick={handleSearch}
              className="p-3 px-6 text-base bg-[#0077ff] hover:bg-[#0066dd] text-white border-none cursor-pointer rounded-md font-mono transition-colors w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
            >
              {isLoading ? 'Searching()...' : 'Search()'}
            </motion.button>
          </div>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[#0077ff] text-xl mb-6"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-[#0077ff] rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-[#0077ff] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-[#0077ff] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="mt-2">Fetching the best resources...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[#ff4444] text-center bg-[rgba(255,0,0,0.1)] p-3 rounded-md mb-6"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Container */}
        {hasSearched && !isLoading && !errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-[#0077ff] mb-6 border-b border-[#404040] pb-2">
              Learning Resources for &quot;{searchQuery}&quot;
            </h2>

            {Object.keys(resources).length === 0 ? (
              <div className="bg-[#252526] p-6 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#0077ff] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#858585]">No resources found. Try a different search term.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(resources).map(([category, items]) => (
                  <motion.div
                    key={category}
                    className="bg-[#252526] p-4 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-[#0077ff] border-b-2 border-[#0077ff] pb-2 font-bold text-lg">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {items.map((resource, index) => (
                        <motion.a
                          key={index}
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            p-3 bg-[#1e1e1e] text-[#d4d4d4] border border-[#404040] cursor-pointer 
                            rounded-md font-mono transition-all hover:bg-[#0077ff] hover:text-white 
                            hover:border-[#0077ff] ${resource.type === 'book' ? 'flex flex-col items-start min-w-[200px] bg-[#252526] border-[#0077ff]' : ''}
                          `}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>{resource.title}</span>
                          {resource.type === 'book' && resource.author && (
                            <span className="text-sm text-[#858585] mt-1">by {resource.author}</span>
                          )}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Initial empty state */}
        {!hasSearched && !isLoading && !errorMessage && (
          <motion.div 
            className="mt-12 text-center text-[#858585]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-[#0077ff] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="mt-4 text-lg">Search for programming languages, frameworks, or tools to find the best learning resources</p>
            <div className="mt-6 text-sm">
              <p>Try searching for: 
                <button onClick={() => {setSearchQuery('React'); handleSearch();}} className="text-[#0077ff] hover:underline mx-2">React</button>|
                <button onClick={() => {setSearchQuery('Python'); handleSearch();}} className="text-[#0077ff] hover:underline mx-2">Python</button>|
                <button onClick={() => {setSearchQuery('TensorFlow'); handleSearch();}} className="text-[#0077ff] hover:underline mx-2">TensorFlow</button>|
                <button onClick={() => {setSearchQuery('Go language'); handleSearch();}} className="text-[#0077ff] hover:underline mx-2">Go language</button>
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
    </PrivateRoute>
  );
}