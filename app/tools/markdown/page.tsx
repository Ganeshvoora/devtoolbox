'use client';
import PrivateRoute from "@/components/PrivateRoute";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Preview\n\nType your markdown here and see it rendered in real-time.\n\n## Features\n\n- **Bold text** and *italic text*\n- [Links](https://example.com)\n- Images: ![alt text](https://via.placeholder.com/150)\n- Code blocks:\n\n```javascript\nfunction hello() {\n  console.log("Hello world!");\n}\n```\n\n- Lists\n  - Nested items\n  - Another item\n\n> Blockquotes are also supported\n');
  const [copied, setCopied] = useState(false);

  // For local storage persistence
  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdownContent');
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }
  }, []);



  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearMarkdown = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      setMarkdown('');
    }
  };

  // Sample markdown examples
  const loadExample = (type: string) => {
    let example = '';
    
    switch(type) {
      case 'basic':
        example = '# Basic Markdown\n\nThis is a paragraph with **bold** and *italic* text.\n\n## Subheading\n\n- List item 1\n- List item 2\n- List item 3\n\n[Link to Google](https://google.com)';
        break;
      case 'code':
        example = '# Code Examples\n\n```javascript\n// JavaScript example\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n```\n\n```python\n# Python example\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))\n```';
        break;
      case 'advanced':
        example = '# Advanced Markdown\n\n**Bold text** and *italic text* and ~~strikethrough~~\n\n> This is a blockquote\n> \n> It can have multiple paragraphs\n\n- Unordered list\n  - Nested item\n  - Another nested item\n- Another item\n\n1. Ordered list\n2. Second item\n3. Third item\n\n---\n\n[Link with title](https://www.example.com "Link title")\n\n![Image alt text](https://via.placeholder.com/150 "Image title")';
        break;
      default:
        return;
    }
    
    if (markdown && !confirm('Replace current content with example?')) {
      return;
    }
    
    setMarkdown(example);
  };

  return (
    <PrivateRoute>
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-12 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <motion.div 
                className="text-blue-400 text-4xl mr-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold">Markdown Preview</h1>
                <p className="text-gray-400">Write and preview Markdown in real-time</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <motion.button 
                onClick={() => loadExample('basic')}
                className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load Basic Example
              </motion.button>
              <motion.button 
                onClick={() => loadExample('code')}
                className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load Code Example
              </motion.button>
              <motion.button 
                onClick={() => loadExample('advanced')}
                className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load Advanced Example
              </motion.button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-xl text-blue-400">Editor</h2>
                <div className="flex gap-2">
                  <motion.button
                    onClick={copyToClipboard}
                    className="text-xs flex items-center gap-1 text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    {copied ? 'Copied!' : 'Copy'}
                  </motion.button>
                  
                  <motion.button
                    onClick={clearMarkdown}
                    className="text-xs flex items-center gap-1 text-gray-300 hover:text-red-400 px-2 py-1 rounded hover:bg-gray-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear
                  </motion.button>
                </div>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-[70vh] p-4 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Type your markdown here..."
              />
            </div>
            
            {/* Preview */}
            <div className="flex flex-col h-full">
              <h2 className="font-semibold text-xl text-blue-400 mb-2">Preview</h2>
              <div className="h-[70vh] overflow-auto p-6 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                  <ReactMarkdown>
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>
              Write and preview standard Markdown syntax in real-time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </PrivateRoute>
  );
}